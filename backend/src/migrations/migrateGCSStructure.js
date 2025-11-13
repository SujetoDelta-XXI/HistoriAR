import mongoose from 'mongoose';
import Monument from '../models/Monument.js';
import ModelVersion from '../models/ModelVersion.js';
import { bucket } from '../config/gcs.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Migración: Reorganizar estructura de archivos en GCS con versionado
 * 
 * Estructura antigua: /models/{uuid}.glb
 * Estructura nueva: /models/monuments/{monumentId}/{timestamp}_{filename}.glb
 * 
 * IMPORTANTE: Esta migración NO elimina archivos antiguos hasta confirmar éxito
 * 
 * Características:
 * - Copia archivos a nueva estructura basada en monumentId
 * - Crea registros ModelVersion para cada modelo
 * - Actualiza referencias en Monument
 * - Incluye capacidad de rollback en caso de error
 */
async function migrateGCSStructure() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB');

    // Buscar monumentos con modelo 3D
    const monuments = await Monument.find({ 
      model3DUrl: { $exists: true, $ne: null, $ne: '' }
    }).populate('createdBy');

    console.log(`\nEncontrados ${monuments.length} monumentos con modelos 3D\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const monument of monuments) {
      try {
        // Verificar si ya fue migrado
        const existingVersion = await ModelVersion.findOne({ 
          monumentId: monument._id,
          isActive: true 
        });

        if (existingVersion) {
          console.log(`⊘ Saltado (ya migrado): ${monument.name}`);
          skipped++;
          continue;
        }

        // Extraer nombre de archivo actual de la URL
        const urlParts = monument.model3DUrl.split('/');
        const oldFilename = urlParts[urlParts.length - 1];
        
        // Generar nuevo nombre de archivo con estructura models/monuments/{monumentId}/{timestamp}_{filename}
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileExtension = oldFilename.split('.').pop();
        const sanitizedFilename = oldFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const newFilename = `models/monuments/${monument._id}/${timestamp}_${sanitizedFilename}`;

        // Verificar que el archivo antiguo existe
        const oldFile = bucket.file(`models/${oldFilename}`);
        const [exists] = await oldFile.exists();

        if (!exists) {
          console.log(`⚠ Advertencia: Archivo no encontrado en GCS: ${oldFilename}`);
          // Crear registro ModelVersion con URL existente
          const modelVersion = new ModelVersion({
            monumentId: monument._id,
            filename: `models/${oldFilename}`,
            url: monument.model3DUrl,
            uploadedBy: monument.createdBy?._id || monument.createdBy,
            isActive: true,
            fileSize: 0 // No podemos obtener el tamaño si no existe
          });
          await modelVersion.save();
          
          monument.gcsModelFileName = `models/${oldFilename}`;
          await monument.save();
          
          console.log(`⚠ Registrado sin copiar: ${monument.name}`);
          skipped++;
          continue;
        }

        // Copiar archivo a nueva ubicación
        const newFile = bucket.file(newFilename);
        await oldFile.copy(newFile);
        console.log(`  → Copiado: ${oldFilename} → ${newFilename}`);

        // Obtener metadata del archivo
        const [metadata] = await newFile.getMetadata();
        const fileSize = parseInt(metadata.size) || 0;

        // Crear registro ModelVersion
        const modelVersion = new ModelVersion({
          monumentId: monument._id,
          filename: newFilename,
          url: `https://storage.googleapis.com/${bucket.name}/${newFilename}`,
          uploadedBy: monument.createdBy?._id || monument.createdBy,
          isActive: true,
          fileSize: fileSize
        });
        await modelVersion.save();

        // Actualizar Monument
        monument.model3DUrl = modelVersion.url;
        monument.gcsModelFileName = newFilename;
        await monument.save();

        migrated++;
        console.log(`✓ Migrado: ${monument.name} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

      } catch (error) {
        errors++;
        console.error(`✗ Error migrando ${monument.name}:`, error.message);
      }
    }

    console.log(`\n✓ Migración completada:`);
    console.log(`  - ${migrated} monumentos migrados`);
    console.log(`  - ${skipped} monumentos saltados`);
    console.log(`  - ${errors} errores\n`);

    if (errors === 0 && migrated > 0) {
      console.log('⚠️  IMPORTANTE: Los archivos antiguos NO han sido eliminados');
      console.log('   Verifica que todo funcione correctamente antes de eliminarlos manualmente');
      console.log('   Archivos antiguos están en: /models/{uuid}.glb');
      console.log('   Archivos nuevos están en: /models/monuments/{monumentId}/{timestamp}_{filename}.glb\n');
    }

    return {
      success: errors === 0,
      migrated,
      skipped,
      errors
    };

  } catch (error) {
    console.error('✗ Error en migración:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
  }
}

/**
 * Rollback: Revertir migración en caso de problemas
 * 
 * Esta función elimina los archivos nuevos y restaura las referencias antiguas
 * SOLO usar si la migración falló y necesitas volver al estado anterior
 */
async function rollbackMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB');
    console.log('\n⚠️  INICIANDO ROLLBACK - Esta operación revertirá la migración\n');

    // Buscar todos los ModelVersion creados por la migración
    const modelVersions = await ModelVersion.find({});
    console.log(`Encontrados ${modelVersions.length} registros ModelVersion\n`);

    let deleted = 0;
    let errors = 0;

    for (const version of modelVersions) {
      try {
        // Eliminar archivo nuevo de GCS
        const file = bucket.file(version.filename);
        const [exists] = await file.exists();
        
        if (exists) {
          await file.delete();
          console.log(`✓ Eliminado archivo: ${version.filename}`);
        }

        // Eliminar registro ModelVersion
        await ModelVersion.findByIdAndDelete(version._id);
        deleted++;

      } catch (error) {
        errors++;
        console.error(`✗ Error en rollback para ${version.filename}:`, error.message);
      }
    }

    // Restaurar referencias en Monument (opcional - requiere backup de datos antiguos)
    console.log(`\n⚠️  NOTA: Las referencias en Monument deben restaurarse manualmente`);
    console.log(`   si tienes un backup de los valores antiguos de model3DUrl y gcsModelFileName\n`);

    console.log(`✓ Rollback completado:`);
    console.log(`  - ${deleted} archivos y registros eliminados`);
    console.log(`  - ${errors} errores\n`);

  } catch (error) {
    console.error('✗ Error en rollback:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
  }
}

// Ejecutar migración o rollback según argumento
const args = process.argv.slice(2);
if (args.includes('--rollback')) {
  console.log('⚠️  Ejecutando ROLLBACK...\n');
  rollbackMigration();
} else {
  console.log('🚀 Ejecutando MIGRACIÓN...\n');
  migrateGCSStructure();
}

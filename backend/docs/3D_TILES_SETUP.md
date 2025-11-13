# 3D Tiles Processing Setup Guide

## 📋 Overview

Esta guía explica cómo configurar y usar el procesamiento de modelos 3D a 3D Tiles usando Cesium 3D Tiles Tools.

**NOTA:** Esta funcionalidad es **OPCIONAL** y no es requerida para el funcionamiento básico del sistema. Los modelos GLB/GLTF funcionan perfectamente sin procesamiento de tiles.

## 🎯 ¿Qué son los 3D Tiles?

3D Tiles es un estándar de Cesium para streaming progresivo de modelos 3D grandes. Beneficios:

- **Carga progresiva:** Solo carga los detalles visibles
- **Mejor rendimiento:** Especialmente para modelos grandes (>10MB)
- **Múltiples niveles de detalle (LOD):** Optimización automática
- **Streaming eficiente:** Reduce uso de memoria y ancho de banda

## 🔧 Instalación de Cesium 3D Tiles Tools

### Opción 1: Instalación Global con npm

```bash
npm install -g 3d-tiles-tools
```

Verificar instalación:
```bash
3d-tiles-tools --version
```

### Opción 2: Usando Docker

```bash
# Pull de la imagen
docker pull cesium/3d-tiles-tools

# Crear alias para facilitar uso
alias 3d-tiles-tools='docker run --rm -v $(pwd):/data cesium/3d-tiles-tools'
```

### Opción 3: Instalación Local (Desarrollo)

```bash
cd backend
npm install 3d-tiles-tools --save-dev
```

## 📦 Dependencias del Sistema

Cesium 3D Tiles Tools requiere:
- Node.js 18+
- Python 3.7+ (para algunas conversiones)
- Espacio en disco para archivos temporales

## 🚀 Uso del Servicio

### Procesamiento Automático

El servicio `tiles3DService.js` se integra automáticamente con el upload de modelos:

```javascript
import tiles3DService from './services/tiles3DService.js';

// En monumentsController.js
const tilesetUrl = await tiles3DService.processAndUploadTiles(
  fileBuffer,
  monumentName,
  monumentId,
  userId
);

if (tilesetUrl) {
  console.log('3D Tiles generated:', tilesetUrl);
  // Monument.model3DTilesUrl se actualiza automáticamente
} else {
  console.log('Tiles processing skipped (tools not installed)');
  // El modelo GLB original sigue disponible
}
```

### Procesamiento Manual

```javascript
// Verificar si las herramientas están instaladas
const isInstalled = await tiles3DService.isCesiumToolsInstalled();

if (isInstalled) {
  // Procesar modelo a tiles
  const tilesDir = await tiles3DService.processModelToTiles(
    modelPath,
    monumentName,
    timestamp
  );
  
  // Subir tiles a GCS
  const tilesetUrl = await tiles3DService.uploadTilesToGCS(
    tilesDir,
    monumentName,
    timestamp
  );
  
  console.log('Tileset URL:', tilesetUrl);
}
```

## 📁 Estructura de Archivos

### Antes del Procesamiento
```
backend/temp/tiles/
└── (vacío)
```

### Durante el Procesamiento
```
backend/temp/tiles/
├── Monumento_A_2024-11-09T10-30-00.glb  (temporal)
└── Monumento_A_2024-11-09T10-30-00/     (tiles generados)
    ├── tileset.json
    ├── 0.b3dm
    ├── 1.b3dm
    └── 2.b3dm
```

### En GCS (Después del Upload)
```
histori_ar/
└── models/
    └── Monumento_A/
        ├── Monumento_A_2024-11-09T10-30-00.glb  (modelo original)
        └── 2024-11-09T10-30-00/                  (tiles)
            ├── tileset.json
            ├── 0.b3dm
            ├── 1.b3dm
            └── 2.b3dm
```

## 🔄 Flujo de Procesamiento

1. **Upload de Modelo GLB/GLTF**
   - Usuario sube modelo desde Admin Panel
   - Modelo se guarda en GCS con versionado

2. **Verificación de Herramientas**
   - Sistema verifica si Cesium Tools está instalado
   - Si NO está instalado: continúa sin tiles (solo GLB)
   - Si está instalado: procede al paso 3

3. **Generación de Tiles**
   - Modelo se guarda temporalmente en `backend/temp/tiles/`
   - Cesium Tools genera tiles con 3 niveles de LOD
   - Tiles se guardan en directorio temporal

4. **Upload a GCS**
   - Todos los archivos de tiles se suben a GCS
   - Se mantiene estructura de directorios
   - URL del `tileset.json` se guarda en Monument

5. **Limpieza**
   - Archivos temporales se eliminan
   - Solo quedan archivos en GCS

6. **Actualización de Base de Datos**
   - `Monument.model3DTilesUrl` se actualiza
   - `ModelVersion.tilesUrl` se actualiza (si existe)

## ⚙️ Configuración

### Variables de Entorno

No se requieren variables adicionales. El servicio usa la configuración existente de GCS.

### Parámetros de Procesamiento

En `tiles3DService.js`:

```javascript
// Tamaño máximo de archivo para procesamiento
this.maxFileSize = 50 * 1024 * 1024; // 50MB

// Niveles de detalle (LOD)
'--levels', '3'  // 3 niveles de LOD

// Error geométrico (afecta calidad vs tamaño)
'--geometricError', '32'  // Valor por defecto
```

Ajustar según necesidades:
- **Más niveles:** Mejor streaming, más archivos
- **Menos niveles:** Menos archivos, menos granular
- **Error geométrico mayor:** Archivos más pequeños, menos detalle
- **Error geométrico menor:** Más detalle, archivos más grandes

## 🐛 Troubleshooting

### Error: "3d-tiles-tools: command not found"

**Solución:**
```bash
# Verificar instalación
which 3d-tiles-tools

# Si no está instalado
npm install -g 3d-tiles-tools

# O usar Docker
docker pull cesium/3d-tiles-tools
```

### Error: "Tiles processing failed"

**Causas comunes:**
1. Modelo GLB corrupto o inválido
2. Falta de espacio en disco
3. Permisos insuficientes en directorio temp

**Solución:**
```bash
# Verificar espacio en disco
df -h

# Verificar permisos
ls -la backend/temp/

# Limpiar archivos temporales
rm -rf backend/temp/tiles/*
```

### Tiles no se generan pero no hay error

El sistema está diseñado para **fallar silenciosamente** si Cesium Tools no está instalado. Esto es intencional para que el sistema funcione sin tiles.

**Verificar:**
```bash
# En el servidor
node -e "require('./src/services/tiles3DService.js').default.isCesiumToolsInstalled().then(console.log)"
```

### Archivos temporales no se eliminan

**Solución manual:**
```bash
# Limpiar directorio temporal
rm -rf backend/temp/tiles/*

# El directorio se recreará automáticamente
```

## 📊 Comparación: GLB vs 3D Tiles

| Aspecto | GLB Original | 3D Tiles |
|---------|-------------|----------|
| **Tamaño inicial** | Todo el archivo | Solo tileset.json (~1KB) |
| **Carga progresiva** | ❌ No | ✅ Sí |
| **Memoria usada** | Todo el modelo | Solo tiles visibles |
| **Tiempo de carga** | Completo antes de mostrar | Muestra inmediatamente |
| **Mejor para** | Modelos pequeños (<5MB) | Modelos grandes (>10MB) |
| **Compatibilidad** | Universal | Requiere Cesium/Three.js |
| **Procesamiento** | No requerido | Requiere Cesium Tools |

## 🎯 Recomendaciones

### Cuándo usar 3D Tiles:
- ✅ Modelos grandes (>10MB)
- ✅ Modelos muy detallados
- ✅ Necesitas streaming progresivo
- ✅ Tienes Cesium Tools instalado

### Cuándo NO usar 3D Tiles:
- ❌ Modelos pequeños (<5MB)
- ❌ No tienes Cesium Tools
- ❌ Necesitas máxima compatibilidad
- ❌ Desarrollo rápido sin configuración

## 🔐 Seguridad

### Validaciones Implementadas:
- ✅ Tamaño máximo de archivo (50MB)
- ✅ Formatos permitidos (GLB, GLTF)
- ✅ Limpieza automática de archivos temporales
- ✅ Validación de permisos de GCS

### Consideraciones:
- Los archivos temporales se eliminan después del procesamiento
- Solo usuarios admin pueden subir modelos
- Los tiles se almacenan en la misma estructura segura de GCS

## 📚 Referencias

- [Cesium 3D Tiles Specification](https://github.com/CesiumGS/3d-tiles)
- [3D Tiles Tools Documentation](https://github.com/CesiumGS/3d-tiles-tools)
- [Cesium Ion (Servicio en la nube)](https://cesium.com/ion/)

## 💡 Alternativas

Si no quieres instalar Cesium Tools localmente:

1. **Cesium Ion (Recomendado para producción)**
   - Servicio en la nube de Cesium
   - Procesamiento automático
   - CDN global
   - Costo: Gratis hasta 5GB/mes

2. **Procesamiento Manual**
   - Usar Cesium Ion para procesar
   - Descargar tiles
   - Subir manualmente a GCS

3. **Sin Tiles**
   - Usar solo modelos GLB
   - Funciona perfectamente para modelos <10MB
   - Sin configuración adicional

## ✅ Checklist de Implementación

- [ ] Instalar Cesium 3D Tiles Tools
- [ ] Verificar instalación con `3d-tiles-tools --version`
- [ ] Crear directorio `backend/temp/tiles/`
- [ ] Configurar permisos de escritura
- [ ] Probar procesamiento con modelo de prueba
- [ ] Verificar upload a GCS
- [ ] Verificar limpieza de archivos temporales
- [ ] Documentar en README del proyecto

---

**Última actualización:** Noviembre 9, 2025  
**Estado:** Implementación de referencia completa  
**Nota:** Funcionalidad opcional, no requerida para operación básica

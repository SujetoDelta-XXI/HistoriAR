# Guía de Optimización de Modelos 3D para AR Móvil

## Problema Actual
Los modelos 3D de hasta 50MB causan:
- ⏱️ Tiempos de carga largos
- 🐌 Lag y stuttering en la experiencia AR
- 💥 Crashes en dispositivos de gama media/baja
- 📶 Consumo excesivo de datos móviles

**Límite actual del sistema:** 50MB (configurado en backend)

## Especificaciones Recomendadas para AR Móvil

### Tamaño de Archivo
- ✅ **Óptimo:** 1-5 MB
- ⚠️ **Aceptable:** 5-10 MB
- ❌ **Evitar:** >10 MB

### Geometría
- ✅ **Óptimo:** 10,000-50,000 triángulos
- ⚠️ **Aceptable:** 50,000-100,000 triángulos
- ❌ **Evitar:** >100,000 triángulos

### Texturas
- ✅ **Resolución:** 1024x1024 o 2048x2048 máximo
- ✅ **Formato:** JPEG para color, PNG solo si necesitas transparencia
- ✅ **Compresión:** Usar compresión de texturas (KTX2, Basis Universal)

### Materiales
- ✅ Usar PBR (Physically Based Rendering) estándar
- ✅ Máximo 2-3 materiales por modelo
- ❌ Evitar shaders complejos o custom

## Herramientas de Optimización

### 1. glTF-Transform (Recomendado)
```bash
npm install -g @gltf-transform/cli

# Optimizar modelo
gltf-transform optimize input.glb output.glb \
  --texture-compress webp \
  --simplify \
  --weld \
  --dedup

# Ver estadísticas
gltf-transform inspect model.glb
```

### 2. Blender (Manual)
1. Importar modelo GLB
2. Aplicar modificador "Decimate" para reducir polígonos
3. Reducir resolución de texturas (Image > Resize)
4. Exportar como GLB con opciones:
   - ✅ Apply Modifiers
   - ✅ Compression: Draco (si es compatible)
   - ✅ Limit to Selected Objects

### 3. Online: glTF Viewer + Optimizer
- https://gltf.report/ - Ver estadísticas
- https://products.aspose.app/3d/compress - Comprimir online

## Checklist de Optimización

Antes de subir un modelo, verifica:

- [ ] Tamaño de archivo < 10 MB
- [ ] Número de triángulos < 100,000
- [ ] Texturas ≤ 2048x2048
- [ ] Texturas comprimidas (JPEG/WebP)
- [ ] Sin geometría duplicada
- [ ] Sin vértices sueltos
- [ ] Materiales consolidados
- [ ] Probado en dispositivo móvil real

## Ejemplo de Optimización

### Antes:
```
Archivo: monumento.glb (45 MB)
Triángulos: 850,000
Texturas: 4096x4096 PNG (x5)
Materiales: 12
```

### Después:
```
Archivo: monumento_optimized.glb (4.2 MB)
Triángulos: 45,000
Texturas: 1024x1024 JPEG (x2)
Materiales: 2
```

**Resultado:** Carga 10x más rápido, sin lag, funciona en gama media.

## Recomendaciones por Tipo de Monumento

### Estatuas/Esculturas Pequeñas
- Tamaño: 2-5 MB
- Triángulos: 20,000-40,000
- Texturas: 1024x1024

### Edificios/Monumentos Grandes
- Tamaño: 5-8 MB
- Triángulos: 40,000-80,000
- Texturas: 2048x2048 (fachada principal), 1024x1024 (detalles)

### Objetos Decorativos
- Tamaño: 1-3 MB
- Triángulos: 10,000-20,000
- Texturas: 512x512 o 1024x1024

## Próximos Pasos

1. **Auditar modelos existentes:** Revisar todos los modelos actuales
2. **Establecer límites más estrictos:** Reducir límite de 50MB a 10MB
3. **Validación automática:** Rechazar modelos con >100k triángulos
4. **Guía para creadores:** Compartir esta guía con quien crea los modelos

# app_movil

Aplicación Flutter móvil de HistoriAR.

## Mapas y ubicación

La pantalla `ExploreScreen` utiliza `flutter_map` y el paquete `geolocator` para mostrar un mapa centrado en Lima y permitir centrar el mapa en la ubicación actual del usuario.

### Dependencias

En `pubspec.yaml` se utilizan, entre otras, las siguientes dependencias relacionadas con mapas y ubicación:

```yaml
dependencies:
  flutter_map: ^8.2.2
  latlong2: ^0.9.1
  geolocator: ^14.0.2
```

### Permisos en Android

Para permitir el acceso a la ubicación en Android, se añadieron los siguientes permisos en `android/app/src/main/AndroidManifest.xml` dentro de la etiqueta `<manifest>`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Permisos en iOS

Para iOS, se configuró el mensaje que ve el usuario cuando la app solicita acceso a la ubicación. Esto se agregó en `ios/Runner/Info.plist` dentro del `<dict>` principal:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para mostrarte el mapa.</string>
```

### Uso en la app

En `lib/screens/explore_screen.dart` se usa `Geolocator` para:

- Verificar si el servicio de ubicación está habilitado.
- Solicitar permisos de ubicación en tiempo de ejecución.
- Obtener la posición actual (`getCurrentPosition`).
- Mover el mapa (`MapController.move`) a la ubicación del usuario con un zoom adecuado.

El botón flotante de "mi ubicación" en la esquina inferior derecha llama a este flujo para centrar el mapa en la posición actual del usuario.

### Ejecución

Desde la carpeta `app_movil`:

```powershell
flutter pub get
flutter run
```

En Android, asegúrate de probar en un dispositivo o emulador con servicios de ubicación habilitados. En iOS, prueba en dispositivo real o configurando la ubicación simulada en el simulador.

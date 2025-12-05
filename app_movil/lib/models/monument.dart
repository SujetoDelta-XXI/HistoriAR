import 'package:latlong2/latlong.dart';

/// Modelo de dominio para un monumento tal como lo usa la app móvil.
class Monument {
  final String id;
  final String name;
  final String description;
  final String status; // Disponible, Visitado, Oculto, etc.
  final LatLng position;
  final String? imageUrl;
  final String? model3DUrl;
  final String? district;

  const Monument({
    required this.id,
    required this.name,
    required this.description,
    required this.status,
    required this.position,
    this.imageUrl,
    this.model3DUrl,
    this.district,
  });

  factory Monument.fromJson(Map<String, dynamic> json) {
    final location = json['location'] as Map<String, dynamic>?;

    if (location == null || location['lat'] == null || location['lng'] == null) {
      throw const FormatException('Monument sin coordenadas válidas');
    }

    final double lat = (location['lat'] as num).toDouble();
    final double lng = (location['lng'] as num).toDouble();

    return Monument(
      id: json['_id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'Disponible',
      position: LatLng(lat, lng),
      imageUrl: json['imageUrl'] as String?,
      model3DUrl: json['model3DUrl'] as String?,
      district: (location['district'] as String?) ?? '',
    );
  }
}

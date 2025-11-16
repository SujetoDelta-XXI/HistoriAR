import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/monument.dart';

/// Servicio responsable de obtener monumentos desde la API.
class MonumentsService {
  MonumentsService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  /// Base URL del backend. En un futuro podría venir desde configuración.
  final String baseUrl = 'http://localhost:4000';

  Future<List<Monument>> fetchMonuments() async {
    final uri = Uri.parse('$baseUrl/api/monuments');
    final response = await _client.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Error HTTP al obtener monumentos: ${response.statusCode}');
    }

    final decoded = json.decode(response.body) as Map<String, dynamic>;
    final items = (decoded['items'] as List<dynamic>? ?? []);

    return items
        .map((raw) => Monument.fromJson(raw as Map<String, dynamic>))
        .toList();
  }
}

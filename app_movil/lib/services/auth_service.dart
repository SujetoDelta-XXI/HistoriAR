import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_config.dart';

class AuthService {
  static const String _basePath = '/api/auth';

  Future<String> login({
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$apiBaseUrl$_basePath/login');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final data = jsonDecode(response.body);
      final token = data['token'] as String?;
      if (token == null) {
        throw Exception('Respuesta inesperada del servidor');
      }
      return token;
    } else {
      String message = 'Error al iniciar sesión';
      try {
        final data = jsonDecode(response.body);
        if (data is Map && data['message'] is String) {
          message = data['message'] as String;
        }
      } catch (_) {}
      throw Exception(message);
    }
  }

  /// Valida un token existente contra /api/auth/validate.
  /// Si es válido, devuelve true; si no, lanza una excepción.
  Future<bool> validateToken(String token) async {
    final uri = Uri.parse('$apiBaseUrl$_basePath/validate');

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return true;
    } else {
      String message = 'Token inválido';
      try {
        final data = jsonDecode(response.body);
        if (data is Map && data['message'] is String) {
          message = data['message'] as String;
        }
      } catch (_) {}
      throw Exception(message);
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$apiBaseUrl$_basePath/register');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return;
    } else {
      String message = 'Error al crear la cuenta';
      try {
        final data = jsonDecode(response.body);
        if (data is Map && data['message'] is String) {
          message = data['message'] as String;
        }
      } catch (_) {}
      throw Exception(message);
    }
  }
}
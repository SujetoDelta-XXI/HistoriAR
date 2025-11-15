import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class AuthService {
  static const String _baseUrl = 'http://192.168.81.40:4000/api/auth';

  // Usuario de desarrollo
  static const String _devEmail = 'dev@historiar.test';
  static const String _devPassword = '123456';
  static const String _devToken = 'DEV_TOKEN';

  Future<String> login({
    required String email,
    required String password,
  }) async {
    // Login de desarrollo sin API (solo en modo debug)
    if (kDebugMode && email == _devEmail && password == _devPassword) {
      return _devToken;
    }

    final uri = Uri.parse('$_baseUrl/login');

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

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$_baseUrl/register');

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
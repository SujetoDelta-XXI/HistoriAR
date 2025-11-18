class AuthState {
  String token = '';

  bool get isLoggedIn => token.isNotEmpty;
}

// Estado global simple para autenticación.
final AuthState authState = AuthState();
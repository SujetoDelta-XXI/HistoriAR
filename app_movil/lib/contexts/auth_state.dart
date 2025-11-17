class AuthState {
  String? token;

  bool get isLoggedIn => token != null;
}

// Estado global simple para autenticación.
final AuthState authState = AuthState();

import 'package:flutter/material.dart';

class ConfigurationScreen extends StatefulWidget {
  const ConfigurationScreen({super.key});

  @override
  State<ConfigurationScreen> createState() => _ConfigurationScreenState();
}

class _ConfigurationScreenState extends State<ConfigurationScreen> {
  bool notifications = true;
  bool location = true;
  bool arEffects = true;
  bool sound = true;
  bool highQuality = true;
  bool offlineMode = false;
  bool dataUsage = false;

  @override
  Widget build(BuildContext context) {
    final appInfo = {
      "version": "2.1.4",
      "build": "Build 2024.01.15",
      "lastUpdate": "15 Ene 2024",
    };

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Configuración',
          style: TextStyle(color: Colors.black),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: false,
        iconTheme: const IconThemeData(color: Colors.black),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(24),
          child: Padding(
            padding: EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Ajustes y preferencias de la app',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          child: ListView(
            children: [
              _SectionTitle(
                icon: Icons.notifications_active_outlined,
                title: 'Notificaciones y Permisos',
              ),
              _SettingsCard(
                children: [
                  _SwitchTile(
                    icon: Icons.notifications_outlined,
                    title: 'Notificaciones Push',
                    subtitle:
                        'Recibir alertas sobre nuevos monumentos y eventos',
                    value: notifications,
                    onChanged: (v) => setState(() => notifications = v),
                  ),
                  const Divider(height: 0),
                  _SwitchTile(
                    icon: Icons.location_on_outlined,
                    title: 'Acceso a Ubicación',
                    subtitle:
                        'Permitir acceso para experiencias basadas en ubicación',
                    value: location,
                    onChanged: (v) => setState(() => location = v),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              _SectionTitle(
                icon: Icons.camera_alt_outlined,
                title: 'Realidad Aumentada',
              ),
              _SettingsCard(
                children: [
                  _SwitchTile(
                    icon: Icons.auto_awesome_outlined,
                    title: 'Efectos AR Avanzados',
                    subtitle: 'Habilitar partículas y efectos visuales en RA',
                    value: arEffects,
                    onChanged: (v) => setState(() => arEffects = v),
                  ),
                  const Divider(height: 0),
                  _SwitchTile(
                    icon: Icons.phone_android_outlined,
                    title: 'Calidad Alta',
                    subtitle:
                        'Renderizado de alta calidad (consume más batería)',
                    value: highQuality,
                    onChanged: (v) => setState(() => highQuality = v),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              _SectionTitle(
                icon: Icons.volume_up_outlined,
                title: 'Audio',
              ),
              _SettingsCard(
                children: [
                  _SwitchTile(
                    icon: Icons.volume_up_outlined,
                    title: 'Efectos de Sonido',
                    subtitle: 'Reproducir sonidos al interactuar con monumentos',
                    value: sound,
                    onChanged: (v) => setState(() => sound = v),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              _SectionTitle(
                icon: Icons.storage_outlined,
                title: 'Datos y Almacenamiento',
              ),
              _SettingsCard(
                children: [
                  _SwitchTile(
                    icon: Icons.wifi_off_outlined,
                    title: 'Modo Offline',
                    subtitle: 'Usar contenido descargado sin conexión',
                    value: offlineMode,
                    onChanged: (v) => setState(() => offlineMode = v),
                  ),
                  const Divider(height: 0),
                  _SwitchTile(
                    icon: Icons.network_cell_outlined,
                    title: 'Optimizar Datos',
                    subtitle: 'Reducir el uso de datos móviles',
                    value: dataUsage,
                    onChanged: (v) => setState(() => dataUsage = v),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              _SectionTitle(
                icon: Icons.info_outline,
                title: 'Información de la App',
              ),
              Card(
                elevation: 1,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _InfoRow(
                        label: 'Versión',
                        value: appInfo["version"]!,
                      ),
                      const Divider(),
                      _InfoRow(
                        label: 'Build',
                        value: appInfo["build"]!,
                      ),
                      const Divider(),
                      _InfoRow(
                        label: 'Última actualización',
                        value: appInfo["lastUpdate"]!,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              Card(
                elevation: 1,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    _OptionTile(
                      icon: Icons.privacy_tip_outlined,
                      title: 'Privacidad y Seguridad',
                      subtitle: 'Gestiona tus datos y privacidad',
                      onTap: () {},
                    ),
                    const Divider(height: 0),
                    _OptionTile(
                      icon: Icons.help_outline,
                      title: 'Ayuda y Soporte',
                      subtitle: 'FAQ, tutoriales y contacto',
                      onTap: () {},
                    ),
                    const Divider(height: 0),
                    _OptionTile(
                      icon: Icons.battery_saver_outlined,
                      title: 'Optimización de Batería',
                      subtitle: 'Consejos para ahorrar batería',
                      onTap: () {},
                    ),
                    const Divider(height: 0),
                    _OptionTile(
                      icon: Icons.logout,
                      title: 'Cerrar Sesión',
                      subtitle: 'Salir de tu cuenta',
                      onTap: () {
                        // TODO: logout
                      },
                      isDestructive: true,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF4E6),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFFD9A6)),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFFFF6600),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.battery_saver_outlined,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Consejos de Rendimiento',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            '• Desactiva "Calidad Alta" para ahorrar batería\n'
                            '• Activa "Optimizar Datos" en conexiones móviles\n'
                            '• Usa el modo offline cuando sea posible\n'
                            '• Ajusta los efectos AR según tu dispositivo',
                            style: TextStyle(fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final IconData icon;
  final String title;

  const _SectionTitle({
    required this.icon,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: const BoxDecoration(
            color: Color(0xFFFF6600),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.white, size: 18),
        ),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

class _SettingsCard extends StatelessWidget {
  final List<Widget> children;

  const _SettingsCard({required this.children});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(children: children),
    );
  }
}

class _SwitchTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SwitchTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.grey.shade100,
        child: Icon(icon, color: Colors.grey.shade700),
      ),
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.w500),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: Colors.grey),
      ),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: const Color(0xFFFF6600),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _OptionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool isDestructive;

  const _OptionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = isDestructive ? Colors.red : Colors.black;
    final subtitleColor = isDestructive ? Colors.red.shade300 : Colors.grey;

    return ListTile(
      onTap: onTap,
      leading: Icon(icon, color: subtitleColor),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: color,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(color: subtitleColor),
      ),
    );
  }
}
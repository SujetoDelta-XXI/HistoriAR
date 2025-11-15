import 'package:flutter/material.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Barra superior: título + subtítulo
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Explorar',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Monumentos de Lima',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),

            // Leyenda de estados
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    _LegendDot(color: Colors.green, label: 'Disponible'),
                    SizedBox(width: 12),
                    _LegendDot(color: Colors.blue, label: 'Visitado'),
                    SizedBox(width: 12),
                    _LegendDot(color: Colors.red, label: 'Muy lejos'),
                    SizedBox(width: 12),
                    _LegendDot(color: Colors.grey, label: 'Oculto'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Zona principal (mapa “placeholder”)
            Expanded(
              child: Stack(
                children: [
                  // Fondo del mapa
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2F9E6),
                    ),
                  ),

                  // Cuadrícula ligera (solo para parecer mapa)
                  CustomPaint(
                    size: Size.infinite,
                    painter: _GridPainter(),
                  ),

                  // Ejemplo de marcadores
                  Positioned(
                    right: 40,
                    top: 80,
                    child: _MarkerChip(distance: '5200m', color: Colors.grey),
                  ),
                  Positioned(
                    left: 60,
                    bottom: 140,
                    child: _MarkerCluster(),
                  ),
                  Positioned(
                    right: 24,
                    bottom: 180,
                    child: _MarkerChip(distance: '850m', color: Colors.green),
                  ),

                  // Botones + / - en la parte superior derecha
                  Positioned(
                    top: 80,
                    right: 20,
                    child: Column(
                      children: [
                        _SquareIconButton(
                          icon: Icons.add,
                          onTap: () {},
                        ),
                        const SizedBox(height: 8),
                        _SquareIconButton(
                          icon: Icons.remove,
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),

                  // Botones de buscar / capas en top-right (pero un poco más arriba)
                  Positioned(
                    top: 20,
                    right: 20,
                    child: Row(
                      children: [
                        _SquareIconButton(
                          icon: Icons.search,
                          onTap: () {},
                        ),
                        const SizedBox(width: 8),
                        _SquareIconButton(
                          icon: Icons.layers_outlined,
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),

                  // Botón de “mi ubicación” abajo a la derecha
                  Positioned(
                    right: 20,
                    bottom: 24,
                    child: FloatingActionButton(
                      backgroundColor: Colors.white,
                      elevation: 4,
                      onPressed: () {},
                      child: const Icon(
                        Icons.navigation_rounded,
                        color: Colors.orange,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;

  const _LegendDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}

class _SquareIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _SquareIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      elevation: 3,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: SizedBox(
          width: 40,
          height: 40,
          child: Icon(icon, size: 22),
        ),
      ),
    );
  }
}

/// Marcador simple con distancia
class _MarkerChip extends StatelessWidget {
  final String distance;
  final Color color;

  const _MarkerChip({required this.distance, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(999),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Text(
            distance,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: const Icon(
            Icons.help_outline,
            color: Colors.white,
            size: 22,
          ),
        ),
      ],
    );
  }
}

/// Cluster simple de marcadores en verde/rojo alrededor
class _MarkerCluster extends StatelessWidget {
  const _MarkerCluster();

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // principal
        Container(
          width: 52,
          height: 52,
          decoration: const BoxDecoration(
            color: Colors.green,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: const Icon(
            Icons.account_balance,
            color: Colors.white,
          ),
        ),
        Positioned(
          top: -10,
          left: -10,
          child: _smallMarker(Colors.green),
        ),
        Positioned(
          top: -8,
          right: -8,
          child: _smallMarker(Colors.red),
        ),
        Positioned(
          bottom: -8,
          right: -6,
          child: _smallMarker(Colors.green),
        ),
      ],
    );
  }

  Widget _smallMarker(Color color) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
    );
  }
}

/// Dibuja una cuadrícula suave para simular el mapa
class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.3)
      ..strokeWidth = 1;

    const step = 80.0;

    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
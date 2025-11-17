import 'dart:io';

import 'package:flutter/material.dart';
import 'package:ar_flutter_plugin_plus/ar_flutter_plugin_plus.dart';
import 'package:ar_flutter_plugin_plus/datatypes/config_planedetection.dart';
import 'package:ar_flutter_plugin_plus/datatypes/node_types.dart';
import 'package:ar_flutter_plugin_plus/managers/ar_anchor_manager.dart';
import 'package:ar_flutter_plugin_plus/managers/ar_location_manager.dart';
import 'package:ar_flutter_plugin_plus/managers/ar_object_manager.dart';
import 'package:ar_flutter_plugin_plus/managers/ar_session_manager.dart';
import 'package:ar_flutter_plugin_plus/models/ar_node.dart';
import 'package:vector_math/vector_math_64.dart' as vmath;

import '../models/monument.dart';
import 'quiz_screen.dart';

class ArCameraScreen extends StatefulWidget {
  final Monument monument;
	final String token;

  const ArCameraScreen({super.key, required this.monument, required this.token});

  @override
  State<ArCameraScreen> createState() => _ArCameraScreenState();
}

class _ArCameraScreenState extends State<ArCameraScreen> {
  ARSessionManager? arSessionManager;
  ARObjectManager? arObjectManager;
  ARNode? webObjectNode;

  double _scaleFactor = 0.2;
  double _rotationY = 0.0; // en radianes
  double _baseScale = 0.2;
  double _baseRotationY = 0.0;
  vmath.Vector2 _offset = vmath.Vector2(0.0, 0.0);
  vmath.Vector2 _baseOffset = vmath.Vector2(0.0, 0.0);

  @override
  void dispose() {
    arSessionManager?.dispose();
    super.dispose();
  }

  void onARViewCreated(
    ARSessionManager arSessionManager,
    ARObjectManager arObjectManager,
    ARAnchorManager arAnchorManager,
    ARLocationManager arLocationManager,
  ) {
    this.arSessionManager = arSessionManager;
    this.arObjectManager = arObjectManager;

    this.arSessionManager!.onInitialize(
      showFeaturePoints: false,
      showPlanes: true,
      customPlaneTexturePath: "Images/triangle.png",
      showWorldOrigin: false,
      handleTaps: false,
    );
    this.arObjectManager!.onInitialize();

    _addWebObjectForMonument();
  }

  Future<void> _addWebObjectForMonument() async {
    final url = widget.monument.model3DUrl;
    if (url == null || url.isEmpty) {
      stdout.writeln('Monumento sin model3DUrl');
      return;
    }

    if (webObjectNode != null) {
      await arObjectManager?.removeNode(webObjectNode!);
      webObjectNode = null;
    }

    final transform = vmath.Matrix4.identity()
      ..setTranslationRaw(0.0, 0.0, -1.0)
      ..rotateY(_rotationY)
      ..scale(_scaleFactor);

    final newNode = ARNode(
      type: NodeType.webGLB,
      uri: url,
      transformation: transform,
    );

    final didAdd = await arObjectManager?.addNode(newNode);
    if (didAdd == true) {
      webObjectNode = newNode;
    }
  }

  void _updateNodeTransform() {
    if (webObjectNode == null) return;

    final transform = vmath.Matrix4.identity()
      ..setTranslationRaw(_offset.x, _offset.y, -1.0)
      ..rotateY(_rotationY)
      ..scale(_scaleFactor);

    webObjectNode!.transform = transform;
  }

  void _zoomIn() {
    if (webObjectNode == null) return;
    setState(() {
      _scaleFactor = (_scaleFactor + 0.05).clamp(0.05, 1.0);
    });
    _updateNodeTransform();
  }

  void _zoomOut() {
    if (webObjectNode == null) return;
    setState(() {
      _scaleFactor = (_scaleFactor - 0.05).clamp(0.05, 1.0);
    });
    _updateNodeTransform();
  }

  void _rotateRight() {
    if (webObjectNode == null) return;
    setState(() {
      _rotationY += 0.2;
    });
    _updateNodeTransform();
  }

  void _resetTransform() {
    if (webObjectNode == null) return;
    setState(() {
      _scaleFactor = 0.2;
      _rotationY = 0.0;
      _offset = vmath.Vector2(0.0, 0.0);
    });
    _updateNodeTransform();
  }

  @override
  Widget build(BuildContext context) {
    final monument = widget.monument;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          GestureDetector(
            onScaleStart: (details) {
              _baseScale = _scaleFactor;
              _baseRotationY = _rotationY;
              _baseOffset = _offset;
            },
            onScaleUpdate: (details) {
              if (webObjectNode == null) return;
              setState(() {
                final newScale = _baseScale * details.scale;
                _scaleFactor = newScale < 0.05
                    ? 0.05
                    : (newScale > 1.5 ? 1.5 : newScale);
                _rotationY = _baseRotationY + details.rotation;
                _offset = vmath.Vector2(
                  _baseOffset.x + details.focalPointDelta.dx / 300,
                  _baseOffset.y - details.focalPointDelta.dy / 300,
                );
              });
              _updateNodeTransform();
            },
            child: ARView(
              onARViewCreated: onARViewCreated,
              planeDetectionConfig:
                  PlaneDetectionConfig.horizontalAndVertical,
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    onPressed: _onBackPressed,
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          monument.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (monument.district != null &&
                            monument.district!.isNotEmpty)
                          Text(
                            monument.district!,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      monument.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(26),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _ArControlButton(
                          icon: Icons.rotate_left,
                          onPressed: _rotateRight,
                        ),
                        const SizedBox(width: 12),
                        _ArControlButton(
                          icon: Icons.zoom_out,
                          onPressed: _zoomOut,
                        ),
                        const SizedBox(width: 12),
                        _ArControlButton(
                          icon: Icons.restart_alt,
                          onPressed: _resetTransform,
                          isPrimary: true,
                        ),
                        const SizedBox(width: 12),
                        _ArControlButton(
                          icon: Icons.zoom_in,
                          onPressed: _zoomIn,
                        ),
                        const SizedBox(width: 12),
                        _ArControlButton(
                          icon: Icons.rotate_right,
                          onPressed: _rotateRight,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _onBackPressed() async {
    final monument = widget.monument;

    final shouldGoToQuiz = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                '¿Listo para poner a prueba lo que aprendiste?',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Responde un quiz sobre ${monument.name} y gana puntos.',
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.grey.shade300),
                        padding:
                            const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Ahora no'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF6600),
                        padding:
                            const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Realizar Quiz',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );

    if (shouldGoToQuiz == true) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => QuizScreen(
				monument: monument,
				token: widget.token,
			),
        ),
      );
    } else {
      Navigator.of(context).pop();
    }
  }
}

class _ArControlButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final bool isPrimary;

  const _ArControlButton({
    required this.icon,
    required this.onPressed,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    final Color bg = isPrimary ? Colors.white : const Color(0xFFFF6600);
    final Color fg = isPrimary ? Colors.black : Colors.white;

    return InkWell
(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(999),
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: bg,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: fg, size: 24),
      ),
    );
  }
}
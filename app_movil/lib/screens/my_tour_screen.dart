import 'package:flutter/material.dart';

class MyTourScreen extends StatefulWidget {
  const MyTourScreen({super.key});

  @override
  State<MyTourScreen> createState() => _MyTourScreenState();
}

class _MyTourScreenState extends State<MyTourScreen> {
  String _searchQuery = '';
  String _order = 'recent';
  bool _gridView = false;

  // Datos de ejemplo para mostrar el diseño
  final _stats = _DummyData.stats;
  final _visits = _DummyData.visits;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final visits = _filterAndSortVisits(_visits);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Tour'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // No hace nada: no hay API real
          await Future<void>.delayed(const Duration(milliseconds: 300));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Tu colección personal de huacas de Lima',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),
              _buildStatsGrid(theme),
              const SizedBox(height: 16),
              _buildSearchAndFilters(theme),
              const SizedBox(height: 16),
              if (visits.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 32),
                    child: Text(
                      'Todavía no has visitado ninguna huaca.',
                      style: theme.textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ),
                )
              else
                (_gridView
                    ? _buildGridView(visits, theme)
                    : _buildListView(visits, theme)),
            ],
          ),
        ),
      ),
    );
  }

  List<_MyTourVisit> _filterAndSortVisits(List<_MyTourVisit> visits) {
    var filtered = visits.where((v) {
      final query = _searchQuery.trim().toLowerCase();
      if (query.isEmpty) return true;
      return v.monument.name.toLowerCase().contains(query) ||
          v.monument.category.toLowerCase().contains(query);
    }).toList();

    filtered.sort((a, b) {
      switch (_order) {
        case 'oldest':
          return a.date.compareTo(b.date);
        case 'progress':
          return b.progress.compareTo(a.progress);
        default:
          return b.date.compareTo(a.date);
      }
    });

    return filtered;
  }

  Widget _buildStatsGrid(ThemeData theme) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.9,
      children: [
        _buildStatCard(
          title: 'Huacas visitadas',
          value: _stats.visitedMonuments.toString(),
          theme: theme,
        ),
        _buildStatCard(
          title: 'Escaneos AR',
          value: _stats.arScans.toString(),
          theme: theme,
        ),
        _buildStatCard(
          title: 'Quizzes completados',
          value: _stats.completedQuizzes.toString(),
          theme: theme,
        ),
        _buildStatCard(
          title: 'Promedio quiz',
          value: '${_stats.averageQuizPercent}%',
          theme: theme,
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required ThemeData theme,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                color: Colors.deepOrange,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilters(ThemeData theme) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            hintText: 'Buscar en tu tour…',
            prefixIcon: const Icon(Icons.search),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            isDense: true,
          ),
          onChanged: (value) => setState(() {
            _searchQuery = value;
          }),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                value: _order,
                items: const [
                  DropdownMenuItem(
                    value: 'recent',
                    child: Text('Más recientes'),
                  ),
                  DropdownMenuItem(
                    value: 'oldest',
                    child: Text('Más antiguos'),
                  ),
                  DropdownMenuItem(
                    value: 'progress',
                    child: Text('Mayor progreso'),
                  ),
                ],
                onChanged: (value) {
                  if (value == null) return;
                  setState(() {
                    _order = value;
                  });
                },
                decoration: InputDecoration(
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  border:
                      OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.dividerColor),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildViewToggleButton(
                    icon: Icons.grid_view_rounded,
                    isActive: _gridView,
                    onTap: () => setState(() => _gridView = true),
                  ),
                  _buildViewToggleButton(
                    icon: Icons.view_agenda_rounded,
                    isActive: !_gridView,
                    onTap: () => setState(() => _gridView = false),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildViewToggleButton({
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isActive ? Colors.deepOrange : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          size: 20,
          color: isActive ? Colors.white : Colors.grey[700],
        ),
      ),
    );
  }

  Widget _buildListView(List<_MyTourVisit> visits, ThemeData theme) {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: visits.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final visit = visits[index];
        return _buildVisitCard(visit, theme);
      },
    );
  }

  Widget _buildGridView(List<_MyTourVisit> visits, ThemeData theme) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: visits.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.8,
      ),
      itemBuilder: (context, index) {
        final visit = visits[index];
        return _buildVisitCard(visit, theme, compact: true);
      },
    );
  }

  Widget _buildVisitCard(
    _MyTourVisit visit,
    ThemeData theme, {
    bool compact = false,
  }) {
    final monument = visit.monument;
    final date = visit.date;
    final dateText =
        '${date.day.toString().padLeft(2, '0')} ${_monthName(date.month)} ${date.year}';

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 4,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Parte superior: imagen + chips + fecha + porcentaje
          Stack(
            children: [
              AspectRatio(
                aspectRatio: compact ? 16 / 10 : 16 / 9,
                child: monument.imageUrl.isNotEmpty
                    ? Image.network(
                        monument.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: Colors.grey[300],
                          child: const Icon(Icons.image_not_supported),
                        ),
                      )
                    : Container(
                        color: Colors.grey[300],
                        child: const Center(child: Icon(Icons.image)),
                      ),
              ),
              Positioned(
                top: 10,
                left: 10,
                child: _buildChip(
                  label: monument.category.isNotEmpty
                      ? monument.category
                      : 'Huaca Arqueológica',
                  backgroundColor: Colors.deepOrange,
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: _buildChip(
                  label:
                      monument.rarity.isNotEmpty ? monument.rarity : 'legendary',
                  backgroundColor: Colors.orange[700]!,
                ),
              ),
              Positioned(
                bottom: 10,
                left: 10,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.calendar_today,
                          size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        dateText,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 10,
                right: 10,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green[600],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle,
                          size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        '${visit.progressPercent}%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Parte inferior: contenido blanco
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  monument.name,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Miraflores · 200-700 d.C.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Pirámide trunca de adobe construida por la cultura Lima, '
                  'centro ceremonial y administrativo.',
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '8 scans',
                      style: theme.textTheme.bodySmall
                          ?.copyWith(color: Colors.grey[700]),
                    ),
                    Text(
                      '5 descubrimientos',
                      style: theme.textTheme.bodySmall
                          ?.copyWith(color: Colors.grey[700]),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepOrange,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          padding:
                              const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(Icons.view_in_ar),
                        label: const Text('Ver en RA'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          padding:
                              const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(Icons.replay),
                        label: const Text('Repetir'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChip({
    required String label,
    required Color backgroundColor,
    IconData? icon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor.withOpacity(0.92),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: Colors.white),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  String _monthName(int month) {
    const months = [
      '',
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];
    return months[month];
  }
}

// ------------ MODELOS SIMPLIFICADOS Y DATOS MOCK ------------

class _MyTourStats {
  final int visitedMonuments;
  final int arScans;
  final int completedQuizzes;
  final double averageQuizScore; // 0–1

  const _MyTourStats({
    required this.visitedMonuments,
    required this.arScans,
    required this.completedQuizzes,
    required this.averageQuizScore,
  });

  int get averageQuizPercent => (averageQuizScore * 100).round();
}

class _MyTourMonument {
  final String id;
  final String name;
  final String category;
  final String rarity;
  final String imageUrl;

  const _MyTourMonument({
    required this.id,
    required this.name,
    required this.category,
    required this.rarity,
    required this.imageUrl,
  });
}

class _MyTourVisit {
  final String id;
  final DateTime date;
  final double progress; // 0–1
  final _MyTourMonument monument;

  const _MyTourVisit({
    required this.id,
    required this.date,
    required this.progress,
    required this.monument,
  });

  int get progressPercent => (progress * 100).round();
}

class _DummyData {
  static const stats = _MyTourStats(
    visitedMonuments: 5,
    arScans: 12,
    completedQuizzes: 3,
    averageQuizScore: 0.82,
  );

  static final visits = <_MyTourVisit>[
    _MyTourVisit(
      id: '1',
      date: DateTime(2025, 3, 12),
      progress: 1.0,
      monument: _MyTourMonument(
        id: 'm1',
        name: 'Huaca Pucllana',
        category: 'Huaca',
        rarity: 'Común',
        imageUrl:
            'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
      ),
    ),
    _MyTourVisit(
      id: '2',
      date: DateTime(2025, 2, 5),
      progress: 0.6,
      monument: _MyTourMonument(
        id: 'm2',
        name: 'Huaca Huallamarca',
        category: 'Huaca',
        rarity: 'Rara',
        imageUrl:
            'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
      ),
    ),
    _MyTourVisit(
      id: '3',
      date: DateTime(2025, 1, 20),
      progress: 0.3,
      monument: _MyTourMonument(
        id: 'm3',
        name: 'Complejo Arqueológico Mateo Salado',
        category: 'Complejo',
        rarity: 'Épica',
        imageUrl:
            'https://images.pexels.com/photos/210307/pexels-photo-210307.jpeg',
      ),
    ),
  ];
}
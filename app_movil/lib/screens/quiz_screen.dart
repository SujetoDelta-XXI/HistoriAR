import 'package:flutter/material.dart';

import '../models/monument.dart';
import '../services/quiz_service.dart';

class QuizScreen extends StatefulWidget {
	final Monument monument;
	final String token;

	const QuizScreen({super.key, required this.monument, required this.token});

	@override
	State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
	final QuizService _quizService = const QuizService();
	Map<String, dynamic>? _quiz;
	int _currentQuestionIndex = 0;
	int? _selectedOptionIndex;
	int _score = 0;
	bool _isLoading = true;
	bool _isSubmitting = false;
	final List<Map<String, dynamic>> _answers = [];
	late final DateTime _startTime;

	@override
	void initState() {
		super.initState();
		_startTime = DateTime.now();
		_loadQuiz();
	}

	Future<void> _loadQuiz() async {
		try {
			final quiz = await _quizService.getQuizForMonument(
				monumentId: widget.monument.id,
				token: widget.token,
			);
			setState(() {
				_quiz = quiz;
				_isLoading = false;
			});
		} catch (e) {
			if (!mounted) return;
			setState(() {
				_isLoading = false;
			});
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text('No se pudo cargar el quiz: $e')),
			);
		}
	}

	List<dynamic> get _questions =>
		(_quiz?['questions'] as List<dynamic>? ?? const []);

	Map<String, dynamic>? get _currentQuestion {
		if (_questions.isEmpty ||
				_currentQuestionIndex < 0 ||
				_currentQuestionIndex >= _questions.length) {
			return null;
		}
		final q = _questions[_currentQuestionIndex];
		return q is Map<String, dynamic> ? q : null;
	}

	int get _maxScore {
		if (_questions.isEmpty) return 0;
		int total = 0;
		for (final q in _questions) {
			if (q is Map<String, dynamic>) {
				final pts = q['points'] as int?;
				if (pts != null) {
					total += pts;
				} else {
					// Si no hay "points", asumimos 1 punto por pregunta
					total += 1;
				}
			}
		}
		return total;
	}

	void _onSelectOption(int index) {
		setState(() {
			_selectedOptionIndex = index;
		});
	}

	Future<void> _onNext() async {
		if (_currentQuestion == null || _selectedOptionIndex == null) {
			return;
		}

		_answers.add({
			'questionIndex': _currentQuestionIndex,
			'selectedOptionIndex': _selectedOptionIndex,
		});

		// Actualizar score local: buscamos la opción marcada como correcta
		final options = _currentQuestion?['options'] as List<dynamic>? ?? const [];
		int? correctIndex;
		for (int i = 0; i < options.length; i++) {
			final opt = options[i];
			if (opt is Map<String, dynamic> && (opt['isCorrect'] == true)) {
				correctIndex = i;
				break;
			}
		}
		if (correctIndex != null && correctIndex == _selectedOptionIndex) {
			final pts = _currentQuestion?['points'] as int? ?? 1;
			_score += pts;
		}

		if (_currentQuestionIndex < _questions.length - 1) {
			setState(() {
				_currentQuestionIndex++;
				_selectedOptionIndex = null;
			});
		} else {
			await _submitQuiz();
		}
	}

	Future<void> _submitQuiz() async {
		if (_quiz == null) return;
		setState(() {
			_isSubmitting = true;
		});
		final elapsed = DateTime.now().difference(_startTime);
		try {
			final result = await _quizService.submitQuizAttempt(
				quizId: _quiz!['_id'] as String,
				answers: _answers,
				timeSpent: elapsed,
				token: widget.token,
			);
			if (!mounted) return;
			setState(() {
				_isSubmitting = false;
			});
			await showDialog(
				context: context,
				builder: (context) {
					final score = result['score'] ?? _score;
					final maxScore = result['maxScore'] ?? _maxScore;
					final percentage = result['percentage'] ??
						(maxScore > 0 ? (score * 100 / maxScore) : 0);
					return AlertDialog(
						title: const Text('Resultado del Quiz'),
						content: Text(
							'Puntaje: $score / $maxScore\nAciertos: ${percentage.toStringAsFixed(1)}%',
						),
						actions: [
							TextButton(
								onPressed: () => Navigator.of(context).pop(),
								child: const Text('Continuar'),
							),
						],
					);
				},
			);
			if (!mounted) return;
			Navigator.of(context).pop();
		} catch (e) {
			if (!mounted) return;
			setState(() {
				_isSubmitting = false;
			});
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text('Error al enviar quiz: $e')),
			);
		}
	}

	@override
	Widget build(BuildContext context) {
		final currentQuestion = _currentQuestion;
		final totalQuestions = _questions.length;
		final currentNumber = totalQuestions == 0
				? 0
				: (_currentQuestionIndex + 1).clamp(1, totalQuestions);
		final progress = totalQuestions == 0
				? 0.0
				: currentNumber / totalQuestions;

		return Scaffold(
			backgroundColor: Colors.white,
			appBar: AppBar(
				elevation: 0,
				backgroundColor: Colors.white,
				foregroundColor: Colors.black,
				centerTitle: true,
				title: Column(
					children: [
						Text(
							'Quiz - ${widget.monument.name}',
							style: const TextStyle(
								fontSize: 16,
								fontWeight: FontWeight.bold,
							),
						),
						const SizedBox(height: 2),
						Text(
							totalQuestions == 0
									? 'Sin preguntas'
									: 'Pregunta $currentNumber de $totalQuestions',
							style: const TextStyle(fontSize: 12, color: Colors.grey),
						),
					],
				),
				actions: const [
					Padding(
						padding: EdgeInsets.only(right: 16.0),
						child: Icon(Icons.access_time, color: Colors.orange),
					),
				],
			),
			body: _isLoading
					? const Center(child: CircularProgressIndicator())
					: Padding(
						padding: const EdgeInsets.all(16.0),
						child: Column(
							crossAxisAlignment: CrossAxisAlignment.start,
							children: [
								ClipRRect(
									borderRadius: BorderRadius.circular(999),
									child: LinearProgressIndicator(
										value: progress,
										minHeight: 6,
										backgroundColor: Colors.grey.shade200,
										valueColor: const AlwaysStoppedAnimation(Color(0xFFFF6600)),
									),
								),
								const SizedBox(height: 12),
								Row(
									mainAxisAlignment: MainAxisAlignment.spaceBetween,
									children: [
										Text(
											'Puntuación: $_score',
											style: const TextStyle(fontSize: 12, color: Colors.grey),
										),
										Text(
											'$_maxScore pts máximo',
											style: const TextStyle(fontSize: 12, color: Colors.grey),
										),
									],
								),
								const SizedBox(height: 24),
								if (currentQuestion != null)
									Container(
										padding: const EdgeInsets.all(16),
										decoration: BoxDecoration(
											color: Colors.white,
											borderRadius: BorderRadius.circular(16),
											boxShadow: [
												BoxShadow(
													color: Colors.black.withOpacity(0.05),
													blurRadius: 10,
													offset: const Offset(0, 4),
												),
											],
										),
										child: Row(
											crossAxisAlignment: CrossAxisAlignment.start,
											children: [
												Expanded(
													child: Text(
															(currentQuestion['questionText'] as String?) ??
																(currentQuestion['text'] as String? ?? ''),
														style: const TextStyle(
															fontSize: 16,
															fontWeight: FontWeight.bold,
														),
													),
												),
												const SizedBox(width: 8),
												Container(
													padding: const EdgeInsets.symmetric(
														horizontal: 10,
														vertical: 4,
													),
													decoration: BoxDecoration(
														color: const Color(0xFFFFF0E0),
														borderRadius: BorderRadius.circular(999),
													),
													child: Text(
														'${currentQuestion['points'] ?? 0} pts',
														style: const TextStyle(
															fontSize: 12,
															color: Color(0xFFFF6600),
															fontWeight: FontWeight.bold,
														),
													),
												),
											],
										),
									),
								const SizedBox(height: 16),
								Expanded(
									child: ListView.builder(
										itemCount:
											(currentQuestion?['options'] as List<dynamic>? ?? const []).length,
										itemBuilder: (context, index) {
											final options =
												(currentQuestion?['options'] as List<dynamic>? ?? const []);
											final opt = index < options.length ? options[index] : null;
											String text = '';
											if (opt is Map<String, dynamic>) {
												text = (opt['text'] as String?) ?? '';
											} else if (opt is String) {
												text = opt;
											}
											return GestureDetector(
												onTap: () => _onSelectOption(index),
												child: _QuizOption(
													text: text,
													isSelected: _selectedOptionIndex == index,
												),
											);
										},
									),
								),
								SizedBox(
									width: double.infinity,
									child: ElevatedButton(
										onPressed:
											_isSubmitting || currentQuestion == null
													? null
													: _onNext,
										style: ElevatedButton.styleFrom(
											backgroundColor: const Color(0xFFFF6600),
											padding:
												const EdgeInsets.symmetric(vertical: 14),
											shape: RoundedRectangleBorder(
												borderRadius: BorderRadius.circular(12),
											),
										),
										child: Text(
											_currentQuestionIndex < _questions.length - 1
													? 'Siguiente Pregunta'
													: 'Finalizar Quiz',
											style: const TextStyle(
												color: Colors.white,
												fontSize: 16,
												fontWeight: FontWeight.bold,
											),
										),
									),
								),
							],
						),
					),
		);
	}
}

class _QuizOption extends StatelessWidget {
	final String text;
	final bool isSelected;

	const _QuizOption({
		required this.text,
		this.isSelected = false,
	});

	@override
	Widget build(BuildContext context) {
		final Color borderColor =
				isSelected ? const Color(0xFFFF6600) : Colors.grey.shade200;
		final Color backgroundColor =
				isSelected ? const Color(0xFFFFF5EC) : Colors.white;

		return Container(
			margin: const EdgeInsets.only(bottom: 12),
			padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
			decoration: BoxDecoration(
				color: backgroundColor,
				borderRadius: BorderRadius.circular(12),
				border: Border.all(color: borderColor),
			),
			child: Text(
				text,
				style: const TextStyle(fontSize: 14),
			),
		);
	}
}


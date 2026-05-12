import 'dart:math';
import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../shared/widgets/primary_button.dart';

class KycSuccessScreen extends StatefulWidget {
  const KycSuccessScreen({super.key});

  @override
  State<KycSuccessScreen> createState() => _KycSuccessScreenState();
}

class _KycSuccessScreenState extends State<KycSuccessScreen>
    with SingleTickerProviderStateMixin {
  late final ConfettiController _confetti =
      ConfettiController(duration: const Duration(seconds: 3))..play();
  late final AnimationController _scaleController = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 800))
    ..forward();

  @override
  void dispose() {
    _confetti.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Align(
              alignment: Alignment.topCenter,
              child: ConfettiWidget(
                confettiController: _confetti,
                blastDirection: pi / 2,
                emissionFrequency: 0.05,
                numberOfParticles: 30,
                colors: const [
                  Colors.orange,
                  Colors.teal,
                  Colors.blue,
                  Colors.red,
                  Colors.yellow,
                  Colors.purple,
                  Colors.green
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ScaleTransition(
                    scale: CurvedAnimation(
                        parent: _scaleController, curve: Curves.elasticOut),
                    child: Container(
                      width: 136,
                      height: 136,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.success, width: 2),
                      ),
                      child: const Icon(Icons.check_rounded,
                          size: 60, color: AppColors.success),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text('🎉 KYC Verified! 🎉',
                      style: AppTextStyles.heading28,
                      textAlign: TextAlign.center),
                  const SizedBox(height: 10),
                  const Text(
                    'Your identity has been successfully verified using our AI-powered RAG system.',
                    style: AppTextStyles.body14,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  PrimaryButton(
                      label: 'Back to Home',
                      onPressed: () => context.go('/home')),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

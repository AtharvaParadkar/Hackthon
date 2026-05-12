import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../shared/widgets/primary_button.dart';

class KycChatScreen extends StatelessWidget {
  const KycChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: AppColors.border))),
              child: Row(
                children: [
                  Container(
                    height: 44,
                    width: 44,
                    decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14)),
                    child: IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.primary),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.smart_toy_outlined,
                        color: AppColors.primary),
                  ),
                  const SizedBox(width: 10),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('KYC AI Agent',
                          style: TextStyle(
                              fontSize: 22, fontWeight: FontWeight.bold)),
                      Text('● Online',
                          style: TextStyle(
                              color: AppColors.success, fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
            const Expanded(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Bubble('Welcome to InsureSafe AI KYC Verification'),
                    SizedBox(height: 12),
                    _Bubble(
                        'Please upload your Government ID (Aadhaar/PAN) for AI-powered verification.'),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: PrimaryButton(
                label: 'Mock Upload ID Document',
                onPressed: () async {
                  await Future<void>.delayed(const Duration(seconds: 2));
                  if (context.mounted) context.go('/kyc/analyzing');
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
              color: AppColors.surfaceAlt,
              borderRadius: BorderRadius.circular(10)),
          child: const Icon(Icons.smart_toy_outlined,
              size: 18, color: AppColors.primary),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16)),
            child: Text(text, style: AppTextStyles.body16),
          ),
        ),
      ],
    );
  }
}

class KycAnalyzingScreen extends StatefulWidget {
  const KycAnalyzingScreen({super.key});
  @override
  State<KycAnalyzingScreen> createState() => _KycAnalyzingScreenState();
}

class _KycAnalyzingScreenState extends State<KycAnalyzingScreen>
    with TickerProviderStateMixin {
  late final AnimationController _ringsController = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 1600))
    ..repeat();
  late final AnimationController _dotsController = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 1000))
    ..repeat();

  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 3), () {
      if (mounted) context.go('/kyc/success');
    });
  }

  @override
  void dispose() {
    _ringsController.dispose();
    _dotsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 120,
                height: 120,
                child: AnimatedBuilder(
                  animation: _ringsController,
                  builder: (context, _) {
                    return Stack(
                      alignment: Alignment.center,
                      children: List.generate(3, (index) {
                        final progress =
                            ((_ringsController.value - (index * 0.25)) % 1.0);
                        final scale = 0.8 + (progress * 0.4);
                        return Transform.scale(
                          scale: scale,
                          child: Opacity(
                            opacity: (1 - progress).clamp(0.2, 1),
                            child: Container(
                              width: 86,
                              height: 86,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                    color: AppColors.primary
                                        .withValues(alpha: 0.7)),
                              ),
                            ),
                          ),
                        );
                      }),
                    );
                  },
                ),
              ),
              const SizedBox(height: 28),
              const Text('Analyzing Document', style: AppTextStyles.section24),
              const SizedBox(height: 8),
              const Text(
                'Verifying against RBI Guidelines via RAG...',
                style: AppTextStyles.body14,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(3, (index) {
                  return AnimatedBuilder(
                    animation: _dotsController,
                    builder: (context, _) {
                      final progress =
                          ((_dotsController.value - (index * 0.2)) % 1.0);
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primary
                              .withValues(alpha: 0.35 + (progress * 0.65)),
                        ),
                      );
                    },
                  );
                }),
              ),
              const SizedBox(height: 22),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _ChecklistItem(
                        text: 'Extracting document metadata...', delayMs: 0),
                    _ChecklistItem(
                        text: 'Cross-referencing RBI KYC norms...',
                        delayMs: 600),
                    _ChecklistItem(
                        text: 'Validating identity fields...', delayMs: 1200),
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

class _ChecklistItem extends StatefulWidget {
  const _ChecklistItem({required this.text, required this.delayMs});
  final String text;
  final int delayMs;

  @override
  State<_ChecklistItem> createState() => _ChecklistItemState();
}

class _ChecklistItemState extends State<_ChecklistItem> {
  bool _show = false;

  @override
  void initState() {
    super.initState();
    Future<void>.delayed(Duration(milliseconds: widget.delayMs), () {
      if (mounted) setState(() => _show = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSlide(
      duration: const Duration(milliseconds: 300),
      offset: _show ? Offset.zero : const Offset(0, 0.2),
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: _show ? 1 : 0,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Text('● ${widget.text}',
              style: AppTextStyles.body14
                  .copyWith(color: AppColors.textSecondary)),
        ),
      ),
    );
  }
}

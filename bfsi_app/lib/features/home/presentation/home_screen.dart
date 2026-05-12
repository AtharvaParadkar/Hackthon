import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/utils/date_formatter.dart';
import '../../../shared/widgets/claim_status_badge.dart';
import '../../../shared/widgets/policy_card.dart';
import '../../auth/presentation/auth_provider.dart';
import '../../claims/presentation/claims_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _cardController = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 700))
    ..forward();

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(claimsProvider.notifier).fetch(limit: 3));
  }

  @override
  void dispose() {
    _cardController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(claimsProvider);
    final user = ref.watch(authProvider).user;

    final hour = DateTime.now().hour;
    final greeting = hour < 12
        ? 'Good morning,'
        : hour < 17
            ? 'Good afternoon,'
            : 'Good evening,';

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        children: [
          Text(greeting,
              style: AppTextStyles.body14
                  .copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(user?.name ?? 'Rahul Sharma', style: AppTextStyles.heading32),
          const SizedBox(height: 16),
          InkWell(
            onTap: () => context.go('/kyc'),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceAlt,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.auto_awesome,
                        color: AppColors.primary),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Complete Your KYC',
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        SizedBox(height: 2),
                        Text('AI-powered verification in 30 seconds',
                            style: AppTextStyles.caption13),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right,
                      color: AppColors.textSecondary),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            height: 56,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () => context.go('/claims/file'),
              icon: const Icon(Icons.add, color: Colors.white),
              label: const Text('File a Claim', style: AppTextStyles.button16),
            ),
          ),
          const SizedBox(height: 18),
          _sectionHeader('My Policies', onTap: () => context.go('/policies')),
          const SizedBox(height: 10),
          SizedBox(
            height: 160,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _animatedPolicyCard(
                  0,
                  const PolicyCard(
                    title: 'Life Insurance',
                    amount: '₹12,000/yr',
                    color: AppColors.lifeInsurance,
                    icon: Icons.favorite_outline,
                    amountColor: Color(0xFFFC5B8C),
                  ),
                ),
                const SizedBox(width: 12),
                _animatedPolicyCard(
                  1,
                  const PolicyCard(
                    title: 'Health Cover',
                    amount: '₹8,500/yr',
                    color: AppColors.healthCover,
                    icon: Icons.monitor_heart_outlined,
                    amountColor: AppColors.success,
                  ),
                ),
                const SizedBox(width: 12),
                _animatedPolicyCard(
                  2,
                  const PolicyCard(
                    title: 'Auto Shield',
                    amount: '₹5,200/yr',
                    color: AppColors.autoShield,
                    icon: Icons.directions_car_outlined,
                    amountColor: AppColors.primaryLight,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          _sectionHeader('Recent Claims', onTap: () => context.go('/claims')),
          const SizedBox(height: 10),
          if (state.loading)
            const Center(
                child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator()))
          else if (state.error != null)
            Text(state.error!,
                style: AppTextStyles.body14.copyWith(color: AppColors.error))
          else if (state.claims.isEmpty)
            const Padding(
              padding: EdgeInsets.all(12),
              child: Text('No claims found', style: AppTextStyles.caption13),
            )
          else
            ...state.claims.map(
              (claim) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.surfaceAlt,
                      child: Icon(Icons.access_time,
                          color: AppColors.textSecondary),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(claim.type,
                              style: AppTextStyles.body16
                                  .copyWith(fontWeight: FontWeight.bold)),
                          Text(formatDate(claim.date),
                              style: AppTextStyles.caption13),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(formatInr(claim.amount),
                            style: AppTextStyles.body16
                                .copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        ClaimStatusBadge(status: claim.status),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title, {required VoidCallback onTap}) {
    return Row(
      children: [
        Text(title, style: AppTextStyles.section24),
        const Spacer(),
        TextButton(
            onPressed: onTap,
            child: const Text('See all',
                style: TextStyle(color: AppColors.primary))),
      ],
    );
  }

  Widget _animatedPolicyCard(int index, Widget child) {
    final curve = CurvedAnimation(
      parent: _cardController,
      curve: Interval(index * 0.15, 1, curve: Curves.easeOut),
    );
    return FadeTransition(
      opacity: curve,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0.12, 0), end: Offset.zero)
            .animate(curve),
        child: child,
      ),
    );
  }
}

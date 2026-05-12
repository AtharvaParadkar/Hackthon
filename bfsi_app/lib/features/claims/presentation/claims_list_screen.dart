import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/utils/date_formatter.dart';
import '../../../shared/widgets/claim_status_badge.dart';
import 'claims_provider.dart';

class ClaimsListScreen extends ConsumerStatefulWidget {
  const ClaimsListScreen({super.key});

  @override
  ConsumerState<ClaimsListScreen> createState() => _ClaimsListScreenState();
}

class _ClaimsListScreenState extends ConsumerState<ClaimsListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(claimsProvider.notifier).fetch());
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(claimsProvider);
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () => ref.read(claimsProvider.notifier).fetch(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('My Claims', style: AppTextStyles.heading32),
            Text('${state.claims.length} total claims',
                style: AppTextStyles.caption13),
            const SizedBox(height: 14),
            if (state.loading)
              ...List.generate(3, (index) => _shimmerCard())
            else if (state.error != null)
              Column(
                children: [
                  Text(state.error!,
                      style: AppTextStyles.body14
                          .copyWith(color: AppColors.error)),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => ref.read(claimsProvider.notifier).fetch(),
                    child: const Text('Retry'),
                  ),
                ],
              )
            else if (state.claims.isEmpty)
              const Padding(
                padding: EdgeInsets.all(20),
                child: Center(
                  child: Text('No claims yet', style: AppTextStyles.caption13),
                ),
              )
            else
              ...state.claims.map((claim) => _claimCard(claim)),
          ],
        ),
      ),
    );
  }

  Widget _shimmerCard() {
    return Shimmer.fromColors(
      baseColor: AppColors.surface,
      highlightColor: AppColors.surfaceAlt,
      child: Container(
        height: 96,
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
            color: AppColors.surface, borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  Widget _claimCard(claim) {
    final status = claim.status.toLowerCase();
    final color = status == 'approved'
        ? AppColors.success
        : status == 'rejected'
            ? AppColors.error
            : AppColors.warning;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
                color: color.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12)),
            child: Icon(
              status == 'approved'
                  ? Icons.check
                  : status == 'rejected'
                      ? Icons.close
                      : Icons.priority_high,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(claim.type,
                    style: AppTextStyles.body16
                        .copyWith(fontWeight: FontWeight.w700)),
                Text('${claim.id} · ${formatDate(claim.date)}',
                    style: AppTextStyles.caption12),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(formatInr(claim.amount),
                  style: AppTextStyles.body16
                      .copyWith(color: color, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              ClaimStatusBadge(status: claim.status),
            ],
          ),
        ],
      ),
    );
  }
}

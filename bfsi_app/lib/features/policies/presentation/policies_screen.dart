import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../data/policy_model.dart';

class PoliciesScreen extends StatelessWidget {
  const PoliciesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final policies = [
      PolicyModel(
          name: 'Life Insurance',
          plan: 'Term Plan - 30 years',
          coverage: '₹50L Cover',
          premium: '₹12,000/yr'),
      PolicyModel(
          name: 'Health Cover',
          plan: 'Family Floater Plan',
          coverage: '₹10L Cover',
          premium: '₹8,500/yr'),
      PolicyModel(
          name: 'Auto Shield',
          plan: 'Comprehensive Vehicle',
          coverage: '₹8L Cover',
          premium: '₹5,200/yr'),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('My Policies', style: AppTextStyles.heading32),
          const Text('3 active policies', style: AppTextStyles.caption13),
          const SizedBox(height: 12),
          ...policies.map((policy) {
            final icon = policy.name.contains('Life')
                ? Icons.favorite_outline
                : policy.name.contains('Health')
                    ? Icons.monitor_heart_outlined
                    : Icons.directions_car_outlined;
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
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                        color: AppColors.surfaceAlt,
                        borderRadius: BorderRadius.circular(12)),
                    child: Icon(icon, color: AppColors.primary),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(policy.name,
                            style: AppTextStyles.body16
                                .copyWith(fontWeight: FontWeight.w700)),
                        Text(policy.plan, style: AppTextStyles.caption13),
                        const SizedBox(height: 3),
                        Text('${policy.coverage}   ${policy.premium}',
                            style: AppTextStyles.body14),
                      ],
                    ),
                  ),
                  Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.teal),
                        ),
                        child: const Text('Active',
                            style: TextStyle(color: Colors.teal)),
                      ),
                      const SizedBox(height: 8),
                      const Icon(Icons.chevron_right,
                          color: AppColors.textSecondary),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

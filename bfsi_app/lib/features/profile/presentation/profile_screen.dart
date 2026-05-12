import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../auth/presentation/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 12),
          const CircleAvatar(
            radius: 52,
            backgroundColor: AppColors.primary,
            child: Text('RS',
                style: TextStyle(fontSize: 34, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 12),
          Center(
              child: Text(user?.name ?? 'Rahul Sharma',
                  style: AppTextStyles.section24)),
          const SizedBox(height: 4),
          Center(
              child: Text('Policy ID: ${user?.policyId ?? 'INS-2024-00142'}',
                  style: AppTextStyles.caption13)),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              children: [
                _ContactTile(
                    icon: Icons.phone_outlined,
                    title: 'Phone',
                    subtitle: '+91 98765 43210'),
                Divider(height: 1, color: AppColors.border),
                _ContactTile(
                    icon: Icons.email_outlined,
                    title: 'Email',
                    subtitle: 'rahul.sharma@email.com'),
                Divider(height: 1, color: AppColors.border),
                _ContactTile(
                    icon: Icons.location_on_outlined,
                    title: 'City',
                    subtitle: 'Mumbai, Maharashtra'),
              ],
            ),
          ),
          const SizedBox(height: 18),
          const Text('Settings', style: AppTextStyles.section24),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                _settingsTile(
                    Icons.notifications_none, 'Notifications', 'Manage alerts'),
                const Divider(height: 1, color: AppColors.border),
                _settingsTile(
                    Icons.security_outlined, 'Security', 'Privacy & password'),
                const Divider(height: 1, color: AppColors.border),
                _settingsTile(
                    Icons.help_outline, 'Help & Support', 'FAQs and contact'),
                const Divider(height: 1, color: AppColors.border),
                ListTile(
                  leading: const Icon(Icons.logout, color: AppColors.error),
                  title: const Text('Sign Out',
                      style: TextStyle(
                          color: AppColors.error, fontWeight: FontWeight.w600)),
                  trailing: const Icon(Icons.chevron_right,
                      color: AppColors.textSecondary),
                  onTap: () async {
                    await ref.read(authProvider.notifier).logout();
                    if (context.mounted) context.go('/login');
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _settingsTile(IconData icon, String title, String subtitle) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
            color: AppColors.surfaceAlt,
            borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: AppColors.primary),
      ),
      title: Text(title, style: AppTextStyles.body16),
      subtitle: Text(subtitle, style: AppTextStyles.caption13),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
    );
  }
}

class _ContactTile extends StatelessWidget {
  const _ContactTile(
      {required this.icon, required this.title, required this.subtitle});
  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title, style: AppTextStyles.caption13),
      subtitle: Text(subtitle, style: AppTextStyles.body16),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

class MainShellScaffold extends StatelessWidget {
  const MainShellScaffold({
    super.key,
    required this.child,
    required this.location,
  });

  final Widget child;
  final String location;

  @override
  Widget build(BuildContext context) {
    const tabs = ['/home', '/claims', '/policies', '/profile'];
    final selectedIndex = tabs.contains(location) ? tabs.indexOf(location) : 0;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        height: 78,
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Row(
          children: List.generate(_items.length, (index) {
            final item = _items[index];
            final selected = index == selectedIndex;
            return Expanded(
              child: InkWell(
                onTap: () => context.go(tabs[index]),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      selected ? item.activeIcon : item.icon,
                      color: selected
                          ? AppColors.primary
                          : AppColors.textSecondary,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.label,
                      style: AppTextStyles.caption12.copyWith(
                        color: selected
                            ? AppColors.primary
                            : AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 3),
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 180),
                      opacity: selected ? 1 : 0,
                      child: const SizedBox(
                        width: 6,
                        height: 6,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                              color: AppColors.primary, shape: BoxShape.circle),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _TabItem {
  const _TabItem(
      {required this.label, required this.icon, required this.activeIcon});
  final String label;
  final IconData icon;
  final IconData activeIcon;
}

const _items = [
  _TabItem(label: 'Home', icon: Icons.home_outlined, activeIcon: Icons.home),
  _TabItem(
      label: 'Claims',
      icon: Icons.description_outlined,
      activeIcon: Icons.description),
  _TabItem(
      label: 'Policies', icon: Icons.shield_outlined, activeIcon: Icons.shield),
  _TabItem(
      label: 'Profile', icon: Icons.person_outline, activeIcon: Icons.person),
];

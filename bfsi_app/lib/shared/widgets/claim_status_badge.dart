import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class ClaimStatusBadge extends StatelessWidget {
  const ClaimStatusBadge({super.key, required this.status});
  final String status;
  @override
  Widget build(BuildContext context) {
    final s = status.toLowerCase();
    Color c = AppColors.warning;
    Color b = const Color(0xFF3A2E1A);
    if (s == 'approved') {
      c = AppColors.success;
      b = const Color(0xFF1A3A2A);
    }
    if (s == 'rejected') {
      c = AppColors.error;
      b = const Color(0xFF3A1A1A);
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: b,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status,
        style: TextStyle(color: c, fontWeight: FontWeight.w600),
      ),
    );
  }
}

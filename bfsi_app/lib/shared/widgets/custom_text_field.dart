import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

class CustomTextField extends StatelessWidget {
  const CustomTextField({
    super.key,
    required this.label,
    required this.hint,
    required this.icon,
    this.controller,
    this.validator,
    this.obscureText = false,
    this.suffix,
    this.keyboardType,
  });

  final String label;
  final String hint;
  final IconData icon;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final bool obscureText;
  final Widget? suffix;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyles.body16),
        const SizedBox(height: 10),
        TextFormField(
          controller: controller,
          validator: validator,
          obscureText: obscureText,
          keyboardType: keyboardType,
          style: AppTextStyles.body16,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle:
                AppTextStyles.body16.copyWith(color: AppColors.textSecondary),
            prefixIcon: Icon(icon, color: AppColors.textSecondary),
            suffixIcon: suffix,
            filled: true,
            fillColor: AppColors.surfaceAlt,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.error),
            ),
          ),
        ),
      ],
    );
  }
}

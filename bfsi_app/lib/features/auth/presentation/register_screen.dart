import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/custom_text_field.dart';
import '../../../shared/widgets/primary_button.dart';
import 'auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final error = await ref.read(authProvider.notifier).register(
          _nameController.text.trim(),
          _emailController.text.trim(),
          _passwordController.text,
        );
    if (!mounted) return;
    if (error != null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(error)));
      return;
    }
    context.go('/kyc');
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.22),
                const Text('Create Account', style: AppTextStyles.heading32),
                const SizedBox(height: 10),
                const Text('Join InsureSafe for complete coverage',
                    style: AppTextStyles.body16),
                const SizedBox(height: 40),
                CustomTextField(
                  label: 'Full Name',
                  hint: 'Name',
                  icon: Icons.person_outline,
                  controller: _nameController,
                  validator: (value) =>
                      Validators.requiredField(value, 'Full Name'),
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  label: 'Email Address',
                  hint: 'Email Address',
                  icon: Icons.email_outlined,
                  controller: _emailController,
                  validator: Validators.email,
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  label: 'Password',
                  hint: 'Create a secure password',
                  icon: Icons.lock_outline,
                  controller: _passwordController,
                  validator: (value) =>
                      Validators.requiredField(value, 'Password'),
                  obscureText: _obscurePassword,
                  suffix: IconButton(
                    onPressed: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                PrimaryButton(
                    label: 'Sign Up',
                    loading: authState.loading,
                    onPressed: _submit),
                const SizedBox(height: 24),
                Center(
                  child: TextButton(
                    onPressed: () => context.go('/login'),
                    child: RichText(
                      text: const TextSpan(
                        style: AppTextStyles.body14,
                        children: [
                          TextSpan(
                              text: 'Already have an account? ',
                              style: TextStyle(color: AppColors.textSecondary)),
                          TextSpan(
                              text: 'Sign in',
                              style: TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

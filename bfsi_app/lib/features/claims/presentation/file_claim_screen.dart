import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../shared/widgets/primary_button.dart';
import 'claims_provider.dart';

class FileClaimScreen extends ConsumerStatefulWidget {
  const FileClaimScreen({super.key});

  @override
  ConsumerState<FileClaimScreen> createState() => _FileClaimScreenState();
}

class _FileClaimScreenState extends ConsumerState<FileClaimScreen> {
  int step = 0;
  String? claimType;
  final amountController = TextEditingController();
  bool loading = false;
  double progress = 0;
  String? selectedFilePath;

  @override
  void dispose() {
    amountController.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
    );
    if (result?.files.single.path != null) {
      setState(() => selectedFilePath = result!.files.single.path!);
    }
  }

  Future<void> submit() async {
    setState(() => loading = true);
    try {
      await ref.read(claimsRepositoryProvider).submitClaim(
            type: claimType ?? 'General',
            amount: amountController.text.trim(),
            onSendProgress: (sent, total) {
              if (total > 0) setState(() => progress = sent / total);
            },
          );
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          backgroundColor: AppColors.surface,
          title: const Text('Success'),
          content: const Text('Claim submitted successfully.'),
          actions: [
            TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'))
          ],
        ),
      );
      if (mounted) context.go('/home');
    } on DioException catch (e) {
      String message = 'Request failed';
      if (e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.connectionTimeout) {
        message = 'No internet connection';
      } else if ((e.response?.statusCode ?? 0) >= 500) {
        message = 'Something went wrong. Please try again.';
      } else if (e.response?.data is Map<String, dynamic>) {
        message = (e.response?.data['message'] ?? 'Request failed') as String;
      }
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(message)));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(Icons.arrow_back)),
                  const Expanded(
                      child: Text('File a Claim',
                          textAlign: TextAlign.center,
                          style: AppTextStyles.section24)),
                  const SizedBox(width: 48),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _stepLabel('Claim Type', 0),
                  _line(0),
                  _stepLabel('Amount', 1),
                  _line(1),
                  _stepLabel('Invoice', 2),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                  child: step == 0
                      ? _claimTypeStep()
                      : step == 1
                          ? _amountStep()
                          : _invoiceStep()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _claimTypeStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Select Claim Type', style: AppTextStyles.body16),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          initialValue: claimType,
          dropdownColor: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          decoration: InputDecoration(
            hintText: 'Choose claim type...',
            hintStyle:
                AppTextStyles.body14.copyWith(color: AppColors.textSecondary),
            filled: true,
            fillColor: AppColors.surfaceAlt,
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border)),
          ),
          items: const [
            DropdownMenuItem(value: 'Health', child: Text('🏥 Health')),
            DropdownMenuItem(value: 'Vehicle', child: Text('🚗 Vehicle')),
            DropdownMenuItem(value: 'General', child: Text('📋 General')),
          ],
          onChanged: (value) => setState(() => claimType = value),
        ),
        const Spacer(),
        PrimaryButton(
            label: 'Continue',
            enabled: claimType != null,
            onPressed: () => setState(() => step = 1)),
      ],
    );
  }

  Widget _amountStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Claim Amount (₹)', style: AppTextStyles.body16),
        const SizedBox(height: 10),
        TextField(
          controller: amountController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: '10000',
            hintStyle:
                AppTextStyles.body16.copyWith(color: AppColors.textSecondary),
            filled: true,
            fillColor: AppColors.surfaceAlt,
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border)),
          ),
        ),
        const Spacer(),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textPrimary,
                  side: const BorderSide(color: AppColors.border),
                  backgroundColor: AppColors.surfaceAlt,
                  minimumSize: const Size(0, 56),
                ),
                onPressed: () => setState(() => step = 0),
                child: const Text('Back'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              flex: 2,
              child: PrimaryButton(
                label: 'Continue',
                enabled: amountController.text.trim().isNotEmpty,
                onPressed: () => setState(() => step = 2),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _invoiceStep() {
    final selected = selectedFilePath != null;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Upload Invoice / Document', style: AppTextStyles.body16),
        const SizedBox(height: 10),
        InkWell(
          onTap: _pickFile,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            width: double.infinity,
            height: 180,
            decoration: BoxDecoration(
              color: AppColors.surfaceAlt,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                  color: selected ? AppColors.success : AppColors.border,
                  width: 1.6),
            ),
            child: Center(
              child: selected
                  ? const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle_outline,
                            color: AppColors.success, size: 30),
                        SizedBox(height: 8),
                        Text('invoice_document.jpg',
                            style: AppTextStyles.body16),
                        SizedBox(height: 2),
                        Text('Tap to change', style: AppTextStyles.caption13),
                      ],
                    )
                  : const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.upload_file_outlined,
                            color: AppColors.textSecondary),
                        SizedBox(height: 8),
                        Text('Tap to upload', style: AppTextStyles.caption13),
                      ],
                    ),
            ),
          ),
        ),
        const Spacer(),
        if (loading) LinearProgressIndicator(value: progress),
        if (loading) const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textPrimary,
                  side: const BorderSide(color: AppColors.border),
                  backgroundColor: AppColors.surfaceAlt,
                  minimumSize: const Size(0, 56),
                ),
                onPressed: () => setState(() => step = 1),
                child: const Text('Back'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
                flex: 2,
                child: PrimaryButton(
                    label: 'Submit Claim',
                    loading: loading,
                    onPressed: loading ? null : submit)),
          ],
        ),
      ],
    );
  }

  Widget _stepLabel(String text, int index) {
    return Text(
      text,
      style: AppTextStyles.body14.copyWith(
          color: step == index ? AppColors.primary : AppColors.textSecondary),
    );
  }

  Widget _line(int i) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        height: 2,
        color: step >= i + 1 ? AppColors.primary : AppColors.border,
      ),
    );
  }
}

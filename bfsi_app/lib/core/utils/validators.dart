class Validators {
  static String? requiredField(String? v, String f) {
    if (v == null || v.trim().isEmpty) return '$f is required';
    return null;
  }

  static String? email(String? v) {
    if (v == null || v.trim().isEmpty) return 'Email is required';
    final r = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
    if (!r.hasMatch(v.trim())) return 'Enter a valid email';
    return null;
  }
}

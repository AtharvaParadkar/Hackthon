class UserModel {
  UserModel({
    required this.name,
    required this.email,
    this.policyId = 'INS-2024-00142',
  });
  final String name;
  final String email;
  final String policyId;
  factory UserModel.fromJson(Map<String, dynamic> j) => UserModel(
      name: j['name'] ?? 'Rahul Sharma',
      email: j['email'] ?? 'rahul.sharma@email.com');
}

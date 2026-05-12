class ClaimModel {
  ClaimModel({
    required this.id,
    required this.type,
    required this.amount,
    required this.status,
    required this.date,
  });
  final String id;
  final String type;
  final num amount;
  final String status;
  final DateTime date;

  factory ClaimModel.fromJson(Map<String, dynamic> j) => ClaimModel(
      id: (j['id'] ?? j['_id'] ?? 'CLM-2026-0000') as String,
      type: (j['type'] ?? 'General Claim') as String,
      amount: (j['amount'] ?? 0) as num,
      status: (j['status'] ?? 'Pending') as String,
      date: DateTime.tryParse((j['date'] ?? '').toString()) ?? DateTime.now());
}

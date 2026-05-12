import 'package:dio/dio.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import 'claim_model.dart';

class ClaimsRepository {
  final _dio = DioClient.instance.dio;

  Future<List<ClaimModel>> listClaims({int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.claimList,
        queryParameters: {'page': page, 'limit': limit},
      );
      final body = response.data;
      final list = body is Map<String, dynamic>
          ? (body['data'] ?? body['claims'] ?? <dynamic>[])
          : <dynamic>[];
      return (list as List)
          .map((e) => ClaimModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      final isOffline = e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.connectionTimeout;
      if (isOffline) return _mockClaims.take(limit).toList();
      rethrow;
    }
  }

  Future<void> submitClaim({
    required String type,
    required String amount,
    ProgressCallback? onSendProgress,
  }) async {
    final form = FormData.fromMap({
      'type': type,
      'amount': amount,
      'document':
          MultipartFile.fromString('mock', filename: 'invoice_document.jpg'),
    });
    await _dio.post(ApiEndpoints.createClaim,
        data: form, onSendProgress: onSendProgress);
  }
}

final List<ClaimModel> _mockClaims = [
  ClaimModel(
      id: 'CLM-2026-0098',
      type: 'Health Claim',
      amount: 25000,
      status: 'Approved',
      date: DateTime(2026, 2, 28)),
  ClaimModel(
      id: 'CLM-2026-0075',
      type: 'Vehicle Claim',
      amount: 48500,
      status: 'Pending',
      date: DateTime(2026, 2, 15)),
  ClaimModel(
      id: 'CLM-2026-0031',
      type: 'General Claim',
      amount: 12000,
      status: 'Rejected',
      date: DateTime(2026, 1, 2)),
];

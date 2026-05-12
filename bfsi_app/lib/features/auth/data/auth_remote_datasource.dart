import '../../../core/network/api_endpoints.dart';
import '../../../core/network/dio_client.dart';

class AuthRemoteDataSource {
  final _dio = DioClient.instance.dio;
  Future<Map<String, dynamic>> login(String e, String p) async {
    final r =
        await _dio.post(ApiEndpoints.login, data: {'email': e, 'password': p});
    return r.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register(String n, String e, String p) async {
    final r = await _dio.post(ApiEndpoints.register,
        data: {'name': n, 'email': e, 'password': p});
    return r.data as Map<String, dynamic>;
  }
}

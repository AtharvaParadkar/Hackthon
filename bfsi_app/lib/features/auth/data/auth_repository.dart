import '../domain/user_model.dart';
import 'auth_remote_datasource.dart';

class AuthRepository {
  AuthRepository(this._r);
  final AuthRemoteDataSource _r;

  Future<(String, UserModel)> login(String e, String p) async {
    final response = await _r.login(e, p);
    final data = (response['data'] ?? {}) as Map<String, dynamic>;
    return (
      (data['token'] ?? '') as String,
      UserModel.fromJson((data['user'] ?? {}) as Map<String, dynamic>)
    );
  }

  Future<(String, UserModel)> register(String n, String e, String p) async {
    final response = await _r.register(n, e, p);
    final data = (response['data'] ?? {}) as Map<String, dynamic>;
    return (
      (data['token'] ?? '') as String,
      UserModel.fromJson((data['user'] ?? {}) as Map<String, dynamic>)
    );
  }
}

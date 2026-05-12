import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/storage/secure_storage.dart';
import '../data/auth_remote_datasource.dart';
import '../data/auth_repository.dart';
import '../domain/user_model.dart';

class AuthState {
  const AuthState(
      {this.isAuthenticated = false, this.loading = false, this.user});
  final bool isAuthenticated;
  final bool loading;
  final UserModel? user;
  AuthState copyWith({bool? isAuthenticated, bool? loading, UserModel? user}) =>
      AuthState(
          isAuthenticated: isAuthenticated ?? this.isAuthenticated,
          loading: loading ?? this.loading,
          user: user ?? this.user);
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repo) : super(const AuthState()) {
    DioClient.instance.init();
    DioClient.instance.onUnauthorized = logout;
    initialize();
  }
  final AuthRepository _repo;
  Future<void> initialize() async {
    final t = await SecureStorageService.instance.getToken();
    if (t != null && t.isNotEmpty) {
      state = state.copyWith(
          isAuthenticated: true,
          user:
              UserModel(name: 'Rahul Sharma', email: 'rahul.sharma@email.com'));
    }
  }

  String _err(DioException e) {
    if (e.type == DioExceptionType.connectionError ||
        e.type == DioExceptionType.connectionTimeout) {
      return 'No internet connection';
    }
    if ((e.response?.statusCode ?? 0) >= 500) {
      return 'Something went wrong. Please try again.';
    }
    if (e.response?.data is Map<String, dynamic>) {
      return (e.response?.data['message'] ?? 'Request failed') as String;
    }
    return 'Request failed';
  }

  Future<String?> login(String e, String p) async {
    try {
      state = state.copyWith(loading: true);
      final (t, u) = await _repo.login(e, p);
      await SecureStorageService.instance.saveToken(t);
      state = state.copyWith(isAuthenticated: true, loading: false, user: u);
      return null;
    } on DioException catch (err) {
      state = state.copyWith(loading: false);
      return _err(err);
    } catch (_) {
      state = state.copyWith(loading: false);
      return 'Something went wrong. Please try again.';
    }
  }

  Future<String?> register(String n, String e, String p) async {
    try {
      state = state.copyWith(loading: true);
      final (t, u) = await _repo.register(n, e, p);
      await SecureStorageService.instance.saveToken(t);
      state = state.copyWith(isAuthenticated: true, loading: false, user: u);
      return null;
    } on DioException catch (err) {
      state = state.copyWith(loading: false);
      return _err(err);
    } catch (_) {
      state = state.copyWith(loading: false);
      return 'Something went wrong. Please try again.';
    }
  }

  Future<void> logout() async {
    await SecureStorageService.instance.clearToken();
    state = const AuthState();
  }
}

final authRepositoryProvider =
    Provider((ref) => AuthRepository(AuthRemoteDataSource()));
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
    (ref) => AuthNotifier(ref.read(authRepositoryProvider)));

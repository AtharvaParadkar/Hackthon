import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../constants/api_constants.dart';
import '../storage/secure_storage.dart';

class DioClient {
  DioClient._();
  static final instance = DioClient._();
  final Dio dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30)));
  VoidCallback? onUnauthorized;
  void init() {
    dio.interceptors.clear();
    dio.interceptors.add(InterceptorsWrapper(onRequest: (o, h) async {
      final t = await SecureStorageService.instance.getToken();
      if (t != null && t.isNotEmpty) {
        o.headers['Authorization'] = 'Bearer $t';
      }
      h.next(o);
    }, onError: (e, h) async {
      if (e.response?.statusCode == 401) {
        await SecureStorageService.instance.clearToken();
        onUnauthorized?.call();
      }
      h.next(e);
    }));
    if (kDebugMode) {
      dio.interceptors
          .add(LogInterceptor(requestBody: true, responseBody: true));
    }
  }
}

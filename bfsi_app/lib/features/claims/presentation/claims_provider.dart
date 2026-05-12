import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/claim_model.dart';
import '../data/claims_repository.dart';

final claimsRepositoryProvider = Provider((ref) => ClaimsRepository());

class ClaimsState {
  const ClaimsState({this.loading = false, this.claims = const [], this.error});
  final bool loading;
  final List<ClaimModel> claims;
  final String? error;

  ClaimsState copyWith(
      {bool? loading, List<ClaimModel>? claims, String? error}) {
    return ClaimsState(
      loading: loading ?? this.loading,
      claims: claims ?? this.claims,
      error: error,
    );
  }
}

class ClaimsNotifier extends StateNotifier<ClaimsState> {
  ClaimsNotifier(this._repo) : super(const ClaimsState());
  final ClaimsRepository _repo;

  Future<void> fetch({int limit = 10}) async {
    state = state.copyWith(loading: true, error: null);
    try {
      final claims = await _repo.listClaims(limit: limit);
      state = state.copyWith(loading: false, claims: claims);
    } on DioException catch (e) {
      final statusCode = e.response?.statusCode ?? 0;
      if (e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.connectionTimeout) {
        state = state.copyWith(loading: false, error: 'No internet connection');
      } else if (statusCode >= 500) {
        state = state.copyWith(
            loading: false, error: 'Something went wrong. Please try again.');
      } else {
        final msg = e.response?.data is Map<String, dynamic>
            ? (e.response?.data['message'] ?? 'Request failed') as String
            : 'Request failed';
        state = state.copyWith(loading: false, error: msg);
      }
    } catch (_) {
      state = state.copyWith(
          loading: false, error: 'Something went wrong. Please try again.');
    }
  }
}

final claimsProvider = StateNotifierProvider<ClaimsNotifier, ClaimsState>(
    (ref) => ClaimsNotifier(ref.read(claimsRepositoryProvider)));

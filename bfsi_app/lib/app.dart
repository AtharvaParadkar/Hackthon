import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'core/constants/app_colors.dart';
import 'features/auth/presentation/auth_provider.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/auth/presentation/register_screen.dart';
import 'features/claims/presentation/claims_list_screen.dart';
import 'features/claims/presentation/file_claim_screen.dart';
import 'features/home/presentation/home_screen.dart';
import 'features/kyc/presentation/kyc_chat_screen.dart';
import 'features/kyc/presentation/kyc_success_screen.dart';
import 'features/policies/presentation/policies_screen.dart';
import 'features/profile/presentation/profile_screen.dart';
import 'shared/widgets/main_shell_scaffold.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider).isAuthenticated;
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/login',
    redirect: (context, state) {
      final inAuth = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register';
      if (!auth && !inAuth && !state.matchedLocation.startsWith('/kyc')) {
        return '/login';
      }
      if (auth && inAuth) return '/home';
      return null;
    },
    routes: [
      GoRoute(
          path: '/login',
          pageBuilder: (context, state) =>
              _slidePage(state, const LoginScreen())),
      GoRoute(
          path: '/register',
          pageBuilder: (context, state) =>
              _slidePage(state, const RegisterScreen())),
      GoRoute(
          path: '/kyc',
          pageBuilder: (context, state) =>
              _slidePage(state, const KycChatScreen())),
      GoRoute(
          path: '/kyc/analyzing',
          pageBuilder: (context, state) =>
              _slidePage(state, const KycAnalyzingScreen())),
      GoRoute(
          path: '/kyc/success',
          pageBuilder: (context, state) =>
              _slidePage(state, const KycSuccessScreen())),
      GoRoute(
          path: '/claims/file',
          pageBuilder: (context, state) =>
              _slidePage(state, const FileClaimScreen())),
      ShellRoute(
        builder: (context, state, child) =>
            MainShellScaffold(location: state.matchedLocation, child: child),
        routes: [
          GoRoute(
              path: '/home',
              pageBuilder: (context, state) =>
                  _fadePage(state, const HomeScreen())),
          GoRoute(
              path: '/claims',
              pageBuilder: (context, state) =>
                  _fadePage(state, const ClaimsListScreen())),
          GoRoute(
              path: '/policies',
              pageBuilder: (context, state) =>
                  _fadePage(state, const PoliciesScreen())),
          GoRoute(
              path: '/profile',
              pageBuilder: (context, state) =>
                  _fadePage(state, const ProfileScreen())),
        ],
      ),
    ],
  );
});

CustomTransitionPage<void> _slidePage(GoRouterState state, Widget child) {
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return SlideTransition(
        position:
            Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero).animate(
          CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
        ),
        child: child,
      );
    },
  );
}

CustomTransitionPage<void> _fadePage(GoRouterState state, Widget child) {
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  );
}

class InsureSafeApp extends ConsumerWidget {
  const InsureSafeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'InsureSafe',
      routerConfig: ref.watch(routerProvider),
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(primary: AppColors.primary),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
    );
  }
}

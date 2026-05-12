import 'package:intl/intl.dart';

String formatDate(DateTime d) => DateFormat('dd MMM yyyy').format(d);

String formatInr(num a) =>
    NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0)
        .format(a);

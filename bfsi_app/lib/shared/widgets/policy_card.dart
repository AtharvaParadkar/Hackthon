import 'package:flutter/material.dart';

class PolicyCard extends StatelessWidget {
  const PolicyCard({
    super.key,
    required this.title,
    required this.amount,
    required this.color,
    required this.icon,
    required this.amountColor,
  });
  final String title;
  final String amount;
  final Color color;
  final IconData icon;
  final Color amountColor;
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
            color: color, borderRadius: BorderRadius.circular(16)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: Colors.black26,
                  borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: amountColor)),
          const Spacer(),
          Text(title,
              style:
                  const TextStyle(fontSize: 24, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(amount,
              style: TextStyle(color: amountColor, fontWeight: FontWeight.w600))
        ]));
  }
}

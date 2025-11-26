#include <stdint.h>
// Sum an array of 32-bit integers.
// Returns 0 if length <= 0 or ptr is null (simple safety).
int32_t sum_int32(const int32_t *values, int32_t length) {
  if (values == 0 || length <= 0) {
    return 0;
  }

  int64_t total = 0;
  for (int32_t i = 0; i < length; i++) {
    total += values[i];
  }

  // Clamp to 32-bit range (demo; avoids overflow UB).
  if (total > 2147483647) {
    total = 2147483647;
  } else if (total < -2147483648LL) {
    total = -2147483648LL;
  }

  return (int32_t)total;
}

// Sum amounts (in cents) filtered by transaction type.
// typeFlags: 0 for expense, 1 for income
// Returns sum in cents (as int32_t, clamped if needed).
int32_t sum_by_type(const int32_t *amountsCents, const int32_t *typeFlags, int32_t length, int32_t filterType) {
  if (amountsCents == 0 || typeFlags == 0 || length <= 0) {
    return 0;
  }

  int64_t total = 0;
  for (int32_t i = 0; i < length; i++) {
    if (typeFlags[i] == filterType) {
      total += amountsCents[i];
    }
  }

  // Clamp to 32-bit range (demo; avoids overflow UB).
  if (total > 2147483647) {
    total = 2147483647;
  } else if (total < -2147483648LL) {
    total = -2147483648LL;
  }

  return (int32_t)total;
}

// Calculate running balances for transactions.
// amountsCents: array of amounts in cents
// typeFlags: 0 for expense, 1 for income
// startBalanceCents: starting balance in cents
// outputPtr: pointer to output array (must be allocated, size: length * 2 * sizeof(int32_t))
//   Output format: [before0, after0, before1, after1, ...]
// length: number of transactions
void calculate_running_balances(
  const int32_t *amountsCents,
  const int32_t *typeFlags,
  int32_t startBalanceCents,
  int32_t *outputPtr,
  int32_t length
) {
  if (amountsCents == 0 || typeFlags == 0 || outputPtr == 0 || length <= 0) {
    return;
  }

  int64_t runningBalance = startBalanceCents;

  for (int32_t i = 0; i < length; i++) {
    int64_t balanceBefore = runningBalance;
    int64_t balanceAfter = runningBalance + (typeFlags[i] == 1 ? amountsCents[i] : -amountsCents[i]);

    // Clamp to 32-bit range
    if (balanceBefore > 2147483647) balanceBefore = 2147483647;
    else if (balanceBefore < -2147483648LL) balanceBefore = -2147483648LL;
    
    if (balanceAfter > 2147483647) balanceAfter = 2147483647;
    else if (balanceAfter < -2147483648LL) balanceAfter = -2147483648LL;

    outputPtr[i * 2] = (int32_t)balanceBefore;
    outputPtr[i * 2 + 1] = (int32_t)balanceAfter;

    runningBalance = balanceAfter;
  }
}
/**
 * Validates a Portuguese NIF (Número de Identificação Fiscal) using checksum validation.
 * 
 * Rules:
 * - Must be exactly 9 digits long.
 * - Allowed first digits:
 *   - 1, 2, 3: Individual taxpayers
 *   - 45: Social Security / Investment Funds
 *   - 5: Companies / Legal Entities
 *   - 6: Public administration
 *   - 7: Regional government / public bodies
 *   - 8: Non-resident / special entities
 *   - 9: Irregular / Condominiums
 */
export function isValidPortugueseNIF(nif: string): boolean {
  if (!nif) return false;
  
  // Sanitize input (remove spaces or country prefix like PT)
  const cleanNif = nif.replace(/^PT/i, '').replace(/\s+/g, '');

  if (!/^\d{9}$/.test(cleanNif)) {
    return false;
  }

  const firstDigit = cleanNif[0];
  const firstTwoDigits = cleanNif.substring(0, 2);
  const validPrefixes = ['1', '2', '3', '5', '6', '7', '8', '9', '45'];

  const isValidPrefix = validPrefixes.some(prefix => 
    prefix.length === 1 ? firstDigit === prefix : firstTwoDigits === prefix
  );

  if (!isValidPrefix) {
    return false;
  }

  let total = 0;
  for (let i = 0; i < 8; i++) {
    total += parseInt(cleanNif[i], 10) * (9 - i);
  }

  const modulo = total % 11;
  const expectedCheckDigit = (modulo === 0 || modulo === 1) ? 0 : 11 - modulo;
  const actualCheckDigit = parseInt(cleanNif[8], 10);

  return expectedCheckDigit === actualCheckDigit;
}

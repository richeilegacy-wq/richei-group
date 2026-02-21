/**
 * Formats a number as a price string in the specified locale and currency
 * @param amount - The number to format
 * @param locale - The locale to use for formatting (defaults to browser's locale)
 * @param currency - The ISO 4217 currency code (defaults to NGN)
 * @returns Formatted price string
 */
const formatPrice = (
  amount: number,
  locale: string = navigator.language,
  currency: string = "NGN",
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to basic NGN formatting if locale/currency is invalid
    console.warn(`Error formatting price: ${error}`);
    return `$${amount.toFixed(2)}`;
  }
};

export default formatPrice;

/**
 * Strips all non-digit characters from a string.
 * Useful for extracting the raw numeric value from a formatted input.
 */
export const stripFormatting = (value: string): string =>
  value.replace(/[^\d]/g, "");

/**
 * Formats a numeric string with thousand separators (commas) for live input display.
 * Strips non-digit characters first, then applies formatting.
 * Returns empty string for empty input.
 *
 * @example formatNumberInput("100000000") => "100,000,000"
 * @example formatNumberInput("50,000") => "50,000"
 */
export const formatNumberInput = (value: string): string => {
  const digits = stripFormatting(value);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-NG");
};

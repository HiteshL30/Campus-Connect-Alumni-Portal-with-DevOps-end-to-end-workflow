/**
 * numberUtils.js
 * Safe number utilities to prevent NaN from reaching React's render tree.
 */

/**
 * Coerce any value to a finite number, returning `defaultValue` if the result
 * would be NaN, Infinity, or -Infinity.
 * @param {*} value
 * @param {number} defaultValue
 * @returns {number}
 */
export const safeNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isFinite(num) ? num : defaultValue;
};

/**
 * Format a number with locale-aware thousands separators.
 * Returns `defaultValue` string if `value` cannot be coerced to a finite number.
 * @param {*} value
 * @param {string} defaultValue
 * @returns {string}
 */
export const formatNumber = (value, defaultValue = '0') => {
  const num = Number(value);
  if (!isFinite(num)) return defaultValue;
  return num.toLocaleString();
};

/**
 * Format a number as a percentage string (e.g. 42 → "42%").
 * @param {*} value
 * @param {string} defaultValue
 * @returns {string}
 */
export const formatPercentage = (value, defaultValue = '0%') => {
  const num = Number(value);
  if (!isFinite(num)) return defaultValue;
  return `${num}%`;
};

/**
 * Format a number as a currency string (e.g. 9.5 → "$9.50").
 * @param {*} value
 * @param {string} currency  ISO currency code
 * @param {string} defaultValue
 * @returns {string}
 */
export const formatCurrency = (value, currency = 'USD', defaultValue = 'Free') => {
  const num = Number(value);
  if (!isFinite(num) || num === 0) return defaultValue;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

/**
 * Render-safe value: returns the value as-is, or `defaultValue` if it is
 * null, undefined, or NaN.
 * @param {*} value
 * @param {*} defaultValue
 * @returns {*}
 */
export const safeRender = (value, defaultValue = '-') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number' && !isFinite(value)) return defaultValue;
  return value;
};

/**
 * Render-safe string coercion.
 * @param {*} value
 * @param {string} defaultValue
 * @returns {string}
 */
export const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number' && !isFinite(value)) return defaultValue;
  return String(value);
};

/**
 * useSafeNumber.js
 * A hook that keeps numeric state free of NaN / Infinity values.
 *
 * Usage:
 *   const [count, setCount] = useSafeNumber(props.initialCount);
 */
import { useState, useEffect } from 'react';

/**
 * @param {*}      initialValue  - Initial value (coerced to a safe number)
 * @param {number} defaultValue  - Fallback when coercion yields NaN / Infinity
 * @returns {[number, Function]}
 */
export const useSafeNumber = (initialValue, defaultValue = 0) => {
  const coerce = (v) => {
    const num = Number(v);
    return isFinite(num) ? num : defaultValue;
  };

  const [value, setValue] = useState(() => coerce(initialValue));

  // Sync when initialValue changes (e.g., props update from API)
  useEffect(() => {
    setValue(coerce(initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const safeSetValue = (newValue) => {
    setValue(coerce(newValue));
  };

  return [value, safeSetValue];
};

export default useSafeNumber;

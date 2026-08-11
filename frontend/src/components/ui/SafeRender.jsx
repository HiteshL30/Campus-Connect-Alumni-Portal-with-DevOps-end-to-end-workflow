/**
 * SafeRender.jsx
 * Fragment-based guard — renders children as-is if safe, or `fallback` otherwise.
 * Prefer this over SafeText when you need NO extra DOM element.
 *
 * Usage:
 *   <SafeRender fallback="0">{event?.attendeeCount}</SafeRender>
 */
import React from 'react';

const SafeRender = ({ children, fallback = '—' }) => {
  try {
    if (typeof children === 'number' && !isFinite(children)) {
      return <>{fallback}</>;
    }
    if (children === null || children === undefined) {
      return <>{fallback}</>;
    }
    if (typeof children === 'object' && !React.isValidElement(children)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  } catch (error) {
    console.error('[SafeRender] Caught render error:', error);
    return <>{fallback}</>;
  }
};

export default SafeRender;

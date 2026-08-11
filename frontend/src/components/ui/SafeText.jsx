/**
 * SafeText.jsx
 * A lightweight wrapper that prevents NaN / null / undefined values from
 * reaching the DOM and triggering React warnings.
 *
 * Usage:
 *   <SafeText>{event?.attendeeCount}</SafeText>
 *   <SafeText fallback="N/A">{event?.rating?.toFixed(1)}</SafeText>
 */
import React from 'react';

const SafeText = ({ children, fallback = '-', className, as: Tag = 'span' }) => {
  // Bail out on NaN numbers
  if (typeof children === 'number' && !isFinite(children)) {
    return <Tag className={className}>{fallback}</Tag>;
  }

  // Bail out on null / undefined
  if (children === null || children === undefined) {
    return <Tag className={className}>{fallback}</Tag>;
  }

  // Bail out on plain objects (accidental object renders)
  if (typeof children === 'object' && !React.isValidElement(children)) {
    return <Tag className={className}>{fallback}</Tag>;
  }

  return <Tag className={className}>{children}</Tag>;
};

export default SafeText;

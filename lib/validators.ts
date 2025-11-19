/**
 * Validation helper functions
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate an email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
    return { valid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  if (email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a URL
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL is required');
    return { valid: false, errors };
  }

  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('Phone number is required');
    return { valid: false, errors };
  }

  const phoneRegex = /^\+?[\d\s-()]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    errors.push('Invalid phone number format');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a date string
 */
export function validateDate(dateString: string): ValidationResult {
  const errors: string[] = [];

  if (!dateString) {
    errors.push('Date is required');
    return { valid: false, errors };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a number within a range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number
): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== 'number' || isNaN(value)) {
    errors.push('Value must be a number');
    return { valid: false, errors };
  }

  if (value < min) {
    errors.push(`Value must be at least ${min}`);
  }

  if (value > max) {
    errors.push(`Value must be at most ${max}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a string length
 */
export function validateStringLength(
  value: string,
  minLength: number,
  maxLength: number
): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== 'string') {
    errors.push('Value must be a string');
    return { valid: false, errors };
  }

  if (value.length < minLength) {
    errors.push(`Value must be at least ${minLength} characters`);
  }

  if (value.length > maxLength) {
    errors.push(`Value must be at most ${maxLength} characters`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate required fields in an object
 */
export function validateRequired(
  obj: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === null || obj[field] === undefined) {
      errors.push(`${field} is required`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Combine multiple validation results
 */
export function combineValidations(
  ...results: ValidationResult[]
): ValidationResult {
  const errors: string[] = [];

  for (const result of results) {
    errors.push(...result.errors);
  }

  return { valid: errors.length === 0, errors };
}

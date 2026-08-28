/**
 * Calculates exact age string (years, months, days) dynamically from Date of Birth.
 * Handles month boundaries, variable month lengths, and leap years.
 * 
 * @param {string | Date} dobInput - Date of Birth (YYYY-MM-DD or Date object)
 * @param {string | Date} [asOfInput] - Reference date (defaults to today)
 * @returns {{ years: number, months: number, days: number, formatted: string }}
 */
export function calculateAge(dobInput, asOfInput = new Date()) {
  if (!dobInput) {
    return { years: 0, months: 0, days: 0, formatted: 'N/A' };
  }

  const birthDate = new Date(dobInput);
  const refDate = new Date(asOfInput);

  if (isNaN(birthDate.getTime())) {
    return { years: 0, months: 0, days: 0, formatted: 'Invalid date' };
  }

  let years = refDate.getFullYear() - birthDate.getFullYear();
  let months = refDate.getMonth() - birthDate.getMonth();
  let days = refDate.getDate() - birthDate.getDate();

  // Handle negative days by borrowing days from the previous month
  if (days < 0) {
    months--;
    // Get last day of previous month
    const prevMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Handle negative months by borrowing a year
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0 || years > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

  const formatted = parts.join(' ');

  return {
    years,
    months,
    days,
    formatted,
  };
}

/**
 * Generates an automatic Patient ID Code (e.g. CAT-2026-00124)
 * @returns {string} Patient ID Code
 */
export function generatePatientIdCode() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CAT-${year}-${randomNum}`;
}

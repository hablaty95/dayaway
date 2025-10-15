import { useCallback } from 'react';

export function useVacationValidation() {
  const validateVacation = useCallback((startDate, endDate) => {
    const errors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // start date must be at least 2 days in future
    const minStartDate = new Date(today);
    minStartDate.setDate(today.getDate() + 2);

    if (start <= minStartDate) {
      errors.push('Start date must be at least 2 days from today');
    }

    // 2. End date must be ≥ start date
    if (end < start) {
      errors.push('End date cannot be before start date');
    }

    // 3. Vacation length ≤ 60 days
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    if (diffDays > 60) {
      errors.push('Vacation cannot exceed 60 days');
    }

//    // 4. Minimum duration (at least 1 day)
//    if (diffDays < 1) {
//      errors.push('Vacation must be at least 1 day');
//    }

    return {
      isValid: errors.length === 0,
      errors,
      duration: diffDays
    };
  }, []);

  return { validateVacation };
}
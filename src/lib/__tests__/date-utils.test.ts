import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateNextDueDate,
  addDaysToDate,
  formatDate,
  parseDate,
} from '../date-utils';

describe('Date Utility Functions', () => {
  describe('calculateNextDueDate', () => {
    beforeEach(() => {
      // Reset system time before each test
      vi.useRealTimers();
    });

    it('should calculate next due date for future start date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const result = calculateNextDueDate(tomorrow, 7, '10:00');
      
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(0);
      expect(result.getDate()).toBe(tomorrow.getDate());
    });

    it('should calculate next due date for past start date', () => {
      const pastDate = new Date('2024-01-01T10:00:00');
      const result = calculateNextDueDate(pastDate, 7, '10:00');
      
      const now = new Date();
      expect(result.getTime()).toBeGreaterThan(now.getTime());
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(0);
    });

    it('should handle different times of day', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const morning = calculateNextDueDate(tomorrow, 1, '08:30');
      expect(morning.getHours()).toBe(8);
      expect(morning.getMinutes()).toBe(30);

      const evening = calculateNextDueDate(tomorrow, 1, '18:45');
      expect(evening.getHours()).toBe(18);
      expect(evening.getMinutes()).toBe(45);

      const midnight = calculateNextDueDate(tomorrow, 1, '00:00');
      expect(midnight.getHours()).toBe(0);
      expect(midnight.getMinutes()).toBe(0);
    });

    it('should handle various frequency intervals', () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const daily = calculateNextDueDate(startDate, 1, '10:00');
      const weekly = calculateNextDueDate(startDate, 7, '10:00');
      const biweekly = calculateNextDueDate(startDate, 14, '10:00');
      const monthly = calculateNextDueDate(startDate, 30, '10:00');

      expect(daily).toBeDefined();
      expect(weekly).toBeDefined();
      expect(biweekly).toBeDefined();
      expect(monthly).toBeDefined();
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Date('2024-02-29T10:00:00');
      const result = calculateNextDueDate(leapYearDate, 365, '10:00');
      
      expect(result).toBeDefined();
      expect(result.getHours()).toBe(10);
    });

    it('should handle month boundary transitions', () => {
      const endOfMonth = new Date('2024-01-31T10:00:00');
      const result = calculateNextDueDate(endOfMonth, 1, '10:00');
      
      expect(result).toBeDefined();
      expect(result.getHours()).toBe(10);
    });

    it('should handle year boundary transitions', () => {
      const endOfYear = new Date('2024-12-31T23:59:00');
      const result = calculateNextDueDate(endOfYear, 1, '10:00');
      
      expect(result).toBeDefined();
    });

    it('should calculate correct cycles for past dates', () => {
      // Set a date 30 days in the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      pastDate.setHours(10, 0, 0, 0);

      const result = calculateNextDueDate(pastDate, 7, '10:00');
      
      const now = new Date();
      expect(result.getTime()).toBeGreaterThan(now.getTime());
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe('addDaysToDate', () => {
    it('should add positive days correctly', () => {
      const date = new Date('2024-01-15T10:00:00');
      const result = addDaysToDate(date, 5);
      
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });

    it('should add zero days (return same date)', () => {
      const date = new Date('2024-01-15T10:00:00');
      const result = addDaysToDate(date, 0);
      
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(0);
    });

    it('should handle month transitions', () => {
      const date = new Date('2024-01-30T10:00:00');
      const result = addDaysToDate(date, 5);
      
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });

    it('should handle year transitions', () => {
      const date = new Date('2024-12-30T10:00:00');
      const result = addDaysToDate(date, 5);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(4);
    });

    it('should handle leap year February', () => {
      const date = new Date('2024-02-28T10:00:00');
      const result = addDaysToDate(date, 1);
      
      expect(result.getDate()).toBe(29); // Leap year
      expect(result.getMonth()).toBe(1); // February
    });

    it('should handle non-leap year February', () => {
      const date = new Date('2023-02-28T10:00:00');
      const result = addDaysToDate(date, 1);
      
      expect(result.getDate()).toBe(1); // March 1st
      expect(result.getMonth()).toBe(2); // March
    });

    it('should not mutate original date', () => {
      const date = new Date('2024-01-15T10:00:00');
      const originalTime = date.getTime();
      
      addDaysToDate(date, 5);
      
      expect(date.getTime()).toBe(originalTime);
    });

    it('should handle large day additions', () => {
      const date = new Date('2024-01-01T10:00:00');
      const result = addDaysToDate(date, 366); // 2024 is a leap year
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });
  });

  describe('formatDate', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:45.123Z');
      const result = formatDate(date);
      
      expect(result).toBe('2024-01-15T10:30:45.123Z');
    });

    it('should handle different dates consistently', () => {
      const dates = [
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-12-31T23:59:59.999Z'),
        new Date('2024-06-15T12:30:45.500Z'),
      ];

      dates.forEach((date) => {
        const result = formatDate(date);
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date string', () => {
      const dateString = '2024-01-15T10:30:45.123Z';
      const result = parseDate(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(15);
    });

    it('should parse various date formats', () => {
      const formats = [
        '2024-01-15',
        '2024-01-15T10:30:45Z',
        '2024-01-15T10:30:45.123Z',
        'January 15, 2024',
      ];

      formats.forEach((format) => {
        const result = parseDate(format);
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).not.toBeNaN();
      });
    });

    it('should handle invalid date strings', () => {
      const result = parseDate('invalid-date');
      expect(result.getTime()).toBeNaN();
    });
  });

  describe('Integration: formatDate and parseDate', () => {
    it('should be reversible operations', () => {
      const originalDate = new Date('2024-01-15T10:30:45.123Z');
      const formatted = formatDate(originalDate);
      const parsed = parseDate(formatted);
      
      expect(parsed.getTime()).toBe(originalDate.getTime());
    });
  });

  describe('Timezone Handling', () => {
    it('should handle UTC dates correctly', () => {
      const utcDate = new Date('2024-01-15T10:00:00.000Z');
      const result = calculateNextDueDate(utcDate, 1, '10:00');
      
      expect(result).toBeDefined();
    });

    it('should maintain time consistency across operations', () => {
      const date = new Date('2024-01-15T10:00:00');
      const added = addDaysToDate(date, 7);
      
      expect(added.getHours()).toBe(date.getHours());
      expect(added.getMinutes()).toBe(date.getMinutes());
    });
  });
});

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ValidationRule } from '@/types/form';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  validation?: ValidationRule;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: string;
}

export function DatePicker({ 
  value, 
  onChange, 
  validation, 
  placeholder, 
  className, 
  style, 
  icon 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [showYearPicker, setShowYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected date when value changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    
    const dateFormat = validation?.dateFormat || 'YYYY-MM-DD';
    const customFormat = validation?.customDateFormat;
    
    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
      case 'DD/MM/YYYY':
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      case 'DD-MM-YYYY':
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      case 'MM-DD-YYYY':
        return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
      case 'custom':
        if (customFormat) {
          // Simple custom format parsing
          return customFormat
            .replace('DD', String(date.getDate()).padStart(2, '0'))
            .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
            .replace('YYYY', String(date.getFullYear()));
        }
        return date.toISOString().split('T')[0];
      default:
        return date.toISOString().split('T')[0];
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check min/max date validation
    if (validation?.minDate) {
      const minDate = new Date(validation.minDate);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    
    if (validation?.maxDate) {
      const maxDate = new Date(validation.maxDate);
      maxDate.setHours(0, 0, 0, 0);
      if (date > maxDate) return true;
    }
    
    // Check age validation (for birth dates)
    if (validation?.minAge !== undefined || validation?.maxAge !== undefined) {
      const age = Math.floor((today.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (validation.minAge !== undefined && age < validation.minAge) return true;
      if (validation.maxAge !== undefined && age > validation.maxAge) return true;
    }
    
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    onChange(date.toISOString().split('T')[0]); // Always store as ISO format
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    
    // Add empty cells for days before the first day of the month
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -startDay + i + 1));
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add empty cells to complete the last week
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getYearRange = (): number[] => {
    const currentYear = new Date().getFullYear();
    let minYear = currentYear - 100; // Default 100 years back
    let maxYear = currentYear + 10;  // Default 10 years forward

    // Adjust based on validation rules
    if (validation?.minDate) {
      minYear = Math.max(minYear, new Date(validation.minDate).getFullYear());
    }
    if (validation?.maxDate) {
      maxYear = Math.min(maxYear, new Date(validation.maxDate).getFullYear());
    }

    // Adjust based on age validation
    if (validation?.minAge !== undefined) {
      maxYear = Math.min(maxYear, currentYear - validation.minAge);
    }
    if (validation?.maxAge !== undefined) {
      minYear = Math.max(minYear, currentYear - validation.maxAge);
    }

    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(year);
      return newMonth;
    });
    setShowYearPicker(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{icon}</span>
          </div>
        )}
        <input
          type="text"
          value={formatDisplayDate(selectedDate)}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          placeholder={placeholder}
          className={`${className} cursor-pointer`}
          style={style}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={showYearPicker}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]}
              </h3>
              <button
                type="button"
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="text-lg font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {currentMonth.getFullYear()}
                <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={showYearPicker}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Year Picker */}
          {showYearPicker ? (
            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {getYearRange().map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`
                      px-3 py-2 text-sm rounded transition-colors
                      ${year === currentMonth.getFullYear() 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDate && 
                    date.getDate() === selectedDate.getDate() && 
                    date.getMonth() === selectedDate.getMonth() && 
                    date.getFullYear() === selectedDate.getFullYear();
                  const isDisabled = isDateDisabled(date);
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled || !isCurrentMonth}
                      className={`
                        w-8 h-8 text-sm rounded transition-colors
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${isSelected ? 'bg-blue-600 text-white' : ''}
                        ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                        ${!isDisabled && !isSelected && isCurrentMonth ? 'text-gray-900' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Clear button */}
          {selectedDate && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

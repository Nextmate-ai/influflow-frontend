'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, parse, isValid } from 'date-fns';

interface CustomDateTimePickerProps {
  value: string; // YYYY-MM-DD HH:mm:ss format
  onChange: (value: string) => void;
  placeholder?: string;
  minDateTime?: Date;
  maxDateTime?: Date;
  className?: string;
}

/**
 * TimeUnit 组件 - 单个时间单位（小时/分钟/秒）的输入控件
 */
const TimeUnit: React.FC<{
  value: number;
  onChange: (v: number) => void;
  max: number;
  label: string;
}> = ({ value, onChange, max, label }) => {
  const handleIncrement = () => {
    onChange(value >= max ? 0 : value + 1);
  };

  const handleDecrement = () => {
    onChange(value <= 0 ? max : value - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(0);
      return;
    }
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 0 && num <= max) {
      onChange(num);
    }
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={handleIncrement}
        type="button"
        className="flex size-5 items-center justify-center rounded-md text-white transition-colors hover:bg-[#2DC3D9]/20"
      >
        <svg className="size-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value.toString().padStart(2, '0')}
        onChange={handleInputChange}
        className="h-7 w-10 rounded-lg border border-[#2DC3D9] bg-transparent text-center text-sm text-white focus:border-[#2DC3D9] focus:outline-none"
      />
      <button
        onClick={handleDecrement}
        type="button"
        className="flex size-5 items-center justify-center rounded-md text-white transition-colors hover:bg-[#2DC3D9]/20"
      >
        <svg className="size-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <span className="text-[9px] text-gray-500">{label}</span>
    </div>
  );
};

/**
 * TimeSelector 组件 - 时间选择器（时:分:秒）
 */
const TimeSelector: React.FC<{
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (h: number) => void;
  onMinutesChange: (m: number) => void;
  onSecondsChange: (s: number) => void;
}> = ({ hours, minutes, seconds, onHoursChange, onMinutesChange, onSecondsChange }) => {
  return (
    <div className="mt-2 border-t border-[#2DC3D9]/20 pt-2">
      <div className="mb-1 text-[10px] text-gray-400">Time</div>
      <div className="flex items-center justify-center gap-1.5 pb-1">
        <TimeUnit value={hours} onChange={onHoursChange} max={23} label="HH" />
        <span className="text-sm text-white">:</span>
        <TimeUnit value={minutes} onChange={onMinutesChange} max={59} label="MM" />
        <span className="text-sm text-white">:</span>
        <TimeUnit value={seconds} onChange={onSecondsChange} max={59} label="SS" />
      </div>
    </div>
  );
};

/**
 * 自定义日期时间选择器组件 - 支持日期和时间（时:分:秒）选择
 */
export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD HH:mm:ss',
  minDateTime,
  maxDateTime,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    value ? parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()) : null,
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDateTime && isValid(selectedDateTime) ? selectedDateTime : new Date(),
  );
  const [hours, setHours] = useState(
    selectedDateTime && isValid(selectedDateTime) ? selectedDateTime.getHours() : 0,
  );
  const [minutes, setMinutes] = useState(
    selectedDateTime && isValid(selectedDateTime) ? selectedDateTime.getMinutes() : 0,
  );
  const [seconds, setSeconds] = useState(
    selectedDateTime && isValid(selectedDateTime) ? selectedDateTime.getSeconds() : 0,
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // 计算弹出层位置，确保在视口内可见
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const popupHeight = isMobile ? 370 : 400; // 优化后的高度
      const popupWidth = isMobile ? Math.min(340, window.innerWidth - 32) : 320;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 计算垂直位置
      let top = rect.bottom + window.scrollY + 8;
      if (rect.bottom + popupHeight + 8 > viewportHeight) {
        top = rect.top + window.scrollY - popupHeight - 8;
        if (top < window.scrollY) {
          top = window.scrollY + 16;
        }
      }

      // 计算水平位置
      let left = rect.left + window.scrollX;
      if (isMobile) {
        left = (viewportWidth - popupWidth) / 2 + window.scrollX;
      } else {
        if (left + popupWidth > viewportWidth + window.scrollX) {
          left = viewportWidth + window.scrollX - popupWidth - 16;
        }
        if (left < window.scrollX) {
          left = window.scrollX + 16;
        }
      }

      setPopupPosition({ top, left });
    }
  }, [isOpen, currentMonth]);

  // 关闭选择器当点击外部时
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // 同步外部 value 变化
  useEffect(() => {
    if (value) {
      const date = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date());
      if (isValid(date)) {
        setSelectedDateTime(date);
        setCurrentMonth(date);
        setHours(date.getHours());
        setMinutes(date.getMinutes());
        setSeconds(date.getSeconds());
      }
    } else {
      setSelectedDateTime(null);
    }
  }, [value]);

  const formatDateTime = (date: Date | null): string => {
    if (!date || !isValid(date)) return '';
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateTimeSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      hours,
      minutes,
      seconds,
    );

    // 验证是否在有效范围内
    if (minDateTime && newDate < minDateTime) {
      return;
    }
    if (maxDateTime && newDate > maxDateTime) {
      return;
    }

    setSelectedDateTime(newDate);
    onChange(formatDateTime(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleToday = () => {
    const today = new Date();
    const newDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds,
    );
    setSelectedDateTime(newDate);
    setCurrentMonth(today);
    onChange(formatDateTime(newDate));
    setIsOpen(false);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  // 填充空白
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDateTime || !isValid(selectedDateTime)) return false;
    return (
      day === selectedDateTime.getDate() &&
      currentMonth.getMonth() === selectedDateTime.getMonth() &&
      currentMonth.getFullYear() === selectedDateTime.getFullYear()
    );
  };

  // 检查日期时间是否在有效范围内
  const isDateTimeInRange = (day: number): boolean => {
    const dateTime = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      hours,
      minutes,
      seconds,
    );

    // 使用168小时（7天）限制
    const now = new Date();
    const maxTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 如果提供了自定义范围，使用自定义范围
    const minTime = minDateTime || now;
    const maxLimit = maxDateTime || maxTime;

    return dateTime > minTime && dateTime <= maxLimit;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const popupContent = isOpen && popupPosition && typeof window !== 'undefined' && (
    <div
      ref={pickerRef}
      data-date-picker
      className={`fixed z-[10000] ${isMobile ? 'w-[calc(100vw-32px)] max-w-[340px]' : 'w-[320px]'} overflow-y-auto rounded-2xl border border-[#2DC3D9] bg-[#0B041E] p-3 shadow-xl md:p-4`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{
        top: `${popupPosition.top - (isMobile ? 10 : 20)}px`,
        left: `${popupPosition.left}px`,
        maxHeight: isMobile ? `${Math.min(370, window.innerHeight - 32)}px` : undefined,
      }}
    >
      {/* 月份导航和Today按钮 */}
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <button
          onClick={handlePrevMonth}
          type="button"
          className="rounded-lg p-1.5 text-white transition-colors hover:bg-[#2DC3D9]/20 md:p-2"
        >
          <svg
            className="size-4 md:size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-sm font-semibold text-white md:text-base">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={handleToday}
            type="button"
            className="rounded-lg bg-[#2DC3D9]/20 px-2 py-1 text-[10px] font-medium text-[#2DC3D9] transition-colors hover:bg-[#2DC3D9]/30 md:px-3 md:py-1.5 md:text-xs"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            type="button"
            className="rounded-lg p-1.5 text-white transition-colors hover:bg-[#2DC3D9]/20 md:p-2"
          >
            <svg
              className="size-4 md:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center py-1.5 text-[10px] font-medium text-gray-400 md:py-2 md:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-8 md:h-10" />;
          }

          const isTodayDate = isToday(day);
          const isSelectedDate = isSelected(day);
          const isInRange = isDateTimeInRange(day);

          return (
            <button
              key={index}
              onClick={() => isInRange && handleDateTimeSelect(day)}
              disabled={!isInRange}
              type="button"
              className={`h-8 rounded-lg text-xs font-medium transition-all md:h-10 md:text-sm ${
                !isInRange
                  ? 'cursor-not-allowed text-gray-600 opacity-30'
                  : isSelectedDate
                    ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                    : isTodayDate
                      ? 'border border-[#2DC3D9] text-[#2DC3D9]'
                      : 'text-white hover:bg-[#2DC3D9]/20'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 时间选择器 */}
      <TimeSelector
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onHoursChange={setHours}
        onMinutesChange={setMinutes}
        onSecondsChange={setSeconds}
      />
    </div>
  );

  return (
    <div className={`relative ${className}`} data-date-picker>
      {/* 输入框 */}
      <div
        ref={inputRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex size-full cursor-pointer items-center justify-between rounded-2xl border border-[#2DC3D9] bg-transparent px-4 py-3 transition-colors focus-within:border-[#2DC3D9] hover:border-[#2DC3D9]"
      >
        <input
          type="text"
          readOnly
          value={formatDateTime(selectedDateTime)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-gray-500"
        />
        <svg
          className="size-5 text-[#2DC3D9]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* 使用 Portal 渲染到 body，确保 z-index 正确 */}
      {typeof window !== 'undefined' &&
        isOpen &&
        popupPosition &&
        createPortal(popupContent, document.body)}
    </div>
  );
};

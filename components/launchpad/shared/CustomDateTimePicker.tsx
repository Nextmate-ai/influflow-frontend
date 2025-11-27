'use client';

import React, { useState, useRef, useEffect } from 'react';
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
 * 受控组件版本：确保值的同步和输入功能正常
 */
const TimeUnit: React.FC<{
  value: number;
  onChange: (v: number) => void;
  max: number;
  label: string;
}> = ({ value, onChange, max, label }) => {
  const [localValue, setLocalValue] = useState(value.toString().padStart(2, '0'));
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部 value 变化（仅在非编辑状态时）
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value.toString().padStart(2, '0'));
    }
  }, [value, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // 允许空值和数字
    if (val !== '' && !/^\d+$/.test(val)) {
      return;
    }

    // 只更新本地值，不立即提交
    setLocalValue(val);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // 失焦时验证和格式化
    const num = localValue === '' ? 0 : parseInt(localValue, 10);
    const validNum = Math.min(Math.max(0, num), max);
    onChange(validNum);
    setLocalValue(validNum.toString().padStart(2, '0'));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(true);
    // 聚焦时选中所有内容
    setTimeout(() => e.target.select(), 0);
  };

  return (
    <div
      className="flex flex-col items-center gap-1"
      onMouseDown={(e) => {
        e.stopPropagation();
        // 在 mousedown 时就聚焦
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        tabIndex={0}
        className="relative z-[10001] h-10 w-12 cursor-text rounded-lg border-2 border-[#2DC3D9] bg-[#0B041E] text-center text-base font-medium text-white transition-colors hover:border-[#60A5FA] focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50"
        style={{
          pointerEvents: 'auto',
          touchAction: 'manipulation',
          userSelect: 'text',
          WebkitUserSelect: 'text',
        }}
      />
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
};

/**
 * 获取时区偏移量字符串（如 UTC+8, UTC-5）
 */
const getTimezoneOffset = (): string => {
  const offset = -new Date().getTimezoneOffset() / 60; // 转换为小时偏移
  if (offset === 0) {
    return 'UTC';
  }
  const sign = offset > 0 ? '+' : '-';
  return `UTC${sign}${Math.abs(offset)}`;
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
  const timezoneOffset = getTimezoneOffset();

  return (
    <div
      className="mt-2 border-t border-[#2DC3D9]/20 pt-2"
    >
      <div className="mb-1 flex items-center justify-center gap-2">
        <span className="text-[10px] text-gray-400">Time</span>
        <span className="text-[10px] text-[#2DC3D9]">{timezoneOffset}</span>
      </div>
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
        // 先触发当前聚焦元素的 blur，确保时间输入值被保存
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && pickerRef.current.contains(activeElement)) {
          activeElement.blur();
        }

        // 延迟关闭，让 blur 事件处理完成
        setTimeout(() => {
          setIsOpen(false);
        }, 10);
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

  // 当时分秒改变时，如果已有选中的日期，立即更新并触发 onChange
  useEffect(() => {
    if (selectedDateTime && isValid(selectedDateTime)) {
      const newDate = new Date(
        selectedDateTime.getFullYear(),
        selectedDateTime.getMonth(),
        selectedDateTime.getDate(),
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes, seconds]);

  const formatDateTime = (date: Date | null): string => {
    if (!date || !isValid(date)) return '';
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };

  const formatDateTimeWithTimezone = (date: Date | null): string => {
    if (!date || !isValid(date)) return '';
    const dateTimeStr = format(date, 'yyyy-MM-dd HH:mm:ss');
    return `${dateTimeStr} ${getTimezoneOffset()}`;
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

    // 直接更新选中的日期时间，验证留给表单提交时处理
    setSelectedDateTime(newDate);
    onChange(formatDateTime(newDate));
    // 不自动关闭弹窗，让用户可以继续调整时间
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
    // 只比较日期部分，不比较时间
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // 获取今天的日期（时间归零到00:00:00）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 7天后的日期（时间归零）
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    // 如果有自定义范围，也需要归零时间部分
    let minDate = today;
    if (minDateTime) {
      minDate = new Date(minDateTime);
      minDate.setHours(0, 0, 0, 0);
    }

    let maxLimit = maxDate;
    if (maxDateTime) {
      maxLimit = new Date(maxDateTime);
      maxLimit.setHours(0, 0, 0, 0);
    }

    // 使用 >= 允许选择今天
    return date >= minDate && date <= maxLimit;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 计算弹出层位置（显示在输入框上方）
  const getPopupStyle = (): React.CSSProperties => {
    if (!inputRef.current) return {};
    const rect = inputRef.current.getBoundingClientRect();
    const popupHeight = isMobile ? 370 : 500;
    return {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 8}px`,
      left: `${rect.left}px`,
      width: isMobile ? `${Math.min(rect.width, window.innerWidth - 32)}px` : '320px',
      maxHeight: `${popupHeight}px`,
    };
  };

  const popupContent = isOpen && (
    <div
      ref={pickerRef}
      data-date-picker
      className={`z-[10000] overflow-y-auto rounded-2xl border border-[#2DC3D9] bg-[#0B041E] p-3 shadow-xl md:p-4`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={getPopupStyle()}
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
    <div className={`relative ${className}`} data-date-picker style={{ overflow: 'visible' }}>
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
          value={formatDateTimeWithTimezone(selectedDateTime)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-gray-500"
        />
        <svg
          className="size-5 shrink-0 text-[#2DC3D9]"
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

      {/* 直接渲染在当前位置，不使用 Portal */}
      {popupContent}
    </div>
  );
};

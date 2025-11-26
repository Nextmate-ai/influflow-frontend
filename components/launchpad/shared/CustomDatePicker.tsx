'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * 自定义日期选择器组件 - 完全英文显示，不依赖浏览器原生组件
 */
export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date(),
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
      // 日历的实际高度：月份导航(48px) + 星期标题(32px) + 日期网格(约240px，6行*40px) + 今天按钮(48px) + padding(32px) = 约400px
      // 但为了安全，使用更准确的计算
      const isMobile = window.innerWidth < 768;
      const popupHeight = isMobile ? 340 : 360; // 移动端稍微小一点
      const popupWidth = isMobile ? Math.min(340, window.innerWidth - 32) : 320; // 移动端适配屏幕宽度
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // 计算垂直位置
      let top = rect.bottom + window.scrollY + 8;
      // 如果下方空间不足，则在上方显示
      if (rect.bottom + popupHeight + 8 > viewportHeight) {
        top = rect.top + window.scrollY - popupHeight - 8;
        // 如果上方也不够，则贴底显示，但限制最大高度
        if (top < window.scrollY) {
          const availableHeight = viewportHeight - 32; // 保留上下各16px边距
          top = window.scrollY + 16;
          // 如果可用高度小于弹出层高度，则使用可用高度
          if (availableHeight < popupHeight) {
            // 位置保持不变，但会在样式中限制高度
          }
        }
      }
      
      // 计算水平位置
      let left = rect.left + window.scrollX;
      // 移动端居中显示
      if (isMobile) {
        left = (viewportWidth - popupWidth) / 2 + window.scrollX;
      } else {
        // 桌面端：如果右侧空间不足，则向左调整
        if (left + popupWidth > viewportWidth + window.scrollX) {
          left = viewportWidth + window.scrollX - popupWidth - 16;
        }
        // 确保不超出左边界
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
      // 延迟添加监听器，确保点击事件先处理
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
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
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
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(formatDate(today));
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
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 检查日期是否在有效范围内（今天到7天后）
  const isDateInRange = (day: number): boolean => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 重置为当天开始

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999); // 设置为7天后的结束

    return date >= today && date <= sevenDaysLater;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const popupContent = isOpen && popupPosition && typeof window !== 'undefined' && (
    <div
      ref={pickerRef}
      data-date-picker
      className={`fixed z-[10000] ${isMobile ? 'w-[calc(100vw-32px)] max-w-[340px]' : 'w-[320px]'} overflow-y-auto rounded-2xl border border-[#2DC3D9] bg-[#0B041E] p-3 shadow-xl md:p-4`}
      onClick={(e) => {
        // 只阻止冒泡到 Modal，不影响内部点击
        e.stopPropagation();
      }}
      style={{
        top: `${popupPosition.top - (isMobile ? 10 : 20)}px`,
        left: `${popupPosition.left}px`,
        maxHeight: isMobile ? `${Math.min(340, window.innerHeight - 32)}px` : undefined,
      }}
    >
      {/* 月份导航和Today按钮 */}
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <button
          onClick={handlePrevMonth}
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
            className="rounded-lg bg-[#2DC3D9]/20 px-2 py-1 text-[10px] font-medium text-[#2DC3D9] transition-colors hover:bg-[#2DC3D9]/30 md:px-3 md:py-1.5 md:text-xs"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
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
          const isInRange = isDateInRange(day);

          return (
            <button
              key={index}
              onClick={() => isInRange && handleDateSelect(day)}
              disabled={!isInRange}
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
          value={formatDate(selectedDate)}
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


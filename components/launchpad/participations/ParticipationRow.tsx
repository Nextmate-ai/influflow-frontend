'use client';

import React from 'react';

interface ParticipationRowProps {
  prediction: string;
  totalVolume: string;
  rewards: number;
  time: string;
  status: 'Ongoing' | 'Finished';
  outcome: 'Yes' | 'No' | null;
  opinion?: 'Yes' | 'No' | null;
  viewType?: 'participations' | 'creations';
}

/**
 * 参与行组件 - 表格中的单行数据
 */
export const ParticipationRow: React.FC<ParticipationRowProps> = ({
  prediction,
  totalVolume,
  rewards,
  time,
  status,
  outcome,
  opinion,
  viewType = 'participations',
}) => {
  // Outcome 渐变样式
  const getOutcomeStyle = () => {
    if (viewType === 'creations') {
      // creations 中 outcome 使用 win 渐变色
      return {
        background: 'linear-gradient(to right, #BAC1FF 0%, #63FEFE 48%, #FF3EEC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    } else {
      // participations 中的样式
      if (outcome === 'Yes') {
        // win: 0% BAC1FF；48% 63FEFE 100%： FF3EEC
        return {
          background: 'linear-gradient(to right, #BAC1FF 0%, #63FEFE 48%, #FF3EEC 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      } else if (outcome === 'No') {
        // lose: 0: CB30E0, 48%: B84DFF 100%: 312E81
        return {
          background: 'linear-gradient(to right, #CB30E0 0%, #B84DFF 48%, #312E81 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      }
    }
    return {};
  };

  // Status 边框样式
  const getStatusBorderStyle = () => {
    if (viewType === 'creations' && status === 'Ongoing') {
      // ongoing 使用 create 按钮的渐变边框
      return {
        background: 'linear-gradient(to right, #1FA2FF, #12D8FA, #6155F5)',
        padding: '2px',
        borderRadius: '9999px',
      };
    }
    return {};
  };

  if (viewType === 'creations') {
    return (
      <tr className="border-b border-[#2DC3D9]/30 hover:bg-[#2DC3D9]/5 transition-colors">
        {/* Prediction - 最长为340像素，超过支持换行，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <p
            className="text-white font-medium break-words"
            style={{ maxWidth: '340px', margin: '0 auto' }}
          >
            {prediction}
          </p>
        </td>

        {/* Total Volume - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="text-white">{totalVolume}</span>
        </td>

        {/* Rewards - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="text-white font-semibold">{rewards}</span>
        </td>

        {/* Time - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="text-gray-400">{time}</span>
        </td>

        {/* Status - 如果是 ongoing，边框使用渐变，居中对齐 */}
        <td className="px-6 py-4 text-center">
          {status === 'Ongoing' ? (
            <div
              style={getStatusBorderStyle()}
              className="inline-block rounded-full"
            >
              <span className="px-3 py-1 bg-[#0B041E] rounded-full text-sm font-semibold text-white block">
                {status}
              </span>
            </div>
          ) : (
            <span className="px-3 py-1 border border-[#86FDE8] rounded-full text-sm font-semibold text-[#86FDE8] bg-[#86FDE8]/10">
              {status}
            </span>
          )}
        </td>

        {/* Outcome - 使用 win 渐变色，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="font-semibold" style={getOutcomeStyle()}>
            {outcome || '-'}
          </span>
        </td>
      </tr>
    );
  }

  // participations 视图
  return (
    <tr className="border-b border-[#2DC3D9]/30 hover:bg-[#2DC3D9]/5 transition-colors">
      {/* Prediction - 最长为340像素，超过支持换行，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <p
          className="text-white font-medium break-words"
          style={{ maxWidth: '340px', margin: '0 auto' }}
        >
          {prediction}
        </p>
      </td>

      {/* Opinion - 正常展示，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="text-white">{opinion || '-'}</span>
      </td>

      {/* Outcome - 渐变文字，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="font-semibold" style={getOutcomeStyle()}>
          {outcome === 'Yes' ? 'Win' : outcome === 'No' ? 'Lose' : '-'}
        </span>
      </td>

      {/* Profit/Lose - 正常展示，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="text-white font-semibold">{rewards}</span>
      </td>

      {/* Time - 正常展示，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="text-gray-400">{time}</span>
      </td>

      {/* Status - 正常展示，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span
          className={`px-3 py-1 border border-[#CB30E0] rounded-full text-sm font-semibold ${
            status === 'Ongoing'
              ? 'text-[#CB30E0] bg-[#CB30E0]/10'
              : 'text-[#86FDE8] bg-[#86FDE8]/10 border-[#86FDE8]'
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

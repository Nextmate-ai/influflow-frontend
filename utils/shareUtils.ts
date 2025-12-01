/**
 * 分享工具函数库
 * 提供市场分享链接的生成和复制功能
 */

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<void>
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not supported');
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}

/**
 * 生成市场分享链接
 * @param marketId 市场ID
 * @returns 完整的分享链接 URL
 */
export function generateShareLink(marketId: string): string {
  if (typeof window === 'undefined') {
    // 服务端渲染时返回相对路径
    return `/launchpad?marketId=${encodeURIComponent(marketId)}`;
  }

  const origin = window.location.origin;
  const encodedMarketId = encodeURIComponent(marketId);
  return `${origin}/launchpad?marketId=${encodedMarketId}`;
}

/**
 * 复制市场分享链接到剪贴板
 * @param marketId 市场ID
 * @returns Promise<boolean> 成功返回 true，失败返回 false
 */
export async function copyMarketShareLink(marketId: string): Promise<boolean> {
  try {
    const shareLink = generateShareLink(marketId);
    await copyToClipboard(shareLink);
    return true;
  } catch (error) {
    console.error('Failed to copy market share link:', error);
    return false;
  }
}

/**
 * Normalize Twitter avatar URLs to request higher resolution assets.
 * Twitter returns 48x48 `_normal` thumbnails by default, which look blurry
 * when rendered at larger sizes. This helper bumps the requested size.
 * 
 * Using 200x200 provides optimal balance:
 * - Covers max display size of 64px with 2x Retina (128px needed)
 * - Smaller file size (~1/4 of 400x400) for better performance
 * - Sufficient quality for all display sizes (40-64px)
 */
export function getHighResTwitterAvatar(
  avatarUrl?: string | null,
  targetSize = '200x200',
): string | undefined {
  if (!avatarUrl) {
    return undefined;
  }

  const isHttpUrl =
    avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
  if (!isHttpUrl) {
    return avatarUrl;
  }

  try {
    const url = new URL(avatarUrl);

    // Only rewrite Twitter CDN URLs
    if (!url.hostname.includes('twimg.com')) {
      return avatarUrl;
    }

    // Pattern to match low-res suffixes: _normal, _bigger, _mini, _x96, _x73, _x48, etc.
    const lowResPattern =
      /_(normal|bigger|mini|x96|x73|x48)(\.[a-zA-Z0-9]+)$/i;

    // Pattern to match any existing size suffix (e.g., _200x200, _400x400)
    const sizePattern = /_(\d+x\d+)(\.[a-zA-Z0-9]+)$/i;

    // Replace low-res suffix with desired size
    if (lowResPattern.test(url.pathname)) {
      url.pathname = url.pathname.replace(lowResPattern, `_${targetSize}$2`);
      // Remove name param to avoid mismatched variants causing 404
      url.searchParams.delete('name');
      return url.toString();
    }

    // If already has a size suffix, replace it with target size
    if (sizePattern.test(url.pathname)) {
      url.pathname = url.pathname.replace(sizePattern, `_${targetSize}$2`);
      url.searchParams.delete('name');
      return url.toString();
    }

    // No recognizable size suffix; append size suffix before file extension
    // Extract file extension
    const extMatch = url.pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (extMatch) {
      const ext = extMatch[0];
      url.pathname = url.pathname.replace(ext, `_${targetSize}${ext}`);
    } else {
      // Fallback: use query param if no extension found
      url.searchParams.set('name', targetSize);
    }

    return url.toString();
  } catch {
    return avatarUrl;
  }
}

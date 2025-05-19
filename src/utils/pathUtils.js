/**
 * 获取资源的公共路径
 * 在开发环境和生产环境中都能正确处理资源路径
 * @param {string} path - 资源路径
 * @returns {string} - 处理后的路径
 */
export const getPublicPath = (path) => {
  // 移除开头的斜杠，确保路径格式一致
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 在开发环境中，使用相对路径
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // 在生产环境中，使用基于 base 的路径
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};
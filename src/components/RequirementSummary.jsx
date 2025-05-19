import React, { useState, useEffect } from 'react';
import { generateSummary } from '../services/aiService';

const RequirementSummary = ({ prdContent, onReset, cachedResult }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conciseSummary, setConciseSummary] = useState('');

  useEffect(() => {
    // 如果有缓存的结果，直接使用
    if (cachedResult) {
      console.log('使用缓存的需求摘要结果');
      setSummary(cachedResult);

      // 提取简洁摘要（第一段或第一句话）
      const firstParagraph = cachedResult.split('\n\n')[0];
      if (firstParagraph) {
        // 移除Markdown标记
        const cleanParagraph = firstParagraph.replace(/^#+\s+.+\n/, '').trim();
        setConciseSummary(cleanParagraph);
      }
      return;
    }

    // 如果有PRD内容但没有缓存结果，则自动生成摘要
    if (prdContent) {
      generateRequirementSummary();
    }
  }, [prdContent, cachedResult]);

  const generateRequirementSummary = async () => {
    if (!prdContent) {
      setError('请先输入PRD内容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generateSummary(prdContent);
      setSummary(result);

      // 提取简洁摘要（第一段或第一句话）
      const firstParagraph = result.split('\n\n')[0];
      if (firstParagraph) {
        // 移除Markdown标记
        const cleanParagraph = firstParagraph.replace(/^#+\s+.+\n/, '').trim();
        setConciseSummary(cleanParagraph);
      }
    } catch (error) {
      console.error('生成需求摘要错误:', error);
      setError(error.message || '生成需求摘要失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white">正在生成需求摘要，请稍候...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={generateRequirementSummary}
          className="px-4 py-2 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[10px] hover:opacity-90 transition-opacity"
        >
          重试
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-white mb-4">尚未生成需求摘要</p>
        <button
          onClick={generateRequirementSummary}
          className="px-4 py-2 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[10px] hover:opacity-90 transition-opacity"
        >
          开始生成
        </button>
      </div>
    );
  }

  // 将摘要内容按段落分割
  const paragraphs = summary.split('\n\n').filter(p => p.trim());

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6 text-white text-center">需求摘要</h2>

      {/* Linear风格的简洁摘要卡片 */}
      {conciseSummary && (
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-[15px] shadow-lg p-5 mb-6">
          <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">一句话摘要</h3>
          <p className="text-white text-base font-medium leading-relaxed">{conciseSummary}</p>
        </div>
      )}

      {/* Linear风格的详细摘要内容 */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-[15px] shadow-lg overflow-hidden">
        <div className="p-5 space-y-4">
          <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">详细摘要</h3>
          {paragraphs.map((paragraph, index) => {
            // 检查是否是标题行
            if (paragraph.startsWith('#')) {
              const level = paragraph.match(/^#+/)[0].length;
              const title = paragraph.replace(/^#+\s+/, '');

              if (level === 1) {
                return <h3 key={index} className="text-lg font-semibold text-white mt-6 mb-3">{title}</h3>;
              } else if (level === 2) {
                return <h4 key={index} className="text-base font-medium text-white mt-4 mb-2">{title}</h4>;
              } else {
                return <h5 key={index} className="text-xs font-medium text-white/70 uppercase tracking-wider mt-3 mb-2">{title}</h5>;
              }
            }

            // 检查是否是编号列表
            if (/^\d+\./.test(paragraph)) {
              const items = paragraph.split('\n').filter(item => item.trim());
              if (items.length === 1) {
                // 单个编号项不再作为小标题，而是作为正文显示
                return <p key={index} className="text-white/80 text-sm leading-relaxed hover:text-white/90 transition-colors">{paragraph}</p>;
              }
            }

            // 检查是否是列表项
            if (paragraph.includes('\n')) {
              const listItems = paragraph.split('\n').filter(item => item.trim());

              // 检查是否是编号列表
              const isNumberedList = listItems.every(item => /^\d+\./.test(item.trim()));

              if (isNumberedList) {
                return (
                  <div key={index} className="space-y-2 mt-2 pl-1">
                    {listItems.map((item, i) => {
                      const number = item.match(/^\d+/)[0];
                      const text = item.replace(/^\d+\.\s*/, '');
                      return (
                        <div key={i} className="flex items-start group">
                          <span className="text-white/40 text-xs font-medium mr-2.5 mt-0.5 w-4 text-right flex-shrink-0">{number}.</span>
                          <span className="text-white/90 text-sm group-hover:text-white transition-colors">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // 普通列表 (Linear风格的点状列表)
              return (
                <div key={index} className="space-y-2 mt-2 pl-1">
                  {listItems.map((item, i) => (
                    <div key={i} className="flex items-start group">
                      <span className="text-white/40 mr-2.5 mt-1 flex-shrink-0">•</span>
                      <span className="text-white/90 text-sm group-hover:text-white transition-colors">{item.replace(/^[•\-*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              );
            }

            // 普通段落 (Linear风格的段落)
            return <p key={index} className="text-white/80 text-sm leading-relaxed hover:text-white/90 transition-colors">{paragraph}</p>;
          })}
        </div>

        {/* Linear风格的底部分隔线和按钮区域 */}
        <div className="border-t border-white/10 p-4 bg-white/[0.03]">
          <div className="flex justify-center">
            <button
          onClick={generateRequirementSummary}
              className="px-3 py-1.5 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white text-sm rounded-[8px] hover:opacity-90 transition-opacity mr-3"
        >
          重新生成
        </button>
        <button
          onClick={onReset}
              className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-[8px] hover:bg-white/15 transition-colors"
        >
          重新上传
        </button>
      </div>
    </div>
      </div>
    </div>
  );
};

export default RequirementSummary;

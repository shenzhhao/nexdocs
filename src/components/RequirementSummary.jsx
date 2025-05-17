import React, { useState, useEffect } from 'react';
import { generateSummary } from '../services/aiService';

const RequirementSummary = ({ prdContent, onReset }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conciseSummary, setConciseSummary] = useState('');

  useEffect(() => {
    // 如果有PRD内容，则自动生成摘要
    if (prdContent) {
      generateRequirementSummary();
    }
  }, [prdContent]);

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
      <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">正在生成需求摘要，请稍候...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={generateRequirementSummary}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
        <p className="text-gray-400 mb-4">尚未生成需求摘要</p>
        <button
          onClick={generateRequirementSummary}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          开始生成
        </button>
      </div>
    );
  }

  // 将摘要内容按段落分割
  const paragraphs = summary.split('\n\n').filter(p => p.trim());

  return (
    <div className="container mx-auto p-6 bg-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">需求摘要</h2>

      {/* 简洁摘要卡片 */}
      {conciseSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">一句话摘要</h3>
          <p className="text-gray-700 text-lg">{conciseSummary}</p>
        </div>
      )}

      {/* 详细摘要内容 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="prose max-w-none">
          {paragraphs.map((paragraph, index) => {
            // 检查是否是标题行
            if (paragraph.startsWith('#')) {
              const level = paragraph.match(/^#+/)[0].length;
              const title = paragraph.replace(/^#+\s+/, '');
              const titleClass = level === 1 ? 'text-2xl font-bold mt-6 mb-4' :
                                level === 2 ? 'text-xl font-semibold mt-5 mb-3' :
                                'text-lg font-medium mt-4 mb-2';
              return <h3 key={index} className={titleClass}>{title}</h3>;
            }

            // 检查是否是编号列表
            if (/^\d+\./.test(paragraph)) {
              return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph}</h3>;
            }

            // 检查是否是列表项
            if (paragraph.includes('\n')) {
              const listItems = paragraph.split('\n').filter(item => item.trim());

              // 检查是否是编号列表
              const isNumberedList = listItems.every(item => /^\d+\./.test(item.trim()));

              if (isNumberedList) {
                return (
                  <ol key={index} className="list-decimal pl-5 mt-2 mb-4">
                    {listItems.map((item, i) => (
                      <li key={i} className="mb-2">{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }

              // 普通列表
              return (
                <ul key={index} className="list-disc pl-5 mt-2 mb-4">
                  {listItems.map((item, i) => (
                    <li key={i} className="mb-2">{item.replace(/^[•\-*]\s*/, '')}</li>
                  ))}
                </ul>
              );
            }

            // 普通段落
            return <p key={index} className="mb-4 text-gray-700">{paragraph}</p>;
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={generateRequirementSummary}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
        >
          重新生成
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          重新上传
        </button>
      </div>
    </div>
  );
};

export default RequirementSummary;

import React, { useState, useEffect } from 'react';
import { analyzePRD, isApiKeySet } from '../services/aiService';
import SpotlightCard from './ui/SpotlightCard';

const UECModel = ({ prdContent, onReset, cachedResult }) => {
  const [uecData, setUecData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 如果有缓存的结果，直接使用
    if (cachedResult) {
      console.log('使用缓存的UEC模型分析结果');
      setUecData(cachedResult);
      return;
    }

    // 如果有PRD内容但没有缓存结果，则进行分析
    if (prdContent) {
      analyzeContent();
    }
  }, [prdContent, cachedResult]);

  const analyzeContent = async () => {
    if (!prdContent) {
      setError('请先输入PRD内容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await analyzePRD(prdContent);
      setUecData(result);
    } catch (error) {
      console.error('分析PRD错误:', error);
      setError(error.message || '分析PRD失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white">正在分析PRD，请稍候...</p>
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
          onClick={analyzeContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (!uecData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-white mb-4">尚未分析PRD</p>
        <button
          onClick={analyzeContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          开始分析
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-2 text-left">UEC模型分析结果</h2>
        <p className="text-[18px] font-['PingFang_SC'] text-white mb-6 text-left">UEC模型帮助团队从用户(User)、事件(Event)和目标(Goal)三个维度理解需求,确保团队对需求有全面的认识。</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 用户 */}
          <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.3)" className="backdrop-blur-lg bg-white/40 p-0">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">用户 (User)</h3>
              {uecData.user && uecData.user.length > 0 ? (
                <ul className="space-y-[5px]">
                  {uecData.user.map((item, index) => (
                  <li key={index} className="border-b border-opacity-30 border-b-[0.5px] pb-3">
                      <h4 className="font-medium text-white text-[15px]">{item.name}</h4>
                      <p className="text-white mt-1 text-[10px]">{item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-white text-[10px]">未找到用户信息</p>
            )}
          </div>
          </SpotlightCard>

          {/* 事件 */}
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.3)" className="backdrop-blur-lg bg-white/40 p-0">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-600">事件 (Event)</h3>
              {uecData.event && uecData.event.length > 0 ? (
                <ul className="space-y-[5px]">
                  {uecData.event.map((item, index) => (
                  <li key={index} className="border-b border-opacity-30 border-b-[0.5px] pb-3">
                      <h4 className="font-medium text-white text-[15px]">{item.name}</h4>
                      <p className="text-white mt-1 text-[10px]">{item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-white text-[10px]">未找到事件信息</p>
            )}
          </div>
          </SpotlightCard>

          {/* 目标 */}
          <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.3)" className="backdrop-blur-lg bg-white/40 p-0">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">目标 (Goal)</h3>
              {uecData.goal && uecData.goal.length > 0 ? (
                <ul className="space-y-[5px]">
                  {uecData.goal.map((item, index) => (
                    <li key={index} className="border-b border-opacity-30 border-b-[0.5px] pb-3">
                      <h4 className="font-medium text-white text-[15px]">{item.name}</h4>
                      <p className="text-white mt-1 text-[10px]">{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white text-[10px]">未找到目标信息</p>
              )}
        </div>
          </SpotlightCard>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={analyzeContent}
            className="px-4 py-2 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[10px] hover:opacity-90 transition-opacity mr-4"
          >
            重新分析
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-[10px] hover:bg-gray-700"
          >
            重新上传
          </button>
    </div>
      </div>
    </div>
  );
};

export default UECModel;

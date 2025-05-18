import React, { useState, useEffect } from 'react';

const FlowChart = ({ prdContent, onReset, cachedResult }) => {
  const [loading, setLoading] = useState(false);
  const [flowChartData, setFlowChartData] = useState(null);
  const [error, setError] = useState(null);

  // 添加生成流程图的函数
  const generateFlowChart = () => {
    if (!prdContent) {
      setError('请先输入PRD内容');
      return;
    }

    setLoading(true);
    setError(null);

    // 模拟API调用延迟
    setTimeout(() => {
      try {
        // 生成简单的流程图数据
        const flowData = {
          title: '设计团队执行流程图',
          steps: [
            { id: 1, text: '需求分析与理解' },
            { id: 2, text: '设计方案制定' },
            { id: 3, text: '方案评审与调整' },
            { id: 4, text: '开发实现' },
            { id: 5, text: '测试与验证' },
            { id: 6, text: '交付与部署' }
          ]
        };

        setFlowChartData(flowData);
      } catch (err) {
        console.error('生成流程图错误:', err);
        setError(err.message || '生成流程图失败');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  useEffect(() => {
    // 如果有缓存的结果，直接使用
    if (cachedResult) {
      console.log('使用缓存的流程图分析结果');
      // 将缓存的步骤转换为流程图数据格式
      const flowData = {
        title: '设计团队执行流程图',
        steps: cachedResult.steps.map((text, index) => ({
          id: index + 1,
          text: text
        }))
      };
      setFlowChartData(flowData);
      return;
    }

    // 如果有PRD内容但没有缓存结果，则生成流程图
    if (prdContent) {
      generateFlowChart();
    }
  }, [prdContent, cachedResult]);

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
        <p className="text-white text-sm">正在分析PRD并生成流程图，请稍候...</p>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          <p>{error}</p>
        </div>
        <button
          onClick={generateFlowChart}
          className="px-3 py-1 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[8px] hover:opacity-90 transition-opacity text-xs"
        >
          重试
        </button>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!flowChartData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-white mb-3 text-sm">尚未生成流程图</p>
        <button
          onClick={generateFlowChart}
          className="px-3 py-1 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[8px] hover:opacity-90 transition-opacity text-xs"
        >
          开始生成
        </button>
      </div>
    );
  }

  // 渲染流程图
  return (
    <div className="container mx-auto p-5">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">{flowChartData.title}</h2>
        <p className="text-[18px] font-['PingFang_SC'] text-white mb-5 text-center">流程图展示了设计团队从需求分析到最终交付的完整执行流程，帮助团队明确各阶段工作重点。</p>

      {/* 流程图内容 */}
        <div className="rounded-lg p-4 mb-4">
        <div className="flex flex-col items-center">
            {/* 新的流程图样式 */}
            <div className="relative w-full max-w-3xl">
              {/* 垂直时间线 */}
              <div className="absolute left-[21px] top-[30px] bottom-[30px] w-[2px] bg-white/30"></div>

              {/* 步骤列表 */}
              <div className="space-y-3">
                {flowChartData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    {/* 左侧圆点 */}
                    <div className="relative z-10 mr-3.5">
                      <div
                        className="flex items-center justify-center w-[42px] h-[42px] rounded-full backdrop-blur-lg bg-white/10 border border-white/30 shadow-lg"
                        style={{ backdropFilter: 'blur(12px)' }}
        >
                        <div className="text-center text-white">
                          <div className="text-[7px] font-medium">STEP</div>
                          <div className="text-sm font-bold">{String(step.id).padStart(2, '0')}</div>
      </div>
    </div>
    </div>

                    {/* 右侧内容框 */}
                    <div
                      className="flex-1 p-3 rounded-[18px] text-white shadow-lg backdrop-blur-lg bg-white/10 border border-white/30"
                      style={{ backdropFilter: 'blur(12px)' }}
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold mb-0.5">执行步骤</h3>
                          <p className="text-xs leading-relaxed">{step.text}</p>
                        </div>
                        <div className="ml-2.5">
                          {index === 0 && (
                            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                          )}
                          {index === 1 && (
                            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                          )}
                          {index === 2 && (
                            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                            </svg>
                          )}
                          {index === 3 && (
                            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.09l-4.24-4.24 1.41-1.41 2.83 2.83 6.59-6.59 1.41 1.41-8 8z"/>
                            </svg>
                          )}
                          {index >= 4 && (
                            <svg className="w-7 h-7 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={generateFlowChart}
          className="px-3.5 py-1.5 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[8px] hover:opacity-90 transition-opacity mr-3.5 text-sm"
        >
          重新生成
        </button>
        <button
          onClick={onReset}
          className="px-3.5 py-1.5 bg-gray-600 text-white rounded-[8px] hover:bg-gray-700 text-sm"
        >
          重新上传
        </button>
      </div>
    </div>
  );
};

export default FlowChart;
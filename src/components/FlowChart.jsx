import React, { useState, useEffect } from 'react';

const FlowChart = ({ prdContent, onReset }) => {
  const [loading, setLoading] = useState(false);
  const [flowChartData, setFlowChartData] = useState(null);

  useEffect(() => {
    if (prdContent) {
      setLoading(true);
      
      // 模拟API调用延迟
      setTimeout(() => {
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
        setLoading(false);
      }, 1500);
    }
  }, [prdContent]);

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">正在生成流程图，请稍候...</p>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!flowChartData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
        <p className="text-gray-400 mb-4">尚未生成流程图</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          开始生成
        </button>
      </div>
    );
  }

  // 渲染流程图
  return (
    <div className="container mx-auto p-6 bg-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">{flowChartData.title}</h2>
      
      {/* 流程图内容 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          {/* 简单的流程图表示 */}
          <div className="flex flex-col items-center w-full max-w-2xl">
            {flowChartData.steps.map((step, index) => (
              <div key={step.id} className="w-full">
                {/* 步骤框 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-2">
                  <p className="font-medium text-blue-800">{step.text}</p>
                </div>
                
                {/* 连接箭头 (除了最后一个步骤) */}
                {index < flowChartData.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m-7-7l7 7 7-7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => window.location.reload()}
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

export default FlowChart;
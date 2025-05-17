import React, { useState, useEffect } from 'react';
import UECModel from './components/UECModel';
import FlowChart from './components/FlowChart';
import RequirementSummary from './components/RequirementSummary';
import CollaborationPage from './components/CollaborationPage';
import ModelSelector from './components/ModelSelector';
import { setApiKey, setAppId, setCurrentModel } from './services/aiService';
import './styles/gradientAnimation.css';
import './styles/flowingBorder.css'; // 引入新的流动边框样式

const Index = ({ onBack }) => {
  // 状态定义部分保持不变
  const [activeTab, setActiveTab] = useState('uec');
  const [prdContent, setPrdContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('KIMI-R1.5');
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [historyDialogs, setHistoryDialogs] = useState([]);
  const [currentDialogId, setCurrentDialogId] = useState(null);

  // 其他代码保持不变...

  // 这里是修复后的输入框部分
  const renderInputArea = () => {
    return (
      <div className="relative">
        {/* 使用新的流动渐变边框 */}
        <div className="w-[550px] relative flowing-gradient-border">
          <div
            className="w-full h-full rounded-[14px] relative overflow-hidden transition-all duration-300 input-container"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            {/* 输入框区域 */}
            <div className="relative" style={{ height: isInputHovered || inputValue.trim() !== '' ? "110px" : "40px" }}>
              <textarea
                className={"w-full bg-transparent rounded-[14px] focus:outline-none font-['PingFang_SC'] resize-none border-0 text-[13px] text-white transition-all duration-300 " + (
                  isInputHovered || inputValue.trim() !== ''
                    ? 'pt-[9px] px-[10px]'
                    : 'py-[9px] px-[10px]'
                )}
                placeholder="你可以在这里输入任何你想解析的prd..."
                value={inputValue}
                onChange={handleInputChange}
                style={{
                  height: "80px",
                  maxHeight: "80px",
                  overflow: "auto"
                }}
              ></textarea>
            </div>

            {/* 按钮区域 */}
            <div className={"absolute bottom-[9px] left-[10px] right-[10px] flex justify-between items-center transition-all duration-300 bg-transparent " + (
              isInputHovered || inputValue.trim() !== '' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}>
              {/* 使用ModelSelector组件 */}
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />

              <div className="flex items-center space-x-2">
                {/* 设置按钮 */}
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="h-[20px] flex items-center px-2 py-0 bg-gray-700 text-white text-xs rounded-[8px] hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 14 14" fill="none">
                    <path d="M7 14A7 7 0 107 0a7 7 0 000 14zM7 4v4M7 10v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  设置
                </button>
                
                {/* 发送按钮 */}
                <button
                  onClick={handleSubmit}
                  className="h-[20px] flex items-center px-3 py-0 bg-[#3301FF] text-white text-xs rounded-[8px] hover:bg-opacity-90"
                  disabled={!inputValue.trim()}
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 其他代码保持不变...

  // 在这里使用renderInputArea函数
  return (
    <div className="flex h-screen bg-black text-white">
      {/* 侧边栏 */}
      <div className="w-[250px] bg-black border-r border-gray-800 flex flex-col">
        {/* 侧边栏内容保持不变 */}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          {prdContent ? (
            renderContent()
          ) : (
            <div className="w-full max-w-3xl flex flex-col">
              <div className="w-[600px]">
                <div className="mb-[15px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-medium text-white font-['MeiTuan_Type']">你好，PRD请尽管扔给我</h2>
                    <button
                      onClick={importSamplePrd}
                      className="text-[15px] px-[10px] py-[2px] bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white rounded-[10px] hover:opacity-90 transition-opacity"
                      style={{ marginRight: '50px' }}
                    >
                      演示示例PRD
                    </button>
                  </div>
                </div>
                
                {renderInputArea()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;

import React, { useState, useEffect } from 'react';
import UECModel from './components/UECModel';
import FlowChart from './components/FlowChart';
import RequirementSummary from './components/RequirementSummary';
import CollaborationPage from './components/CollaborationPage';
import ModelSelector from './components/ModelSelector';
import ApiKeyModal from './components/ApiKeyModal';
import GradientInput from './components/GradientInput';
import PurpleGlow from './components/PurpleGlow';
import Aurora from './components/Aurora'; // 导入Aurora组件
import { isApiKeySet, setApiKey, setAppId } from './services/aiService';
import './styles/gradientAnimation.css'; // 引入动画样式
import './styles/flowingBorder.css'; // 引入流动边框样式
import './styles/inputBorder.css'; // 引入输入框边框样式
import './styles/background.css'; // 引入背景样式

const Index = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('uec');
  const [prdContent, setPrdContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('KIMI-R1.5');
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  // 添加历史对话状态
  const [historyDialogs, setHistoryDialogs] = useState([]);
  const [currentDialogId, setCurrentDialogId] = useState(null);

  // 添加缓存结果状态
  const [cachedResults, setCachedResults] = useState({
    uec: null,
    flowChart: null,
    summary: null
  });

  // 添加旋转动画样式
  const rotateAnimationStyle = `
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  // 添加调试日志
  useEffect(() => {
    console.log('当前活动选项卡:', activeTab);
  }, [activeTab]);

  // 检查API密钥是否已设置并设置美团大模型appId
  useEffect(() => {
    // 从localStorage获取API密钥
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      try {
        const success = setApiKey(savedApiKey);
        console.log('从localStorage加载API密钥:', success ? '成功' : '失败');
      } catch (error) {
        console.error('加载API密钥错误:', error);
      }
    }

    // 设置美团大模型的appId
    const mtAppId = '21909895884368891908';
    try {
      setAppId(mtAppId);
      console.log('美团大模型appId已设置:', mtAppId);
    } catch (error) {
      console.error('设置美团大模型appId错误:', error);
    }

    // 从localStorage加载历史对话
    try {
      const savedHistory = localStorage.getItem('historyDialogs');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistoryDialogs(parsedHistory);
        console.log('从localStorage加载历史对话:', parsedHistory.length, '条记录');
      }
    } catch (error) {
      console.error('加载历史对话错误:', error);
    }
  }, []);

  // 保存历史对话到localStorage
  useEffect(() => {
    if (historyDialogs.length > 0) {
      localStorage.setItem('historyDialogs', JSON.stringify(historyDialogs));
      console.log('历史对话已保存到localStorage:', historyDialogs.length, '条记录');
    }
  }, [historyDialogs]);

  // 处理PRD内容导入
  const handlePrdImport = (content) => {
    setPrdContent(content);
    console.log('PRD内容已导入:', content.substring(0, 50) + '...');
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理提交
  const handleSubmit = () => {
    if (inputValue.trim()) {
      handlePrdImport(inputValue);
      setInputValue('');
    }
  };

  // 处理模型选择
  const handleModelSelect = (model) => {
    console.log('选择模型:', model);
    setSelectedModel(model);
  };

  // 模拟导入示例PRD
  const importSamplePrd = () => {
    const samplePrd = `需求解读器插件是一款能够将复杂的需求文档（如 PRD）转化为易于理解和高效沟通的视觉化内容（如 UEC 模型、流程图等）的工具。该插件可以集成到浏览器中，帮助产品、设计和开发人员快速理解需求，减少沟通成本，确保团队对需求的高度对齐。

核心功能包括：
1. PRD 转 UEC 模型
2. 自动生成简洁描述与流程图
3. 浏览器插件集成
4. 团队协作与反馈`;
    handlePrdImport(samplePrd);
  };

  // 创建新对话
  const createNewDialog = () => {
    // 清空当前内容
    setPrdContent('');
    setInputValue('');
    setCurrentDialogId(null);
    setActiveTab('uec');
    console.log('创建新对话');
  };

  // 加载历史对话
  const loadHistoryDialog = (dialogId) => {
    const dialog = historyDialogs.find(d => d.id === dialogId);
    if (dialog) {
      setPrdContent(dialog.content);
      setCurrentDialogId(dialogId);
      setActiveTab('uec');
      console.log('加载历史对话:', dialogId);
    }
  };

  // 处理API密钥模态框关闭
  const handleApiKeyModalClose = () => {
    setShowApiKeyModal(false);
    console.log('API密钥模态框已关闭');
  };

  // 渲染当前活动的内容区域
  const renderContent = () => {
    console.log('渲染内容区域:', activeTab);

    switch (activeTab) {
      case 'uec':
        return <UECModel prdContent={prdContent} onReset={createNewDialog} cachedResult={cachedResults.uec} />;
      case 'flow':
        return <FlowChart prdContent={prdContent} onReset={createNewDialog} />;
      case 'summary':
        return <RequirementSummary prdContent={prdContent} onReset={createNewDialog} cachedResult={cachedResults.summary} />;
      case 'collaborate':
        return <CollaborationPage prdContent={prdContent} onReset={createNewDialog} />;
      default:
        return <UECModel prdContent={prdContent} onReset={createNewDialog} cachedResult={cachedResults.uec} />;
    }
  };

  return (
    <div className="flex h-screen relative overflow-hidden" style={{ backgroundColor: 'rgb(2, 0, 19)' }}>
      {/* 添加旋转动画样式 */}
      <style dangerouslySetInnerHTML={{ __html: rotateAnimationStyle }} />

      {/* 添加Aurora极光效果作为背景 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Aurora
          colorStops={["#0A0014", "#1E0A3C", "#4A1E96", "#7B38E0", "#A67DF2", "#E9DEFF"]}
          amplitude={1.2}
          blend={0.9}
          opacity={0.8}
        />
      </div>

      {/* 鼠标跟随的紫色弥散光效果 */}
      <PurpleGlow />

      {/* 侧边栏 */}
      <div className="w-60 sidebar flex flex-col relative z-10 ml-10 mt-5 mb-5 rounded-[10px] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg" style={{ backdropFilter: 'blur(20px)' }}>
        {/* 顶部标题 */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">logo</span>
            <h1 className="text-base font-medium text-white">NexDocs</h1>
          </div>
        </div>

        {/* 菜单项 */}
        <div className="flex-1 py-4 px-3 space-y-2">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 bg-[#3E1B70] rounded-[15px] hover:bg-[#3E1B70] hover:text-white"
            onClick={() => {
              console.log('点击新导入标签');
              createNewDialog();
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>新导入</span>
          </button>

          <button
            className={"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'flow' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击流程图标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('flow');
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>流程图</span>
          </button>

          <button
            className={"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'summary' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击简洁描述标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('summary');
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>简洁描述</span>
          </button>

          <button
            className={"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'collaborate' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击团队反馈标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('collaborate');
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 7H13M7 10H13M7 13H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>团队反馈</span>
          </button>

          {/* 历史对话 - 移动到团队反馈下方 */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-2 px-4">
              <span className="text-sm text-gray-300">历史对话</span>
              <button
                className="text-gray-500"
                onClick={createNewDialog}
                title="新建对话"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {historyDialogs.length > 0 ? (
                historyDialogs.map(dialog => (
                  <div
                    key={dialog.id}
                    className={"flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-lg cursor-pointer hover:bg-[#3E1B70] hover:text-white " + (currentDialogId === dialog.id ? 'bg-gray-800' : '')}
                    onClick={() => loadHistoryDialog(dialog.id)}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M3 14V2C3 1.44772 3.44772 1 4 1H12C12.5523 1 13 1.44772 13 2V14L8 11L3 14Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span className="truncate">{dialog.title}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 text-sm text-gray-500 italic">
                  暂无历史对话
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 返回首页按钮 */}
        <div className="px-4 py-3 border-t border-gray-800">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M10 16L4 10L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>返回首页</span>
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col relative z-10 main-content">
        <main className="flex-1 flex flex-col items-center justify-center p-6 h-full">
          {prdContent ? (
            renderContent()
          ) : (
            <div className="w-full max-w-3xl flex flex-col items-center justify-center h-full">
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

                <div className="relative">
                  <GradientInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isHovered={isInputHovered}
                    onMouseEnter={() => setIsInputHovered(true)}
                    onMouseLeave={() => setIsInputHovered(false)}
                    selectedModel={selectedModel}
                    onModelSelect={handleModelSelect}
                    onSettingsClick={() => setShowApiKeyModal(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* API密钥设置模态框 */}
      {showApiKeyModal && <ApiKeyModal isOpen={showApiKeyModal} onClose={handleApiKeyModalClose} />}
    </div>
  );
};

export default Index;

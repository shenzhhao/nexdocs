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
import { getPublicPath } from './utils/pathUtils'; // 导入公共路径函数
import './styles/gradientAnimation.css'; // 引入动画样式
import './styles/flowingBorder.css'; // 引入流动边框样式
import './styles/inputBorder.css'; // 引入输入框边框样式
import './styles/background.css'; // 引入背景样式
import './styles/fonts.css'; // 引入字体样式

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

    // 创建新的历史对话记录
    const newDialog = {
      id: Date.now().toString(),
      title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
      content: content,
      timestamp: new Date().toISOString()
    };

    // 将新对话添加到历史记录中
    setHistoryDialogs(prev => [newDialog, ...prev]);

    // 设置当前对话ID
    setCurrentDialogId(newDialog.id);

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
    const samplePrd = `天气 APP PRD

一、产品概述

一款为用户提供实用、精准天气信息的 APP，涵盖日常所需的各类天气数据与服务。

二、用户需求

准确了解当前及未来几天本地天气情况，合理安排出行、活动。

清晰掌握温度、湿度、风力、空气质量等具体天气指标。

收到恶劣天气、灾害性天气的及时预警，保障人身安全。

希望界面简洁明了，操作便捷，快速获取关键信息。

三、核心功能

实时天气展示
1.1 首页醒目显示本地当前温度、天气状况（晴、雨、雪等），配有直观天气图标。同时呈现体感温度、湿度、风向风力、空气质量指数等详细数据。

天气预报
2.1 提供未来 7 天天气预报，每天以时段划分（早、中、晚），展示天气状况、温度范围，用户可横向滑动查看。

灾害天气预警
3.1 与气象部门数据对接，当有灾害性天气来临时，APP 立即推送预警消息，包括预警类型（暴雨、台风、暴雪等）、预警级别、影响范围及防御建议，以弹窗或通知栏消息形式提醒用户。

天气地图
4.1 集成地图功能，展示全国范围内降水、温度、气压等气象要素分布情况，用户可缩放地图、点击特定区域查看详细天气信息，便于了解周边城市天气。

个性化设置
5.1 用户可添加多个关注城市，设置温度单位（摄氏度 / 华氏度）、提醒铃声等，还可选择接收特定类型天气预警通知。

四、业务目标

打造精准、及时、便捷的天气信息平台，提升用户满意度，获取大量活跃用户，成为天气查询领域热门 APP。

五、技术要求

确保 APP 运行流畅，数据加载迅速，适配主流手机品牌及操作系统版本。

与权威气象数据提供方稳定连接，保障天气数据更新及时、准确。

六、进度安排

第一阶段 ：1 个月内，完成需求调研、竞品分析，确定 PRD 文档，规划 APP 整体架构与界面设计。

第二阶段 ：2 个月内，开发核心功能模块，进行内部灰度测试，修复发现的重大漏洞与问题。

第三阶段 ：1 个月内，产品上线，在各大应用商店推广，持续收集用户反馈，迭代优化功能与体验。`;
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
            <img
              src={getPublicPath('logo.svg')}
              alt="NexDocs Logo"
              className="w-8 h-8"
            />
            <h1 className="text-base font-medium text-white">NexDocs</h1>
          </div>
        </div>
        {/* 菜单项 */}
        <div className="flex-1 py-4 px-3 space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 bg-[#291151] rounded-[15px] hover:bg-[#291151] hover:text-white"
            onClick={() => {
              console.log('点击新导入标签');
              createNewDialog();
            }}
          >
            <img
              src={getPublicPath('icons/import-icon.svg')}
              alt="新导入"
              className="w-4 h-4 text-current"
            />
            <span>新导入</span>
          </button>
          <button
            className={"w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'flow' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击流程图标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('flow');
            }}
          >
            <img
              src={getPublicPath('icons/flowchart-icon.svg')}
              alt="流程图"
              className="w-4 h-4 text-current"
            />
            <span>流程图</span>
          </button>

          <button
            className={"w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'summary' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击简洁描述标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('summary');
            }}
          >
            <img
              src={getPublicPath('icons/summary-icon.svg')}
              alt="简洁描述"
              className="w-4 h-4 text-current"
            />
            <span>简洁描述</span>
          </button>

          <button
            className={"w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 rounded-[15px] hover:bg-[#3E1B70] hover:text-white " + (activeTab === 'collaborate' ? 'bg-[#3E1B70]' : '')}
            onClick={() => {
              console.log('点击团队反馈标签');
              if (!prdContent) {
                importSamplePrd();
              }
              setActiveTab('collaborate');
            }}
          >
            <img
              src={getPublicPath('icons/feedback-icon.svg')}
              alt="团队反馈"
              className="w-4 h-4 text-current"
            />
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
                    className={"flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-[15px] cursor-pointer hover:bg-[#291151] hover:text-white " + (currentDialogId === dialog.id ? 'bg-[#291151]' : '')}
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
                    <h2 className="text-3xl font-medium text-white meituan-font">你好，PRD请尽管扔给我</h2>
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

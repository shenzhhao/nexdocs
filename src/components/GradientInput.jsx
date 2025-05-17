import React from 'react';
import ModelSelector from './ModelSelector';
import '../styles/inputBorder.css';

const GradientInput = ({
  value,
  onChange,
  onSubmit,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  selectedModel,
  onModelSelect,
  onSettingsClick
}) => {
  // 定义关键帧动画
  const keyframesStyle = `
    @keyframes flowAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <div className="w-[550px] relative">
      {/* 添加关键帧动画 */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      {/* 渐变边框容器 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '40px',
        borderRadius: '15px',
        overflow: 'visible',
        zIndex: 0
      }}>
        {/* 渐变边框效果 */}
        <div style={{
          content: '""',
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          right: '-1px',
          bottom: '-1px',
          borderRadius: '15px',
          zIndex: -1,
          background: 'linear-gradient(90deg, #291151 0%, #3E1B70 25%, #5F26B4 50%, #8E4FE0 75%, #291151 100%)',
          backgroundSize: '400% 400%',
          animation: 'flowAnimation 8s linear infinite'
        }}></div>

        {/* 内部容器 */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          borderRadius: '15px',
          padding: '1px',
          zIndex: 1
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '14px',
            overflow: 'hidden'
          }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* 输入框区域 */}
            <div className="relative" style={{ height: isHovered || value.trim() !== '' ? "110px" : "40px" }}>
              <textarea
                className={"w-full bg-transparent rounded-[14px] focus:outline-none font-['PingFang_SC'] resize-none border-0 text-[13px] text-white transition-all duration-300 " + (
                  isHovered || value.trim() !== ''
                    ? 'pt-[9px] px-[10px]'
                    : 'py-[9px] px-[10px]'
                )}
                placeholder="你可以在这里输入任何你想解析的prd..."
                value={value}
                onChange={onChange}
                style={{
                  height: "80px", // 固定高度，限制为4行文字的高度
                  maxHeight: "80px",
                  overflow: "auto" // 允许内容超出时滚动
                }}
              ></textarea>
            </div>

            {/* 按钮区域 - 位于输入框下方，在hover或有内容时显示 */}
            <div className={"absolute bottom-[9px] left-[10px] right-[10px] flex justify-between items-center transition-all duration-300 bg-transparent " + (
              isHovered || value.trim() !== '' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}>
              {/* 使用ModelSelector组件 */}
              <div className="flex items-center gap-2" style={{
                backgroundColor: '#444444',
                borderRadius: '8px',
                padding: '2px 8px'
              }}>
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelSelect={onModelSelect}
                />
                <button
                  type="button"
                  className="h-[20px] flex items-center gap-1 px-2 py-0 text-xs text-black hover:text-gray-800"
                  onClick={onSettingsClick}
                  title="设置API密钥"
                >
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M7 14A7 7 0 107 0a7 7 0 000 14zM7 4v4M7 10v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* 发送按钮 */}
              <button
                className="h-[20px] flex items-center px-3 py-0 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white text-xs rounded-[8px] hover:opacity-90 transition-opacity"
                onClick={onSubmit}
                disabled={!value.trim()}
              >
                <span>发送</span>
                <svg className="w-3 h-3 ml-1" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientInput;

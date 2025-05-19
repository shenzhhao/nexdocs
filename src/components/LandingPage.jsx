import React from 'react';
import ShinyText from './ShinyText';
import '../styles/TitleEffect.css';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 视频背景 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* 纯黑色背景层（作为视频加载前的背景） */}
        <div className="absolute inset-0 bg-black"></div>

        {/* 视频层 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          您的浏览器不支持视频标签。
        </video>

        {/* 添加一个半透明遮罩，使内容更易于阅读 */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <img
          src="/logo.svg"
          alt="NexDocs Logo"
          className="w-20 h-20 mb-2"
        />
        <h1 className="reflect-title">NexDocs</h1>
        <p className="reflect-subtitle">
          将复杂的需求文档转化为易于理解和高效沟通的视觉化内容，帮助团队更好地理解和对齐需求
        </p>
        <div className="backdrop-blur-md bg-white/10 rounded-[10px] mt-4 hover:bg-white/20 transition-colors duration-300 border border-white/30" style={{ borderWidth: '0.5px' }}>
          <ShinyText
            text="立即体验"
            onClick={onEnter}
            speed={5}
            className="text-lg"
          />
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] flex items-center justify-center text-white/70 text-sm z-20">
        © 2025 设计部-基础研发平台设计中心-研发质效和信息安全产品设计组. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;

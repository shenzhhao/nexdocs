import React, { useEffect, useRef, useState } from 'react';
import ShinyText from './ShinyText';
import { getPublicPath } from '../utils/pathUtils'; // 导入公共路径函数
import '../styles/TitleEffect.css';

const LandingPage = ({ onEnter }) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // 处理视频加载和播放
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 视频加载错误处理
    const handleError = (e) => {
      console.error('视频加载错误:', e);
      setVideoError(true);
    };

    // 视频加载成功后尝试播放
    const handleCanPlay = () => {
      console.log('视频可以播放');
      setVideoLoaded(true);

      // 尝试播放视频
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('视频播放成功');
        }).catch(err => {
          console.error('视频播放失败:', err);
          // 如果自动播放失败，可能是浏览器策略限制
          setVideoError(true);
        });
      }
    };

    // 视频播放中断处理
    const handleStalled = () => {
      console.warn('视频播放中断');
      // 尝试重新加载视频
      videoElement.load();
    };

    // 视频播放结束处理
    const handleEnded = () => {
      console.log('视频播放结束，重新播放');
      videoElement.play().catch(err => {
        console.error('重新播放失败:', err);
        setVideoError(true);
      });
};

    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('stalled', handleStalled);
    videoElement.addEventListener('ended', handleEnded);

    // 如果5秒后视频仍未加载，显示静态背景
    const timeoutId = setTimeout(() => {
      if (!videoLoaded) {
        console.warn('视频加载超时，显示静态背景');
        setVideoError(true);
      }
    }, 5000);

    return () => {
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('stalled', handleStalled);
      videoElement.removeEventListener('ended', handleEnded);
      clearTimeout(timeoutId);
    };
  }, [videoLoaded]);

  // 视频URL
  const videoUrl = getPublicPath('videos/background.mp4');
  console.log('视频URL:', videoUrl);

  // 渐变背景样式
  const gradientBackground = {
    background: 'linear-gradient(135deg, #0A0014 0%, #1E0A3C 25%, #4A1E96 50%, #7B38E0 75%, #A67DF2 100%)',
    opacity: 0.7,
    animation: 'gradientMove 15s ease infinite'
  };

  // 添加动画样式
  const animationStyle = `
    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 添加动画样式 */}
      <style dangerouslySetInnerHTML={{ __html: animationStyle }} />

      {/* 视频背景 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* 纯黑色背景层（作为视频加载前的背景） */}
        <div className="absolute inset-0 bg-black"></div>

        {/* 视频层 */}
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={videoUrl} type="video/mp4" />
            您的浏览器不支持视频标签。
          </video>
        ) : (
          // 视频加载失败时显示渐变背景作为备用
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              ...gradientBackground,
              backgroundSize: '400% 400%'
            }}
          ></div>
        )}

        {/* 添加一个半透明遮罩，使内容更易于阅读 */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <img
          src={getPublicPath('logo.svg')}
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
        © 2025 设计部/基础研发平台设计中心/研发质效和信息安全产品设计组. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;

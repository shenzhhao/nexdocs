import React, { useState, useEffect } from 'react';

const PurpleGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  // 添加呼吸动画状态
  const [isBreathing, setIsBreathing] = useState(true);
  // 添加混合模式状态
  const [blendMode, setBlendMode] = useState('soft-light');

  // 定义可用的混合模式数组
  const blendModes = [
    'soft-light', 'lighten', 'screen', 'overlay', 'color-dodge',
    'color', 'hue', 'saturation', 'luminosity'
  ];

  // 切换混合模式的函数
  const cycleBlendMode = () => {
    const currentIndex = blendModes.indexOf(blendMode);
    const nextIndex = (currentIndex + 1) % blendModes.length;
    setBlendMode(blendModes[nextIndex]);
    console.log('当前混合模式:', blendModes[nextIndex]);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      // 鼠标移动时触发呼吸效果
      setIsBreathing(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // 添加键盘事件监听器，按空格键切换混合模式
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        cycleBlendMode();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown);

    // 确保组件挂载后立即显示效果
    setIsVisible(true);
    setIsBreathing(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blendMode]);

  // 定义呼吸动画样式
  const breathingAnimation = `
    @keyframes breathe {
      0% {
        transform: translate(-50%, -50%) scale(0.95);
        opacity: 0.4;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.05);
        opacity: 0.6;
      }
      100% {
        transform: translate(-50%, -50%) scale(0.95);
        opacity: 0.4;
      }
    }
  `;

  // 创建一个更加自然的径向渐变背景
  const gradientBackground = `
    radial-gradient(
      circle at center,
      rgba(95, 38, 180, 0.3) 0%,
      rgba(62, 27, 112, 0.25) 30%,
      rgba(41, 17, 81, 0.2) 60%,
      rgba(41, 17, 81, 0) 100%
    )
  `;

  const glowStyle = {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: gradientBackground,
    filter: 'blur(120px)',
    pointerEvents: 'none',
    zIndex: 1,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    mixBlendMode: blendMode,
    opacity: isVisible ? 0.6 : 0,
    transition: 'opacity 0.3s ease',
    animation: isBreathing ? 'breathe 4s ease-in-out infinite' : 'none',
  };

  // 添加一个内部更亮的光晕
  const innerGlowStyle = {
    position: 'fixed',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `radial-gradient(
      circle at center,
      rgba(120, 58, 220, 0.4) 0%,
      rgba(95, 38, 180, 0.2) 50%,
      rgba(95, 38, 180, 0) 100%
    )`,
    filter: 'blur(30px)',
    pointerEvents: 'none',
    zIndex: 2,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    mixBlendMode: 'screen',
    opacity: isVisible ? 0.7 : 0,
    transition: 'opacity 0.3s ease',
    animation: isBreathing ? 'breathe 3s ease-in-out infinite reverse' : 'none',
  };

  // 添加一个显示当前混合模式的小标签
  const labelStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    zIndex: 1000,
    pointerEvents: 'none',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: breathingAnimation }} />
      <div style={glowStyle} />
      <div style={innerGlowStyle} />
      <div style={labelStyle}>
        混合模式: {blendMode} | 按空格键切换
      </div>
    </>
  );
};

export default PurpleGlow;
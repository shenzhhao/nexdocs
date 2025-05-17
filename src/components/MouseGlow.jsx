import React, { useEffect, useRef, useState } from 'react';

const MouseGlow = ({ color = 'rgba(62, 27, 112, 0.3)', size = 300, blur = 100, fadeOutDuration = 1000 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      setIsMoving(true);

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 设置新的定时器，鼠标停止移动后开始淡出
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // 初始化时设置为可见
    setIsVisible(true);
    setIsMoving(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 9, // 增加z-index值，确保在Waves组件之上
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${mousePosition.x - size / 2}px`,
          top: `${mousePosition.y - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: color,
          filter: `blur(${blur}px)`,
          opacity: isVisible ? (isMoving ? 1 : 0) : 0, // 增加不透明度到最大
          transition: isMoving
            ? 'opacity 0.1s ease-in'
            : `opacity ${fadeOutDuration}ms ease-out`,
          mixBlendMode: 'screen', // 使用screen混合模式，在黑色背景上更加明显
        }}
      />
    </div>
  );
};

export default MouseGlow;
import React, { useEffect, useState, useRef } from 'react';
import './JellyCursor.css';

const JellyCursor = () => {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // 使用useRef存储实际位置和目标位置
  const actualPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    // 检查是否是触摸设备
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return; // 触摸设备不显示自定义鼠标

    // 显示自定义鼠标
    setVisible(true);

    // 鼠标移动事件处理
    const handleMouseMove = (e) => {
      // 更新目标位置
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    // 鼠标离开页面事件处理
    const handleMouseLeave = () => {
      setVisible(false);
    };

    // 鼠标进入页面事件处理
    const handleMouseEnter = () => {
      setVisible(true);
    };

    // 处理可点击元素的悬停效果
    const handleElementMouseEnter = () => {
      setIsHovering(true);
    };

    const handleElementMouseLeave = () => {
      setIsHovering(false);
    };

    // 添加事件监听器
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 为所有可点击元素添加悬停效果
    const clickableElements = document.querySelectorAll('a, button');
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementMouseEnter);
      element.addEventListener('mouseleave', handleElementMouseLeave);
    });

    // 弹性动画函数
    const animateCursor = () => {
      // 弹性系数 (0-1)，越小越有弹性
      const elasticity = 0.15;

      // 计算实际位置和目标位置之间的差值
      const dx = targetPosition.current.x - actualPosition.current.x;
      const dy = targetPosition.current.y - actualPosition.current.y;

      // 根据弹性系数更新实际位置
      actualPosition.current.x += dx * elasticity;
      actualPosition.current.y += dy * elasticity;

      // 更新状态以触发重新渲染
      setPosition({
        x: actualPosition.current.x,
        y: actualPosition.current.y
      });

      // 计算速度用于变形效果
      const speed = Math.sqrt(dx * dx + dy * dy);
      const scale = Math.min(speed / 100, 0.5);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      // 应用变形效果
      if (cursorRef.current && !isHovering) {
        cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${1 + scale}, ${1 - scale * 0.5})`;
      } else if (cursorRef.current && isHovering) {
        cursorRef.current.style.transform = `translate(-50%, -50%) scale(0.5)`;
      }

      // 继续动画循环
      animationFrameId.current = requestAnimationFrame(animateCursor);
    };

    // 启动动画
    animationFrameId.current = requestAnimationFrame(animateCursor);

    // 清理函数
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);

      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementMouseEnter);
        element.removeEventListener('mouseleave', handleElementMouseLeave);
      });

      // 取消动画
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHovering]);

  // 如果是触摸设备或鼠标不可见，则不渲染
  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  );
};

export default JellyCursor;

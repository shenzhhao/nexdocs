import React, { useEffect, useRef } from 'react';

const CanvasGlow = () => {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const isMoving = useRef(false);
  const opacity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let timeout;

    // 设置canvas尺寸为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 初始化
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isMoving.current = true;
      opacity.current = 0.8; // 设置最大不透明度

      // 清除之前的定时器
      if (timeout) {
        clearTimeout(timeout);
      }

      // 设置新的定时器，鼠标停止移动后开始淡出
      timeout = setTimeout(() => {
        isMoving.current = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 渲染函数
    const render = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 如果鼠标不在移动，逐渐降低不透明度
      if (!isMoving.current && opacity.current > 0) {
        opacity.current -= 0.01;
      }

      // 如果不透明度大于0，绘制光晕
      if (opacity.current > 0) {
        // 保存当前状态
        ctx.save();

        // 设置混合模式
        ctx.globalCompositeOperation = 'screen';

        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
          mousePosition.current.x,
          mousePosition.current.y,
          0,
          mousePosition.current.x,
          mousePosition.current.y,
          150 // 光晕大小为150px
        );

        // 设置渐变颜色，使用指定的过渡色
        gradient.addColorStop(0, `rgba(120, 58, 180, ${opacity.current * 0.6})`); // 减淡中心颜色
        gradient.addColorStop(0.3, `rgba(95, 38, 180, ${opacity.current * 0.5})`);
        gradient.addColorStop(0.6, `rgba(62, 27, 112, ${opacity.current * 0.3})`);
        gradient.addColorStop(0.8, `rgba(41, 17, 81, ${opacity.current * 0.2})`);
        gradient.addColorStop(1, 'rgba(41, 17, 81, 0)');

        // 绘制光晕
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePosition.current.x, mousePosition.current.y, 150, 0, Math.PI * 2);
        ctx.fill();

        // 恢复状态
        ctx.restore();
      }

      // 请求下一帧
      animationFrameId.current = requestAnimationFrame(render);
    };

    // 开始动画
    render();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeout) {
        clearTimeout(timeout);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5, // 确保在其他元素之上
      }}
    />
  );
};

export default CanvasGlow;
import React, { useEffect, useRef } from 'react';

const GlowingBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let blobs = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // 设置canvas尺寸
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createBlobs(); // 重新创建blobs
    };

    // 创建blobs
    const createBlobs = () => {
      blobs = [];
      // 创建5个固定位置的大型blob
      const positions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.2 },
        { x: canvas.width * 0.8, y: canvas.height * 0.2 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: canvas.width * 0.2, y: canvas.height * 0.8 },
        { x: canvas.width * 0.8, y: canvas.height * 0.8 }
      ];

      const colors = [
        '#291151', // 深紫色
        '#3E1B70', // 中紫色
        '#5F26B4'  // 亮紫色
      ];

      positions.forEach((pos, i) => {
        blobs.push({
          x: pos.x,
          y: pos.y,
          radius: 200 + Math.random() * 100,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2
        });
      });
    };

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // 动画函数
    const animate = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制深色背景
      ctx.fillStyle = 'rgb(2, 0, 19)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制每个blob
      blobs.forEach((blob, index) => {
        // 使blob轻微移动（呼吸效果）
        const time = Date.now() * 0.001;
        const breathe = Math.sin(time + blob.phase) * 20;
        const radius = blob.radius + breathe;

        // 绘制blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, radius
        );

        gradient.addColorStop(0, `${blob.color}40`); // 25% 透明度
        gradient.addColorStop(1, `${blob.color}00`); // 完全透明

        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // 绘制鼠标跟随的光晕
      const mouseGradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 150
      );

      mouseGradient.addColorStop(0, 'rgba(120, 58, 180, 0.4)');
      mouseGradient.addColorStop(0.3, 'rgba(95, 38, 180, 0.3)');
      mouseGradient.addColorStop(0.6, 'rgba(62, 27, 112, 0.2)');
      mouseGradient.addColorStop(1, 'rgba(41, 17, 81, 0)');

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
      ctx.fillStyle = mouseGradient;
      ctx.fill();

      // 继续动画循环
      animationFrameId = requestAnimationFrame(animate);
    };

    // 初始化
    resize();
    createBlobs();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
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
        zIndex: 0
      }}
    />
  );
};

export default GlowingBackground;
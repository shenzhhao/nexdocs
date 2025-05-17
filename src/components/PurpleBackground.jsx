import React, { useEffect, useRef } from 'react';

const PurpleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const blobsRef = useRef([]);

  // 紫色系列颜色
  const colors = [
    "#291151", // 深紫色
    "#3E1B70", // 中紫色
    "#5F26B4", // 亮紫色
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // 初始化
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 创建初始blob
    const createBlobs = () => {
      const blobs = [];
      for (let i = 0; i < 6; i++) {
        blobs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 150 + Math.random() * 200,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: 0.2 + Math.random() * 0.3
        });
      }
      return blobs;
    };
    
    blobsRef.current = createBlobs();
    
    // 动画函数
    const animate = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制背景
      ctx.fillStyle = 'rgb(2, 0, 19)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制每个blob
      blobsRef.current.forEach(blob => {
        // 更新位置
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // 边界检查
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;
        
        // 绘制blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        
        gradient.addColorStop(0, `${blob.color}${Math.floor(blob.alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${blob.color}00`);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
        zIndex: 0
      }}
    />
  );
};

export default PurpleBackground;
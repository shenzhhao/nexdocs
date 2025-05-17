import React, { useEffect, useRef } from "react";

const AuroraBackgroundWrapper = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const blursRef = useRef([]);
  const isInitializedRef = useRef(false);

  // 紫色系列颜色
  const colors = [
    "#291151", // 深紫色
    "#3E1B70", // 中紫色
    "#5F26B4", // 亮紫色
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    contextRef.current = context;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isInitializedRef.current) {
        initializeBlurs();
        isInitializedRef.current = true;
      }
    };

    const initializeBlurs = () => {
      const blurs = [];
      const numBlurs = 8; // 增加模糊点数量，使效果更明显

      for (let i = 0; i < numBlurs; i++) {
        blurs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 150 + Math.random() * 250, // 增加半径
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 0.1, // 减慢移动速度
            y: (Math.random() - 0.5) * 0.1,
          },
        });
      }

      blursRef.current = blurs;
    };

    const handlePointerMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    handleResize();

    const animate = () => {
      if (!contextRef.current) return;

      const ctx = contextRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 设置全局混合模式
      ctx.globalCompositeOperation = "screen";

      // 更新和绘制模糊点
      blursRef.current.forEach((blur, index) => {
        // 更新位置
        blur.x += blur.velocity.x;
        blur.y += blur.velocity.y;

        // 边界检查
        if (blur.x < -blur.radius) blur.x = canvas.width + blur.radius;
        if (blur.x > canvas.width + blur.radius) blur.x = -blur.radius;
        if (blur.y < -blur.radius) blur.y = canvas.height + blur.radius;
        if (blur.y > canvas.height + blur.radius) blur.y = -blur.radius;

        // 绘制模糊点
        const gradient = ctx.createRadialGradient(
          blur.x,
          blur.y,
          0,
          blur.x,
          blur.y,
          blur.radius
        );
        gradient.addColorStop(0, `${blur.color}30`); // 增加透明度
        gradient.addColorStop(0.5, `${blur.color}15`);
        gradient.addColorStop(1, `${blur.color}00`); // 完全透明

        ctx.beginPath();
        ctx.arc(blur.x, blur.y, blur.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // 添加一个跟随鼠标的模糊点
      const pointerBlur = {
        x: pointerRef.current.x,
        y: pointerRef.current.y,
        radius: 200,
      };

      const pointerGradient = ctx.createRadialGradient(
        pointerBlur.x,
        pointerBlur.y,
        0,
        pointerBlur.x,
        pointerBlur.y,
        pointerBlur.radius
      );
      pointerGradient.addColorStop(0, "#5F26B430"); // 亮紫色，更透明
      pointerGradient.addColorStop(0.5, "#5F26B415");
      pointerGradient.addColorStop(1, "#5F26B400"); // 完全透明

      ctx.beginPath();
      ctx.arc(pointerBlur.x, pointerBlur.y, pointerBlur.radius, 0, Math.PI * 2);
      ctx.fillStyle = pointerGradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 w-full h-full bg-[rgb(2,0,19)]" style={{ zIndex: 0 }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: "none",
          zIndex: 1 // 确保在背景之上，但在其他元素之下
        }}
      />
    </div>
  );
};

export default AuroraBackgroundWrapper;
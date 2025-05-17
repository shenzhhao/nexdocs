import React, { useEffect, useRef } from "react";

export const AuroraBackground = ({ children, className }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const gradientRef = useRef(null);
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
      const numBlurs = 5; // 减少模糊点数量，提高性能

      for (let i = 0; i < numBlurs; i++) {
        blurs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 100 + Math.random() * 200, // 随机半径
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 0.2, // 减慢移动速度
            y: (Math.random() - 0.5) * 0.2,
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
        gradient.addColorStop(0, `${blur.color}80`); // 50% 透明度
        gradient.addColorStop(1, `${blur.color}00`); // 完全透明

        ctx.beginPath();
        ctx.arc(blur.x, blur.y, blur.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = "screen"; // 使用screen混合模式
        ctx.fill();
      });

      // 添加一个跟随鼠标的模糊点
      const pointerBlur = {
        x: pointerRef.current.x,
        y: pointerRef.current.y,
        radius: 150,
      };

      const pointerGradient = ctx.createRadialGradient(
        pointerBlur.x,
        pointerBlur.y,
        0,
        pointerBlur.x,
        pointerBlur.y,
        pointerBlur.radius
      );
      pointerGradient.addColorStop(0, "#5F26B480"); // 亮紫色，50% 透明度
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
    <div className={`relative w-full h-full overflow-hidden ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: "none" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
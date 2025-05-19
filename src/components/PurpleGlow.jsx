import React, { useState, useEffect, useRef, memo } from 'react';

// 使用memo优化轨迹点渲染
const TrailPoint = memo(({ point, index, totalPoints, blendMode }) => {
  // 使用索引计算颜色和不透明度变化
  const baseColor = {
    r: 120,
    g: 58,
    b: 220
  };

  // 计算颜色变化 - 基于索引渐变颜色
  const indexRatio = index / totalPoints;
  const r = baseColor.r + point.colorOffset - (indexRatio * 20);
  const g = baseColor.g + Math.floor(point.colorOffset / 2);
  const b = baseColor.b + point.colorOffset + (indexRatio * 20);

  // 计算不透明度衰减 - 减小衰减速度，使轨迹更明显
  const opacityFactor = Math.pow(1 - (index / totalPoints), 0.7);

  // 计算大小衰减 - 使轨迹逐渐变小
  const sizeFactor = Math.pow(1 - (index / totalPoints), 0.4);

  return (
    <div
      style={{
        position: 'fixed',
        width: `${80 * point.size * sizeFactor}px`, // 减小轨迹点尺寸，并应用大小衰减
        height: `${80 * point.size * sizeFactor}px`, // 减小轨迹点尺寸，并应用大小衰减
        borderRadius: '50%',
        background: `radial-gradient(
          circle at center,
          rgba(${r}, ${g}, ${b}, ${0.25 * point.opacity}) 0%,
          rgba(${r-25}, ${g-20}, ${b-40}, ${0.2 * point.opacity}) 30%,
          rgba(${r-79}, ${g-41}, ${b-139}, ${0.15 * point.opacity}) 60%,
          rgba(41, 17, 81, 0) 100%
        )`,
        filter: `blur(${10 + index * 1}px)`, // 减小模糊半径，后面的点更模糊
        pointerEvents: 'none',
        zIndex: 1,
        left: `${point.x}px`,
        top: `${point.y}px`,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: index === 0 ? 'screen' : blendMode,
        opacity: point.opacity * opacityFactor,
        willChange: 'transform, opacity', // 提示浏览器优化这些属性的变化
      }}
    />
  );
});

const PurpleGlow = () => {
  // 使用ref存储轨迹点
  const trailPointsRef = useRef([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  // 添加混合模式状态
  const [blendMode, setBlendMode] = useState('screen'); // 改为screen以增强视觉效果
  // 减少轨迹点数量以提高性能
  const maxTrailPoints = 8; // 进一步减少轨迹点数量，提高性能
  // 添加上次更新时间戳，用于控制轨迹点添加频率
  const lastUpdateTimeRef = useRef(0);
  // 增加时间间隔以减少渲染负担
  const updateInterval = 30; // 增加间隔，减少渲染负担
  // 添加鼠标速度追踪
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  // 添加轨迹点的生命周期管理
  const trailLifespan = 300; // 减少轨迹点存活时间，使轨迹更加紧凑
  // 添加动画帧ID引用
  const animationFrameIdRef = useRef(null);
  // 强制重新渲染的状态
  const [forceUpdate, setForceUpdate] = useState(0);
  // 添加节流标志
  const throttleRef = useRef(false);

  // 定义可用的混合模式数组
  const blendModes = [
    'screen', 'lighten', 'soft-light', 'overlay', 'color-dodge',
    'color', 'hue', 'saturation', 'luminosity'
  ];

  // 切换混合模式的函数
  const cycleBlendMode = () => {
    const currentIndex = blendModes.indexOf(blendMode);
    const nextIndex = (currentIndex + 1) % blendModes.length;
    setBlendMode(blendModes[nextIndex]);
    console.log('当前混合模式:', blendModes[nextIndex]);
  };

  // 节流函数
  const throttle = (callback, delay) => {
    if (throttleRef.current) return;
    throttleRef.current = true;
    callback();
    setTimeout(() => {
      throttleRef.current = false;
    }, delay);
  };

  useEffect(() => {
    // 初始化位置引用
    prevPositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // 鼠标移动处理函数
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const newPosition = { x: e.clientX, y: e.clientY };

      // 设置当前位置 - 使用节流减少状态更新频率
      throttle(() => {
        setPosition(newPosition);
      }, 16);

      setIsVisible(true);

      // 计算鼠标移动速度
      const deltaTime = Math.max(16, currentTime - lastUpdateTimeRef.current);
      const dx = newPosition.x - prevPositionRef.current.x;
      const dy = newPosition.y - prevPositionRef.current.y;

      // 计算速度，但应用平滑因子以减少抖动
      const smoothFactor = 0.2; // 减小平滑因子，使轨迹更加平滑
      velocityRef.current = {
        x: velocityRef.current.x * (1 - smoothFactor) + (dx / deltaTime * 100) * smoothFactor,
        y: velocityRef.current.y * (1 - smoothFactor) + (dy / deltaTime * 100) * smoothFactor
      };

      // 计算速度大小
      const speed = Math.sqrt(
        Math.pow(velocityRef.current.x, 2) +
        Math.pow(velocityRef.current.y, 2)
      );

      // 控制轨迹点添加频率
      if (currentTime - lastUpdateTimeRef.current > updateInterval) {
        // 降低速度阈值，使轨迹更容易生成
        if (speed > 0.2) { // 提高速度阈值，减少低速时的轨迹点生成
          // 根据速度调整轨迹点大小和透明度
          const sizeMultiplier = Math.min(1.1, Math.max(0.7, speed / 80));
          const opacityMultiplier = Math.min(1.0, Math.max(0.6, speed / 60));

          // 添加新的轨迹点 - 减小基础大小
          const newPoint = {
            x: newPosition.x,
            y: newPosition.y,
            id: currentTime,
            createdAt: currentTime,
            opacity: 0.6 * opacityMultiplier, // 降低基础不透明度
            size: (Math.random() * 0.12 + 0.4) * sizeMultiplier, // 进一步减小基础大小
            // 存储平滑后的速度
            velocity: { ...velocityRef.current },
            // 简化颜色变化计算
            colorOffset: Math.floor(Math.random() * 25),
            // 存储速度大小，用于后续效果
            speed: speed
          };

          // 更新轨迹点数组，保持最大长度
          trailPointsRef.current = [
            newPoint,
            ...trailPointsRef.current.slice(0, maxTrailPoints - 1)
          ];

          // 强制更新组件，确保轨迹显示 - 使用节流减少更新频率
          throttle(() => {
            setForceUpdate(prev => prev + 1);
          }, 30);
        }

        prevPositionRef.current = newPosition;
        lastUpdateTimeRef.current = currentTime;
      }
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

    // 动画循环，用于更新轨迹点的透明度和位置
    const animateTrail = () => {
      const currentTime = Date.now();

      if (trailPointsRef.current.length > 0) {
        // 处理现有轨迹点
        const updatedPoints = trailPointsRef.current.map((point, index) => {
          // 计算存活时间比例
          const age = currentTime - point.createdAt;
          const lifeRatio = Math.max(0, 1 - age / trailLifespan);

          // 计算衰减因子 - 使轨迹更自然地消失
          const decayFactor = Math.pow(lifeRatio, 1.2); // 增加衰减速度

          // 根据索引计算拖尾效果
          const tailEffect = Math.max(0.3, 1 - index / (trailPointsRef.current.length * 0.8));

          // 计算新的位置，添加基于速度的偏移
          const speedFactor = Math.min(1, point.speed / 120);
          const newX = point.x + (point.velocity.x * 0.008 * lifeRatio * speedFactor); // 减小位移量
          const newY = point.y + (point.velocity.y * 0.008 * lifeRatio * speedFactor); // 减小位移量

          return {
            ...point,
            // 随时间减小透明度，使用非线性衰减
            opacity: point.opacity * decayFactor * tailEffect,
            // 更新位置
            x: newX,
            y: newY,
            // 随时间增大尺寸，创造扩散效果，但减小扩散幅度
            size: point.size * (1 + 0.15 * (1 - lifeRatio)) // 减小扩散幅度
          };
        }).filter(point => point.opacity > 0.08); // 提高透明度阈值，更早移除低透明度点

        // 更新轨迹点数组
        trailPointsRef.current = updatedPoints;

        // 每90ms强制更新一次组件，减少更新频率
        if (currentTime % 90 < 16) {
          setForceUpdate(prev => prev + 1);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animateTrail);
    };

    // 使用passive选项提高事件监听性能
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    // 启动动画循环
    animationFrameIdRef.current = requestAnimationFrame(animateTrail);

    // 确保组件挂载后立即显示效果
    setIsVisible(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [blendMode]);

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

  // 主光晕样式 - 减小尺寸
  const mainGlowStyle = {
    position: 'fixed',
    width: '45px', // 进一步减小主光晕尺寸
    height: '45px', // 进一步减小主光晕尺寸
    borderRadius: '50%',
    background: `radial-gradient(
      circle at center,
      rgba(120, 58, 220, 0.3) 0%,
      rgba(95, 38, 180, 0.2) 50%,
      rgba(95, 38, 180, 0) 100%
    )`,
    filter: 'blur(7px)', // 进一步减小模糊半径
    pointerEvents: 'none',
    zIndex: 2,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    mixBlendMode: 'screen',
    opacity: isVisible ? 0.6 : 0, // 降低主光晕透明度
    transition: 'opacity 0.3s ease',
  };

  // 使用memo优化渲染
  const trailPoints = trailPointsRef.current;
  const totalPoints = trailPoints.length;

  return (
    <>
      {/* 渲染轨迹点 - 使用memo组件优化性能 */}
      {trailPoints.map((point, index) => (
        <TrailPoint
          key={point.id}
          point={point}
          index={index}
          totalPoints={totalPoints}
          blendMode={blendMode}
        />
      ))}

      {/* 当前鼠标位置的主光晕 */}
      <div style={mainGlowStyle} />

      {/* 隐藏混合模式标签，减少渲染负担 */}
      {/*
      <div style={labelStyle}>
        混合模式: {blendMode} | 按空格键切换
      </div>
      */}
    </>
  );
};

export default PurpleGlow;
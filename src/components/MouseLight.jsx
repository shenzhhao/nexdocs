import React, { useState, useEffect, useRef } from 'react';

const MouseLight = ({ children, color = 'rgba(62, 27, 112, 0.3)', size = 400, blur = 100 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseEnter = () => {
      setIsMouseInside(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInside(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const lightStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: isMouseInside ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  const gradientStyle = {
    position: 'absolute',
    top: mousePosition.y - size / 2,
    left: mousePosition.x - size / 2,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, rgba(0, 0, 0, 0) 70%)`,
    filter: `blur(${blur}px)`,
    pointerEvents: 'none',
    zIndex: 1,
    transition: 'top 0.05s ease-out, left 0.05s ease-out',
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        overflow: 'hidden'
      }}
    >
      {children}
      <div style={lightStyle}>
        <div style={gradientStyle} />
      </div>
    </div>
  );
};

export default MouseLight;

import React, { useEffect, useState } from 'react';

const MouseFollowEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120, 58, 180, 0.4) 0%, rgba(95, 38, 180, 0.3) 30%, rgba(62, 27, 112, 0.2) 60%, rgba(41, 17, 81, 0) 100%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        filter: 'blur(20px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 5
      }}
    />
  );
};

export default MouseFollowEffect;
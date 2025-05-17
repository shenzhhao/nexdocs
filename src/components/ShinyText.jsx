import React from 'react';
import '../styles/ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '', onClick }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text-container ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      {/* 闪亮效果层 */}
      <span
        className={`shine-effect ${disabled ? 'disabled' : ''}`}
        style={{ animationDuration }}
      >
        {text}
      </span>
    </div>
  );
};

export default ShinyText;
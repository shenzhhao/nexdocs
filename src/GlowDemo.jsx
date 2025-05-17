import React from 'react';
import CanvasGlow from './components/CanvasGlow';

const GlowDemo = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden'
    }}>
      <CanvasGlow />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        鼠标跟随紫色弥散光效果演示
      </h1>

      <p style={{ fontSize: '1.2rem', maxWidth: '600px', textAlign: 'center' }}>
        在黑色背景上移动鼠标，观察紫色弥散光效果如何跟随鼠标移动。
      </p>
    </div>
  );
};

export default GlowDemo;
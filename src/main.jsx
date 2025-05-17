import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Index from './Index.jsx'
import LandingPage from './components/LandingPage.jsx'
import GlowDemo from './GlowDemo.jsx'
import './index.css'

const App = () => {
  const [showMainApp, setShowMainApp] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // 检查URL中是否有demo参数
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    if (demoParam === 'glow') {
      setShowDemo(true);
    }
  }, []);

  const handleEnter = () => {
    setShowMainApp(true);
  };

  const handleBack = () => {
    setShowMainApp(false);
  };

  // 如果URL中有demo=glow参数，显示演示页面
  if (showDemo) {
    return <GlowDemo />;
  }

  return (
    <>
      {showMainApp ? (
        <Index onBack={handleBack} />
      ) : (
        <LandingPage onEnter={handleEnter} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

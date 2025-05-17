import React, { useEffect, useState } from 'react';

// 简化版的motion组件，模拟framer-motion的基本功能
export const motion = {
  div: ({ children, initial, whileInView, transition, className }) => {
    const [style, setStyle] = useState(initial || {});
    const [isInView, setIsInView] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
          }
        },
        { threshold: 0.1 }
      );
      
      const currentElement = document.querySelector(`.${className.replace(/\s+/g, '.')}`);
      if (currentElement) {
        observer.observe(currentElement);
      }
      
      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }, [className]);
    
    useEffect(() => {
      if (isInView && whileInView) {
        const timer = setTimeout(() => {
          setStyle(whileInView);
        }, (transition?.delay || 0) * 1000);
        
        return () => clearTimeout(timer);
      }
    }, [isInView, whileInView, transition]);
    
    const transitionStyle = {
      transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease'} ${transition?.delay || 0}s`,
    };
    
    return (
      <div className={className} style={{ ...style, ...transitionStyle }}>
        {children}
      </div>
    );
  }
};
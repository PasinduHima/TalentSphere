import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography, theme } from 'antd';
import './AuthLayout.css';

const { Text } = Typography;

// Add your professional images to the frontend/public/carousel/ directory.
// You can easily swap these filenames when you have the actual assets.
const carouselImages = [
  '/carousel/image 00.jpg',
  '/carousel/image 01.png',
  '/carousel/image 03.jpg',
];

export default function AuthLayout() {
  const { token } = theme.useToken();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const leftPaneRef = useRef(null);

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);

  // Track mouse coordinates for the spotlight effect
  const handleMouseMove = (e) => {
    if (!leftPaneRef.current) return;
    const rect = leftPaneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS variables for the radial gradient center
    leftPaneRef.current.style.setProperty('--mouse-x', `${x}px`);
    leftPaneRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
      {/* Left Pane - Image Carousel & Spotlight */}
      <div 
        ref={leftPaneRef}
        className="auth-left-pane"
        onMouseMove={handleMouseMove}
        style={{
          flex: 1,
          backgroundColor: token.colorPrimary,
          color: '#fff',
          display: 'flex'
        }}
      >
        {/* Slider Wrapper */}
        <div 
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {carouselImages.map((src, index) => (
            <div key={index} className="slide">
              <img src={src} alt={`Slide ${index + 1}`} />
              <div className="slide-overlay"></div>
            </div>
          ))}
        </div>

        {/* Spotlight Overlay */}
        <div className="spotlight-overlay"></div>
        
        {/* Typographic Hero Section */}
        <div className="hero-text-block">
          <h1>TalentSphere</h1>
          <h2>AI-powered hiring, for every role</h2>
        </div>
      </div>
      
      {/* Right Pane - Form area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: '#fff'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}

import React, { useState, useEffect } from 'react';
import { Sparkles, User, Image, Code, Clock } from 'lucide-react';
import '../../../scss/Components/Dashboard/StoreComingSoon.scss';

const comingSoonItems = [
  {
    type: 'Premium Templates',
    icon: <Sparkles className="item-icon" />,
    items: ['Coming Soon', 'Coming Soon', 'Coming Soon'],
  },
  {
    type: 'Custom Avatars',
    icon: <User className="item-icon" />,
    items: ['Coming Soon', 'Coming Soon', 'Coming Soon'],
  },
  {
    type: 'UI Components',
    icon: <Code className="item-icon" />,
    items: ['Coming Soon', 'Coming Soon', 'Coming Soon'],
  },
  {
    type: 'Themes',
    icon: <Image className="item-icon" />,
    items: ['Coming Soon', 'Coming Soon', 'Coming Soon'],
  },
  {
    type: 'Coming Soon',
    icon: <Clock className="item-icon" />,
    items: ['Coming Soon', 'Coming Soon', 'Coming Soon'],
  }
];



const StoreComingSoon = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add entrance animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`store-container ${isVisible ? 'visible' : ''}`}>
      <div className="store-header">
        <h2 className="store-title">Store Coming Soon</h2>
        <span className="badge">New Features</span>
      </div>
      
      <div className="items-row">
        {comingSoonItems.map((section, index) => (
          <div
            key={index}
            className={`item-card ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              // Staggered animation delay
              animationDelay: `${index * 0.1}s`,
              // For smoother motion
              transform: hoveredIndex === index ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="card-content">
              <div className="item-header">
                <div className="icon-container">
                  {section.icon}
                </div>
                <h3 className="item-title">{section.type}</h3>
              </div>
              
              <ul className="item-list">
                {section.items.map((item, idx) => (
                  <li key={idx} className="item-entry">
                    <div className="dot"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="card-footer">
                <button className="coming-soon-btn">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreComingSoon;
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Info, 
  Code, 
  CheckSquare, 
  RefreshCw, 
  Monitor,
  AlertCircle,
  Maximize2,
  X,
  Terminal,
  Clock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Test Case component with improved visualization
const TestCase = ({ label, content, index, checked }) => {
  return (
    <motion.div 
      className="test-case"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ width: '100%', margin: 0 }}
    >
      <div className="test-header">
        <div className="test-id">{label}</div>
        <div className={`checkbox ${checked ? 'checked' : ''}`}>
          {checked ? <Check size={14} /> : '☐'}
        </div>
      </div>
      <div className="test-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</div>
    </motion.div>
  );
};

const ExpectedOutputSection = ({ content }) => {
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
  
  return (
    <div className="expected-output-section">
      {paragraphs.map((paragraph, index) => {
        // Check if this paragraph is an example
        if (paragraph.startsWith('Example')) {
          const [title, ...details] = paragraph.split('\n');
          return (
            <motion.div 
              key={index} 
              className="example-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="example-title">
                <Info size={14} className="example-icon" />
                {title}
              </div>
              <div className="example-details">
                {details.map((line, i) => (
                  <div key={i} className="example-line">
                    {line}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        }
        // Regular paragraph
        return (
          <motion.div 
            key={index} 
            className="output-paragraph"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {paragraph.split('\n').map((line, i) => (
              <div key={i} className="output-line">{line}</div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

// Tab label with badge support
const TabLabel = ({ icon, label, count }) => (
  <>
    <span className="icon">{icon}</span>
    <span className="label">{label}</span>
    {count > 0 && <span className="badge">{count}</span>}
  </>
);

const ProblemDetails = ({ 
  instructionsExpanded = true, 
  setInstructionsExpanded,
  activeTab = 'instruction',
  setActiveTab,
  problemData,
  onReload,
  onTestCode
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorMode, setColorMode] = useState('dark'); 
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [validating, setValidating] = useState(false);
  const [testResults, setTestResults] = useState({});
  
  // Tabs for instructions with counts
  const tabs = [
    { id: 'instruction', label: 'Instructions', icon: <Info size={16} />, count: 0 },
    { id: 'expectedOutput', label: 'Expected Output', icon: <Code size={16} />, count: 0 },
    { id: 'testCase', label: 'Test Cases', icon: <CheckSquare size={16} />, count: 7 }
  ];
  
  // Test cases for the test case tab
  const testCases = [
    { id: 'test3', label: 'Test 3', content: '5 + 3 = 8' },
    { id: 'test2', label: 'Test 2', content: '-2 + 10 = 8' },
    { id: 'test1', label: 'Test 1', content: '0 + 0 = 0' },
    { id: 'test4', label: 'Test 4', content: '100 + 200 = 300' },
    { id: 'test5', label: 'Test 5', content: '-50 + 50 = 0' },
    { id: 'test6', label: 'Test 6', content: '999 + 1 = 1000' },
    { id: 'test7', label: 'Test 7', content: '-25 + (-25) = -50' }
  ];
  
  // Handle system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setColorMode(e.matches ? 'dark' : 'light');
    
    setColorMode(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Handle escape key for exiting fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);
  
  // Handle cooldown timer
  useEffect(() => {
    let interval;
    if (cooldownActive && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setCooldownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownActive, cooldownTime]);
  
  const handleReload = () => {
    setIsLoading(true);
    
    // Call the parent's reload function
    if (onReload) {
      onReload().finally(() => {
        setIsLoading(false);
      });
    } else {
      // Simulate loading if no reload function provided
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleTestCode = () => {
    if (onTestCode && !cooldownActive) {
      setValidating(true);
      
      // Simulate validation process
      setTimeout(() => {
        // Mark all test cases as passed
        const results = {};
        testCases.forEach(test => {
          results[test.id] = true;
        });
        
        setTestResults(results);
        setValidating(false);
        
        // Start cooldown
        setCooldownActive(true);
        setCooldownTime(5);
      }, 1500);
      
      onTestCode();
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <motion.div 
      layout
      className={`card full-height ${isLoading ? 'loading' : ''} ${isFullscreen ? 'fullscreen' : ''} ${colorMode}`}
      data-testid="problem-details"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: '#1e293b',
        borderRadius: '0.5rem'
      }}
    >
      <div className="card-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#f8fafc'
          }}
        >
          <Monitor size={18} style={{ color: '#ef4444' }} />
          <span>Problem Details</span>
          {isLoading && <span className="loading-indicator">Loading...</span>}
        </h2>
        
        <div className="action-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {validating ? (
            <motion.button
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              disabled
              className="action-btn validating-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'not-allowed',
                minWidth: '100px'
              }}
            >
              <RefreshCw size={15} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Validating</span>
            </motion.button>
          ) : cooldownActive ? (
            <motion.button
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              disabled
              className="action-btn cooldown-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: '#374151',
                color: '#fff',
                border: '2px solid #4b5563',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'not-allowed',
                position: 'relative',
                overflow: 'hidden',
                minWidth: '80px'
              }}
            >
              <Clock size={15} />
              <span>Cooldown</span>
              <div style={{
                position: 'absolute',
                top: '0.1rem',
                right: '0.1rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {cooldownTime}
              </div>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: cooldownTime, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #ef4444, #f87171)',
                  borderRadius: '0 0 0 0.375rem'
                }}
              />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="action-btn test-btn"
              onClick={handleTestCode}
              aria-label="Test Code"
              title="Test Code"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                minWidth: '80px'
              }}
            >
              <Terminal size={15} />
              <span>Test</span>
            </motion.button>
          )}
          
          <button
            className="action-btn fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              padding: '0.2rem',
              display: 'flex',
              cursor: 'pointer'
            }}
          >
            <Maximize2 size={18} />
          </button>
          
          <button
            className="action-btn toggle-btn"
            onClick={() => setInstructionsExpanded(!instructionsExpanded)}
            aria-label={instructionsExpanded ? "Collapse" : "Expand"}
            title={instructionsExpanded ? "Collapse" : "Expand"}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              padding: '0.2rem',
              display: 'flex',
              cursor: 'pointer',
              transform: instructionsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
            }}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(instructionsExpanded || isFullscreen) && (
          <motion.div
            className="card-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              flex: '1 1 auto', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: 0,
              overflow: 'hidden'
            }}
          >
            <div className="tab-navigation" role="tablist" style={{ 
              display: 'flex',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden' 
            }}>
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  id={`tab-${tab.id}`}
                  aria-controls={`panel-${tab.id}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #ef4444' : 'none',
                    color: activeTab === tab.id ? '#f8fafc' : '#94a3b8',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  <TabLabel icon={tab.icon} label={tab.label} count={tab.count} />
                </button>
              ))}
            </div>

            <div 
              className={`tab-content ${isLoading ? 'loading' : ''}`}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              style={{ 
                flex: '1 1 auto', 
                padding: 0,
                overflow: 'auto',
                maxHeight: 'none',
                background: '#0f172a'
              }}
            >
              {!problemData || !problemData[activeTab] ? (
                <div className="empty-state">
                  <AlertCircle size={28} />
                  <p>No data available for this section</p>
                  <button className="retry-btn" onClick={handleReload}>
                    <RefreshCw size={14} /> Reload
                  </button>
                </div>
              ) : activeTab === 'testCase' ? (
                <div className="test-cases" style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  overflow: 'auto',
                  color: '#f8fafc',
                  fontFamily: 'monospace'
                }}>
                  <div className="test-cases">
                    {testCases.map((test, index) => (
                      <div key={test.id} className="test-case" style={{ 
                        margin: '0.5rem 0', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '0.5rem'
                      }}>
                        <div className="test-header" style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <div className="test-id">{test.label}</div>
                          <div className={`checkbox ${testResults[test.id] ? 'checked' : ''}`} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: testResults[test.id] ? '#10b981' : 'transparent',
                            border: testResults[test.id] ? 'none' : '1px solid #94a3b8',
                            color: 'white'
                          }}>
                            {testResults[test.id] ? <Check size={14} /> : ''}
                          </div>
                        </div>
                        <div className="test-content" style={{ 
                          padding: '0.25rem 0'
                        }}>{test.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'expectedOutput' ? (
                <div style={{ 
                  overflow: 'auto', 
                  width: '100%', 
                  height: '100%',
                  padding: '1rem',
                  color: '#f8fafc' 
                }}>
                  <ExpectedOutputSection content={problemData[activeTab]} />
                </div>
              ) : (
                <div className="code-container" style={{ 
                  width: '100%', 
                  height: '100%', 
                  overflow: 'auto',
                  padding: '1rem',
                  color: '#f8fafc'
                }}>
                  <pre style={{ 
                    margin: 0,
                    width: '100%', 
                    height: '100%', 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word', 
                    overflow: 'auto' 
                  }}>
                    <code>{problemData[activeTab]}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProblemDetails;  
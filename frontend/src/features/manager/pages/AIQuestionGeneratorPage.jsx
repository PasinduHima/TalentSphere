import React, { useState } from 'react';
import { Card, Button, Input, Tag, Select, Typography, Row, Col, theme } from 'antd';
import { Wand2, Copy, Check, Download, BrainCircuit } from 'lucide-react';

const { Title, Text } = Typography;

export default function AIQuestionGeneratorPage() {
  const [role, setRole] = useState('Senior Frontend Engineer');
  const [focusArea, setFocusArea] = useState('System Architecture');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { token } = theme.useToken();

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions([
        {
          question: "Can you walk me through how you would architect the state management for a highly interactive, real-time collaborative application (like Google Docs) using React?",
          rationale: "Tests advanced understanding of React rendering, state synchronization, and performance optimization.",
          goodAnswer: "Should discuss optimistic UI updates, conflict resolution strategies (like CRDTs or operational transformation), and choosing the right state management tool (e.g. Zustand, Redux, or context) to prevent unnecessary re-renders."
        },
        {
          question: "Explain the concept of Micro-frontends. When would you choose to implement them, and what are the main architectural challenges they introduce?",
          rationale: "Assesses enterprise-level architectural thinking and the trade-offs of distributed UI development.",
          goodAnswer: "Should mention independent deployability and team autonomy, balanced against challenges like shared dependencies, routing complexity, and consistent design systems."
        },
        {
          question: "How do you approach web performance optimization for a React application that is experiencing slow time-to-interactive (TTI) and high layout shifts?",
          rationale: "Evaluates practical knowledge of Core Web Vitals and React-specific optimization techniques.",
          goodAnswer: "Should discuss code splitting (React.lazy), memoization (useMemo/useCallback), deferred rendering (useTransition/useDeferredValue), and fixing CLS by explicitly sizing images/dynamic content."
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={24} color={token.colorPrimary} />
          AI Interview Question Generator
        </Title>
        <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Generate tailored, role-specific interview questions with evaluation criteria.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Generator Controls */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card title="Generation Parameters" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Target Role</Text>
                  <Input 
                    size="large"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Interview Focus Area</Text>
                  <Select 
                    size="large"
                    style={{ width: '100%' }}
                    value={focusArea}
                    onChange={setFocusArea}
                    options={[
                      { value: 'System Architecture', label: 'System Architecture' },
                      { value: 'Technical Problem Solving', label: 'Technical Problem Solving' },
                      { value: 'Culture & Behavioral', label: 'Culture & Behavioral' },
                      { value: 'Leadership & Mentoring', label: 'Leadership & Mentoring' },
                      { value: 'Coding / Pair Programming', label: 'Coding / Pair Programming' }
                    ]}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Difficulty Level</Text>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Entry', 'Mid', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        style={{
                          flex: 1,
                          padding: '6px 0',
                          fontSize: '14px',
                          fontWeight: 500,
                          borderRadius: '6px',
                          transition: 'all 0.2s',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: difficulty === level ? token.colorPrimary : '#f1f5f9',
                          color: difficulty === level ? '#fff' : token.colorText,
                          boxShadow: difficulty === level ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none'
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div style={{ paddingTop: '16px', marginTop: '8px', borderTop: `1px solid ${token.colorBorder}` }}>
                  <Button 
                    type="primary"
                    block 
                    size="large"
                    icon={<Wand2 size={16} />}
                    onClick={handleGenerate}
                    loading={isGenerating}
                  >
                    Generate Questions
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Results Area */}
        <Col xs={24} lg={16}>
          {generatedQuestions.length === 0 && !isGenerating ? (
            <div style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '12px', border: `1px dashed ${token.colorBorder}` }}>
              <div style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                <BrainCircuit size={32} />
              </div>
              <Title level={4} style={{ margin: '0 0 8px 0' }}>Ready to Generate</Title>
              <Text type="secondary" style={{ textAlign: 'center', maxWidth: '300px' }}>
                Configure your parameters on the left and click Generate to create tailored interview questions.
              </Text>
            </div>
          ) : isGenerating ? (
            <div style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid #e2e8f0`, borderTopColor: token.colorPrimary, animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
              <Title level={4} style={{ margin: '0 0 8px 0' }}>AI is crafting questions...</Title>
              <Text type="secondary">Analyzing role requirements and focus area.</Text>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                <div>
                  <Text strong style={{ fontSize: '16px' }}>Generated Questions</Text>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Tag style={{ margin: 0 }}>{role}</Tag>
                    <Tag style={{ margin: 0 }}>{focusArea}</Tag>
                    <Tag style={{ margin: 0 }}>{difficulty}</Tag>
                  </div>
                </div>
                <Button size="small" icon={<Download size={14} />}>Export PDF</Button>
              </div>

              {generatedQuestions.map((q, index) => (
                <Card key={index} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eef2ff', color: token.colorPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        Q{index + 1}
                      </div>
                      <Text strong style={{ fontSize: '16px', lineHeight: 1.5 }}>{q.question}</Text>
                    </div>
                    <Button 
                      type="text" 
                      icon={copiedIndex === index ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                      style={{ color: copiedIndex === index ? '#16a34a' : token.colorTextSecondary }}
                      onClick={() => handleCopy(q.question, index)}
                    />
                  </div>

                  <div style={{ marginLeft: '48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', fontSize: '14px' }}>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>Why ask this?</Text>
                      <Text type="secondary">{q.rationale}</Text>
                    </div>
                    <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '12px', fontSize: '14px', border: '1px solid #dcfce7' }}>
                      <Text strong style={{ color: '#166534', display: 'block', marginBottom: '4px' }}>What to look for:</Text>
                      <Text style={{ color: '#15803d' }}>{q.goodAnswer}</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

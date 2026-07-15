import React, { useState } from 'react';
import { Card, Button, Input, Select, Slider, Typography, Row, Col, Space, theme } from 'antd';
import { Wand2, Briefcase, MapPin, DollarSign, ListPlus, ChevronLeft } from 'lucide-react';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function CreateJobPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const { token } = theme.useToken();

  const handleGenerateAI = () => {
    if (!jobTitle) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setDescription(`We are looking for an experienced ${jobTitle} to join our growing team. You will be responsible for building scalable, high-performance applications and collaborating with cross-functional teams to deliver excellent user experiences.\n\nKey Responsibilities:\n- Architect and develop new features\n- Write clean, maintainable code\n- Mentor junior developers\n\nRequirements:\n- 5+ years of experience\n- Strong problem-solving skills\n- Excellent communication abilities`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Button type="text" icon={<ChevronLeft size={20} color={token.colorTextSecondary} />} />
        <Text strong style={{ color: token.colorTextSecondary }}>Back to Jobs</Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Create Job Posting</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Draft a new job requisition with AI assistance.</Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button>Save Draft</Button>
          <Button type="primary">Publish Job</Button>
        </div>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Basic Info */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title level={5} style={{ margin: 0, paddingBottom: '8px', borderBottom: `1px solid ${token.colorBorder}` }}>Basic Information</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Job Title <span style={{ color: '#ef4444' }}>*</span></Text>
                  <Input 
                    size="large"
                    placeholder="e.g. Senior Frontend Engineer" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    prefix={<Briefcase size={16} color={token.colorTextSecondary} />}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Location</Text>
                  <Input 
                    size="large"
                    placeholder="e.g. San Francisco, CA or Remote" 
                    prefix={<MapPin size={16} color={token.colorTextSecondary} />}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Salary Range</Text>
                  <Input 
                    size="large"
                    placeholder="e.g. $120,000 - $150,000" 
                    prefix={<DollarSign size={16} color={token.colorTextSecondary} />}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Employment Type</Text>
                  <Select 
                    size="large"
                    style={{ width: '100%' }}
                    defaultValue="Full-time"
                    options={[
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Part-time', label: 'Part-time' },
                      { value: 'Contract', label: 'Contract' },
                      { value: 'Internship', label: 'Internship' }
                    ]}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Department</Text>
                  <Select 
                    size="large"
                    style={{ width: '100%' }}
                    defaultValue="Engineering"
                    options={[
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Design', label: 'Design' },
                      { value: 'Product', label: 'Product' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Sales', label: 'Sales' }
                    ]}
                  />
                </div>
              </Col>
            </Row>
          </section>

          {/* Job Description with AI Assist */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${token.colorBorder}` }}>
              <Title level={5} style={{ margin: 0 }}>Job Description</Title>
              <Button 
                type="dashed"
                size="small" 
                style={{ color: token.colorPrimary, borderColor: token.colorPrimary, display: 'flex', alignItems: 'center' }} 
                icon={<Wand2 size={16} />}
                onClick={handleGenerateAI}
                loading={isGenerating}
                disabled={!jobTitle}
              >
                Auto-Generate with AI
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Write a compelling job description or use the AI generator above based on the job title.
              </Text>
              <TextArea 
                style={{ width: '100%', minHeight: '300px' }}
                placeholder="Enter job description, responsibilities, and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoSize={{ minRows: 12 }}
              />
            </div>
          </section>

          {/* AI Screening Preferences */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title level={5} style={{ margin: 0, paddingBottom: '8px', borderBottom: `1px solid ${token.colorBorder}` }}>AI Screening Preferences</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Must-Have Skills</Text>
                  <Input size="large" placeholder="Type skill and press enter..." prefix={<ListPlus size={16} color={token.colorTextSecondary} />} />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Minimum AI Match Score Threshold</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '40px' }}>
                    <Slider style={{ flex: 1 }} min={50} max={100} defaultValue={80} />
                    <Text strong style={{ color: token.colorPrimary, minWidth: '40px', textAlign: 'right' }}>80%</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </section>

        </div>
      </Card>
    </div>
  );
}

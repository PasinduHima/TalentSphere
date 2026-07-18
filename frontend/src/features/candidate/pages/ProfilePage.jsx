import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Tag, Typography, Row, Col, Space, theme, Form, InputNumber, Spin, message, Upload } from 'antd';
import { useAuthStore } from '../../../store/authStore';
import { candidateApi } from '../../../lib/api/candidate';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { FileText, X, UploadCloud, Star } from 'lucide-react';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    try {
      const profile = await candidateApi.getProfile();
      form.setFieldsValue({
        headline: profile.headline,
        summary: profile.summary,
        location: profile.location,
        phoneNumber: profile.phoneNumber,
        experienceYears: profile.experienceYears,
        educationSummary: profile.educationSummary,
        linkedInUrl: profile.linkedInUrl,
        portfolioUrl: profile.portfolioUrl,
      });
      setSkills(profile.skills.map((s) => ({ name: s.name, proficiencyLevel: s.proficiencyLevel, yearsOfExperience: s.yearsOfExperience })));
      setResumes(profile.resumes);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load your profile.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { name: trimmed, proficiencyLevel: 'Intermediate', yearsOfExperience: 1 }]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s.name !== skillToRemove));
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await candidateApi.updateProfile({
        ...values,
        skills,
      });
      message.success('Profile updated.');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to save your profile.'));
    } finally {
      setSaving(false);
    }
  };

  const handleUploadResume = async (file) => {
    setUploading(true);
    try {
      const resume = await candidateApi.uploadResume(file);
      setResumes((prev) => [resume, ...prev]);
      message.success('Resume uploaded and parsed.');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to upload resume.'));
    } finally {
      setUploading(false);
    }
    return false; // prevent antd Upload's default auto-submit
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await candidateApi.deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to delete resume.'));
    }
  };

  const handleSetPrimary = async (resumeId) => {
    try {
      await candidateApi.setPrimaryResume(resumeId);
      setResumes((prev) => prev.map((r) => ({ ...r, isPrimary: r.id === resumeId })));
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to set primary resume.'));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Profile & CV</Title>
            <Text type="secondary">Manage your personal information and skills.</Text>
          </div>
          <Button type="primary" htmlType="submit" loading={saving}>Save Changes</Button>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column - Avatar & CV */}
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ position: 'relative', marginBottom: '16px', width: '128px', height: '128px' }}>
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{user?.name}</Title>
                <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>{user?.email}</Text>
                <Tag color="success" style={{ marginTop: '12px', padding: '4px 12px', borderRadius: '9999px' }}>{user?.roleLabel}</Tag>
              </Card>

              <Card title="Resume / CV" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
                <Upload.Dragger showUploadList={false} beforeUpload={handleUploadResume} accept=".pdf,.doc,.docx,.txt" style={{ marginBottom: '16px' }}>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
                      <UploadCloud size={24} />
                    </div>
                    <Text strong style={{ fontSize: '14px' }}>{uploading ? 'Uploading…' : 'Upload new resume'}</Text>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>PDF, DOCX or TXT up to 10MB</Text>
                  </div>
                </Upload.Dragger>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {resumes.length === 0 && <Text type="secondary" style={{ fontSize: '13px' }}>No resumes uploaded yet.</Text>}
                  {resumes.map((resume) => (
                    <div key={resume.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: `1px solid ${token.colorBorder}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <FileText size={20} color={token.colorPrimary} style={{ flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <Text strong style={{ fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{resume.fileName}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {resume.isPrimary ? 'Primary' : 'Uploaded'} · {resume.extractedSkills?.length || 0} skills detected
                          </Text>
                        </div>
                      </div>
                      <Space size={4}>
                        {!resume.isPrimary && (
                          <Button type="text" size="small" icon={<Star size={14} />} onClick={() => handleSetPrimary(resume.id)} title="Set as primary" />
                        )}
                        <Button type="text" size="small" danger icon={<X size={16} />} onClick={() => handleDeleteResume(resume.id)} />
                      </Space>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Col>

          {/* Right Column - Form */}
          <Col xs={24} md={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Card title="Personal Information" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Form.Item name="headline" label={<Text strong>Headline</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" placeholder="e.g. Senior Frontend Engineer" />
                  </Form.Item>
                  <Form.Item name="phoneNumber" label={<Text strong>Phone Number</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" type="tel" />
                  </Form.Item>
                  <Form.Item name="location" label={<Text strong>Location</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="experienceYears" label={<Text strong>Years of Experience</Text>} style={{ marginBottom: 0 }}>
                    <InputNumber size="large" min={0} max={60} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="educationSummary" label={<Text strong>Education</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" placeholder="e.g. B.S. Computer Science, NSBM" />
                  </Form.Item>
                  <Form.Item name="linkedInUrl" label={<Text strong>LinkedIn URL</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="portfolioUrl" label={<Text strong>Portfolio URL</Text>} style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="summary" label={<Text strong>Bio</Text>} style={{ marginBottom: 0 }}>
                    <TextArea autoSize={{ minRows: 4 }} />
                  </Form.Item>
                </div>
              </Card>

              <Card title="Skills & Expertise" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      size="large"
                      placeholder="Add a skill (e.g. React, C#)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                  </div>
                  <Button type="primary" size="large" htmlType="submit" disabled={!newSkill.trim()}>Add</Button>
                </form>

                <Space wrap>
                  {skills.map(skill => (
                    <Tag
                      key={skill.name}
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        handleRemoveSkill(skill.name);
                      }}
                      color="blue"
                      style={{ padding: '4px 10px', fontSize: '14px', borderRadius: '4px' }}
                    >
                      {skill.name}
                    </Tag>
                  ))}
                  {skills.length === 0 && <Text type="secondary" style={{ fontSize: '13px' }}>No skills added yet — this affects your AI job match score.</Text>}
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Form>
  );
}

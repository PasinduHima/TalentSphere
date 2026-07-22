import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Typography, Row, Col, theme, message } from 'antd';
import { Briefcase, MapPin, DollarSign, ListPlus, ChevronLeft } from 'lucide-react';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { TextArea } = Input;
const { Title, Text } = Typography;

const EMPLOYMENT_TYPES = [
  { value: 'FullTime', label: 'Full-time' },
  { value: 'PartTime', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [employmentType, setEmploymentType] = useState('FullTime');
  const [departmentId, setDepartmentId] = useState(undefined);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    recruiterApi.getDepartments()
      .then((depts) => {
        setDepartments(depts);
        if (depts.length > 0) setDepartmentId(depts[0].id);
      })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load departments.')));
  }, []);

  const buildPayload = () => ({
    title: jobTitle,
    description,
    requirements,
    departmentId,
    location,
    employmentType,
    salaryMin: salaryMin ? Number(salaryMin) : undefined,
    salaryMax: salaryMax ? Number(salaryMax) : undefined,
    skills: skills.map((name) => ({ name, isRequired: true, weight: 1.0 })),
  });

  const validate = () => {
    if (!jobTitle.trim()) { message.warning('Job title is required.'); return false; }
    if (!description.trim()) { message.warning('Job description is required.'); return false; }
    if (!departmentId) { message.warning('Please select a department.'); return false; }
    if (!location.trim()) { message.warning('Location is required.'); return false; }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await recruiterApi.createJob(buildPayload());
      message.success('Job saved as draft.');
      navigate('/recruiter/jobs');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to save job.'));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await recruiterApi.createJob(buildPayload());
      await recruiterApi.updateJob(created.id, { ...buildPayload(), status: 'Active' });
      message.success('Job published.');
      navigate('/recruiter/jobs');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to publish job.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Button type="text" icon={<ChevronLeft size={20} color={token.colorTextSecondary} />} onClick={() => navigate('/recruiter/jobs')} />
        <Text strong style={{ color: token.colorTextSecondary }}>Back to Jobs</Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Create Job Posting</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Draft a new job requisition.</Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={handleSaveDraft} loading={saving}>Save Draft</Button>
          <Button type="primary" onClick={handlePublish} loading={saving}>Publish Job</Button>
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
                  <Text strong>Location <span style={{ color: '#ef4444' }}>*</span></Text>
                  <Input
                    size="large"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    prefix={<MapPin size={16} color={token.colorTextSecondary} />}
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Salary Min</Text>
                  <Input size="large" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} prefix={<DollarSign size={16} color={token.colorTextSecondary} />} />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Salary Max</Text>
                  <Input size="large" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} prefix={<DollarSign size={16} color={token.colorTextSecondary} />} />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Employment Type</Text>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    value={employmentType}
                    onChange={setEmploymentType}
                    options={EMPLOYMENT_TYPES}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Department <span style={{ color: '#ef4444' }}>*</span></Text>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    value={departmentId}
                    onChange={setDepartmentId}
                    options={departments.map((d) => ({ value: d.id, label: d.name }))}
                    placeholder={departments.length === 0 ? 'No departments — ask an Admin to create one' : 'Select department'}
                  />
                </div>
              </Col>
            </Row>
          </section>

          {/* Job Description */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title level={5} style={{ margin: 0, paddingBottom: '8px', borderBottom: `1px solid ${token.colorBorder}` }}>Job Description</Title>
            <TextArea
              style={{ width: '100%', minHeight: '200px' }}
              placeholder="Enter job description and responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoSize={{ minRows: 8 }}
            />
            <Text strong>Requirements</Text>
            <TextArea
              placeholder="Enter role requirements..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              autoSize={{ minRows: 4 }}
            />
          </section>

          {/* AI Screening Preferences */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title level={5} style={{ margin: 0, paddingBottom: '8px', borderBottom: `1px solid ${token.colorBorder}` }}>AI Screening Skills</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text strong>Required Skills</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>Used by the AI matching engine to score applicants against this job.</Text>
              <Select
                mode="tags"
                size="large"
                style={{ width: '100%' }}
                value={skills}
                onChange={setSkills}
                placeholder="Type a skill and press enter..."
                suffixIcon={<ListPlus size={16} color={token.colorTextSecondary} />}
              />
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}

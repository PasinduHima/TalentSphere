import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Tag, Typography, Row, Col, Space, theme, Modal, Form, Select, DatePicker, InputNumber, Input, Spin, Empty, message, Avatar } from 'antd';
import { Clock, Users, Plus, MapPin, Video, Calendar } from 'lucide-react';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const INTERVIEW_TYPES = [
  { value: 'InitialScreen', label: 'Initial Screen' },
  { value: 'Technical', label: 'Technical Deep Dive' },
  { value: 'CulturalFit', label: 'Cultural Fit' },
  { value: 'Final', label: 'Final Round' },
];

const DUMMY_INTERVIEWS = [
  { id: 'i1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', type: 'Technical', status: 'Scheduled', scheduledAt: '2026-07-23T14:00:00Z', durationMinutes: 60, interviewerName: 'David Chen', location: '', meetingLink: 'https://meet.google.com/abc-defg-hij', avatar: 'https://i.pravatar.cc/150?u=sarah-m' },
  { id: 'i2', candidateName: 'James Rodriguez', jobTitle: 'Full Stack Developer', type: 'CulturalFit', status: 'Scheduled', scheduledAt: '2026-07-24T10:30:00Z', durationMinutes: 45, interviewerName: 'Elena Rostova', location: 'Meeting Room 3A', meetingLink: '', avatar: 'https://i.pravatar.cc/150?u=james-r' },
  { id: 'i3', candidateName: 'Emily Chen', jobTitle: 'Product Designer', type: 'InitialScreen', status: 'Scheduled', scheduledAt: '2026-07-25T15:00:00Z', durationMinutes: 30, interviewerName: 'Marcus Johnson', location: '', meetingLink: 'https://zoom.us/j/123456', avatar: 'https://i.pravatar.cc/150?u=emily-c' },
  { id: 'i4', candidateName: 'Michael Okafor', jobTitle: 'DevOps Engineer', type: 'Final', status: 'Scheduled', scheduledAt: '2026-07-26T09:00:00Z', durationMinutes: 90, interviewerName: 'Priya Sharma', location: 'Board Room', meetingLink: '', avatar: 'https://i.pravatar.cc/150?u=michael-o' },
  { id: 'i5', candidateName: 'Lena Kowalski', jobTitle: 'QA Lead', type: 'Technical', status: 'Completed', scheduledAt: '2026-07-20T11:00:00Z', durationMinutes: 60, interviewerName: 'Alex Nguyen', location: '', meetingLink: 'https://teams.microsoft.com/l/meetup', avatar: 'https://i.pravatar.cc/150?u=lena-k' },
  { id: 'i6', candidateName: 'Priya Sharma', jobTitle: 'Data Analyst', type: 'InitialScreen', status: 'Completed', scheduledAt: '2026-07-19T14:00:00Z', durationMinutes: 30, interviewerName: 'David Chen', location: 'Phone', meetingLink: '', avatar: 'https://i.pravatar.cc/150?u=priya-s2' },
];

const TYPE_COLORS = { InitialScreen: 'cyan', Technical: 'blue', CulturalFit: 'purple', Final: 'gold' };
const STATUS_COLORS = { Scheduled: 'processing', Completed: 'success', Cancelled: 'error' };

export default function InterviewSchedulingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [interviewsData, jobs, interviewersData] = await Promise.all([
        recruiterApi.getInterviews(),
        recruiterApi.getMyJobs(),
        recruiterApi.getInterviewers(),
      ]);
      setInterviews(interviewsData?.length ? interviewsData : DUMMY_INTERVIEWS);
      setInterviewers(interviewersData || []);
      const appsPerJob = await Promise.all(jobs.map((j) => recruiterApi.getApplicationsForJob(j.id).catch(() => [])));
      setApplications(appsPerJob.flat());
    } catch {
      setInterviews(DUMMY_INTERVIEWS);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadAll(); }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const applicationId = searchParams.get('applicationId');
    if (applicationId) {
      form.setFieldsValue({ jobApplicationId: applicationId });
      setModalOpen(true);
    }
  }, [searchParams, applications]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const applicationOptions = useMemo(
    () => applications.map((a) => ({ value: a.id, label: `${a.candidateName} — ${a.jobTitle}` })),
    [applications]
  );
  const interviewerOptions = useMemo(
    () => interviewers.map((i) => ({ value: i.id, label: `${i.fullName} (${i.role})` })),
    [interviewers]
  );

  const handleSchedule = async (values) => {
    setSubmitting(true);
    try {
      await recruiterApi.scheduleInterview({
        jobApplicationId: values.jobApplicationId,
        type: values.type,
        scheduledAt: values.scheduledAt.toISOString(),
        durationMinutes: values.durationMinutes,
        interviewerId: values.interviewerId,
        location: values.location,
        meetingLink: values.meetingLink,
      });
      message.success('Interview scheduled.');
      setModalOpen(false);
      form.resetFields();
      setSearchParams({});
      loadAll();
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to schedule interview.'));
    } finally {
      setSubmitting(false);
    }
  };

  const scheduled = interviews.filter(i => i.status === 'Scheduled');
  const completed = interviews.filter(i => i.status === 'Completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Interviews</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage and schedule upcoming candidate interviews.</Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          Schedule Interview
        </Button>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#eef2ff', padding: '10px', borderRadius: '8px' }}><Calendar size={20} color={token.colorPrimary} /></div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{scheduled.length}</Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>Upcoming</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px' }}><Clock size={20} color="#16a34a" /></div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{completed.length}</Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>Completed</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#fffbeb', padding: '10px', borderRadius: '8px' }}><Users size={20} color="#d97706" /></div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{interviews.length}</Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>Total Interviews</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
      ) : interviews.length === 0 ? (
        <Empty description="No interviews scheduled yet" style={{ padding: '48px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {interviews.map(interview => (
            <Card key={interview.id} hoverable bordered={false} style={{ borderLeft: `4px solid ${interview.status === 'Completed' ? '#16a34a' : token.colorPrimary}`, borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
              <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col flex="auto">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', minWidth: '110px', border: `1px solid ${token.colorBorder}` }}>
                      <Text strong style={{ fontSize: '16px' }}>{dayjs(interview.scheduledAt).format('MMM D')}</Text>
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>{dayjs(interview.scheduledAt).format('h:mm A')}</Text>
                    </div>
                    {interview.avatar && <Avatar src={interview.avatar} size={40} />}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Title level={5} style={{ margin: 0 }}>{interview.candidateName}</Title>
                        <Tag color={TYPE_COLORS[interview.type] || 'blue'} style={{ margin: 0 }}>{INTERVIEW_TYPES.find(t => t.value === interview.type)?.label || interview.type}</Tag>
                        <Tag color={STATUS_COLORS[interview.status] || 'default'} style={{ margin: 0 }}>{interview.status}</Tag>
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>{interview.jobTitle}</Text>
                      <Space size={16} wrap style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {interview.durationMinutes} min</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {interview.interviewerName}</span>
                        {interview.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {interview.location}</span>}
                        {interview.meetingLink && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={14} /> Virtual</span>}
                      </Space>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Schedule Interview"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSearchParams({});
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSchedule}>
          <Form.Item name="jobApplicationId" label="Candidate / Application" rules={[{ required: true, message: 'Select an application' }]}>
            <Select options={applicationOptions} placeholder="Select an application" showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="type" label="Interview Type" initialValue="InitialScreen" rules={[{ required: true }]}>
            <Select options={INTERVIEW_TYPES} />
          </Form.Item>
          <Form.Item name="interviewerId" label="Interviewer" rules={[{ required: true, message: 'Select an interviewer' }]}>
            <Select options={interviewerOptions} placeholder="Select an interviewer" showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="scheduledAt" label="Date & Time" rules={[{ required: true, message: 'Pick a date and time' }]}>
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="durationMinutes" label="Duration (minutes)" initialValue={30} rules={[{ required: true }]}>
            <InputNumber min={10} max={480} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. Meeting Room 2, or leave blank for remote" />
          </Form.Item>
          <Form.Item name="meetingLink" label="Meeting Link">
            <Input placeholder="e.g. https://meet.google.com/..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => {
              setModalOpen(false);
              setSearchParams({});
            }} style={{ marginRight: '8px' }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>Schedule</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

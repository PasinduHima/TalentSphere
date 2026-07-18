import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Space, theme, Spin, Empty, message } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import StatusBadge from '../../../components/shared/StatusBadge';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { Check, X, Calendar, Sparkles, ChevronLeft } from 'lucide-react';

const { Title, Text } = Typography;

export default function ApplicationReviewPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [jobTitle, setJobTitle] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [apps, jobs] = await Promise.all([
        recruiterApi.getApplicationsForJob(jobId),
        recruiterApi.getMyJobs(),
      ]);
      setApplications(apps);
      setJobTitle(jobs.find((j) => j.id === jobId)?.title || 'Job Applications');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load applications.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [jobId]);

  const handleRank = async () => {
    setRanking(true);
    try {
      const ranked = await recruiterApi.rankApplicationsForJob(jobId);
      setApplications(ranked);
      message.success('Candidates re-ranked using the AI matching engine.');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to rank applications.'));
    } finally {
      setRanking(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status, notes) => {
    setUpdatingId(applicationId);
    try {
      const updated = await recruiterApi.updateApplicationStatus(applicationId, { status, notes });
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? updated : a)));
      message.success(`Application marked as ${status}.`);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update application.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Button type="text" icon={<ChevronLeft size={20} color={token.colorTextSecondary} />} onClick={() => navigate('/recruiter/jobs')} />
        <Text strong style={{ color: token.colorTextSecondary }}>Back to Jobs</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{jobTitle}</Title>
          <Text type="secondary">{applications.length} applicant{applications.length === 1 ? '' : 's'}</Text>
        </div>
        <Button icon={<Sparkles size={16} />} onClick={handleRank} loading={ranking}>Re-rank with AI</Button>
      </div>

      {applications.length === 0 ? (
        <Empty description="No applications for this job yet" style={{ padding: '48px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map((app) => (
            <Card key={app.id} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 16]} align="middle">
                <Col flex="64px">
                  <AIMatchScore score={Math.round(app.matchScore)} size="lg" />
                </Col>
                <Col flex="auto">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <Title level={5} style={{ margin: 0 }}>{app.candidateName}</Title>
                    <StatusBadge status={app.status} type="application" />
                  </div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{app.candidateEmail}</Text>
                  {app.coverLetter && <Text style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>"{app.coverLetter}"</Text>}
                  <Text type="secondary" style={{ fontSize: '12px' }}>Applied {new Date(app.createdAt).toLocaleDateString()}</Text>
                </Col>
                <Col flex="none">
                  <Space wrap>
                    <Button
                      icon={<Calendar size={16} />}
                      onClick={() => navigate(`/recruiter/interviews?applicationId=${app.id}`)}
                    >
                      Schedule
                    </Button>
                    <Button
                      danger
                      icon={<X size={16} />}
                      loading={updatingId === app.id}
                      disabled={app.status === 'Rejected'}
                      onClick={() => handleStatusUpdate(app.id, 'Rejected', 'Not moving forward.')}
                    >
                      Reject
                    </Button>
                    <Button
                      type="primary"
                      icon={<Check size={16} />}
                      loading={updatingId === app.id}
                      disabled={app.status === 'Interview' || app.status === 'Offer' || app.status === 'Hired'}
                      onClick={() => handleStatusUpdate(app.id, 'Screening', 'Advanced to screening.')}
                    >
                      Advance
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

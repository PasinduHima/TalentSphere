import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table, Tag, Typography, theme, message, Avatar } from 'antd';
import { MessageCircle } from 'lucide-react';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

const DUMMY_SHORTLISTED = [
  { jobApplicationId: 'a1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', matchScore: 96, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=sarah-m', interviews: [{ id: 'i1', status: 'Completed', type: 'Technical', scheduledAt: '2026-07-20T14:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a2', candidateName: 'James Rodriguez', jobTitle: 'Full Stack Developer', matchScore: 91, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=james-r', interviews: [{ id: 'i2', status: 'Completed', type: 'CulturalFit', scheduledAt: '2026-07-19T10:30:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a3', candidateName: 'Emily Chen', jobTitle: 'Product Designer', matchScore: 87, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=emily-c', interviews: [{ id: 'i3', status: 'Scheduled', type: 'InitialScreen', scheduledAt: '2026-07-25T15:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a4', candidateName: 'Michael Okafor', jobTitle: 'DevOps Engineer', matchScore: 83, status: 'Offer', avatar: 'https://i.pravatar.cc/150?u=michael-o', interviews: [{ id: 'i4', status: 'Completed', type: 'Final', scheduledAt: '2026-07-18T09:00:00Z' }], feedbacks: [{ id: 'f1' }] },
  { jobApplicationId: 'a5', candidateName: 'Priya Sharma', jobTitle: 'Data Analyst', matchScore: 78, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=priya-s3', interviews: [{ id: 'i5', status: 'Scheduled', type: 'Technical', scheduledAt: '2026-07-26T11:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a6', candidateName: 'Alex Nguyen', jobTitle: 'Backend Engineer', matchScore: 92, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=alex-n', interviews: [{ id: 'i6', status: 'Completed', type: 'Technical', scheduledAt: '2026-07-17T10:00:00Z' }], feedbacks: [{ id: 'f2' }, { id: 'f3' }] },
  { jobApplicationId: 'a7', candidateName: 'Lena Kowalski', jobTitle: 'QA Lead', matchScore: 74, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=lena-k', interviews: [{ id: 'i7', status: 'Completed', type: 'CulturalFit', scheduledAt: '2026-07-16T15:00:00Z' }], feedbacks: [{ id: 'f4' }] },
];

export default function ShortlistedCandidatesPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);

  useEffect(() => {
    hiringManagerApi.getShortlisted()
      .then((data) => setShortlisted(data?.length ? data : DUMMY_SHORTLISTED))
      .catch(() => setShortlisted(DUMMY_SHORTLISTED))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidateName',
      key: 'candidateName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record.avatar ? <Avatar src={record.avatar} size={36} /> : <Avatar size={36}>{text?.charAt(0)}</Avatar>}
          <div>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{record.jobTitle}</Text>
          </div>
        </div>
      ),
    },
    { title: 'Role', dataIndex: 'jobTitle', key: 'jobTitle', responsive: ['lg'] },
    {
      title: 'AI Match',
      dataIndex: 'matchScore',
      key: 'matchScore',
      align: 'center',
      sorter: (a, b) => a.matchScore - b.matchScore,
      defaultSortOrder: 'descend',
      render: (score) => <AIMatchScore score={Math.round(score)} size="sm" />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Offer' ? 'success' : 'processing'} style={{ margin: 0 }}>{status}</Tag>,
    },
    {
      title: 'Feedback',
      dataIndex: 'feedbacks',
      key: 'feedbacks',
      align: 'center',
      render: (feedbacks) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: feedbacks.length > 0 ? '#f0fdf4' : '#f1f5f9', color: feedbacks.length > 0 ? '#16a34a' : token.colorText, fontWeight: 500, padding: '2px 10px', borderRadius: '9999px', fontSize: '12px' }}>
          {feedbacks.length}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button
          size="small"
          type={record.feedbacks.length === 0 ? 'primary' : 'default'}
          icon={<MessageCircle size={14} />}
          onClick={() => navigate(`/hiring-manager/feedback?applicationId=${record.jobApplicationId}`)}
        >
          {record.feedbacks.length === 0 ? 'Review Now' : 'View Feedback'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Shortlisted Candidates</Title>
        <Text type="secondary">Candidates currently in the interview or offer stage, ranked by AI match score.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={shortlisted.map((c) => ({ ...c, key: c.jobApplicationId }))}
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => <Text type="secondary">{total} candidates</Text> }}
          locale={{ emptyText: 'No shortlisted candidates yet' }}
        />
      </Card>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input, Tag, Table, Tabs, Typography, theme, message } from 'antd';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

export default function HiringDecisionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [decisions, setDecisions] = useState([]);

  const load = () => {
    setLoading(true);
    Promise.all([hiringManagerApi.getShortlisted(), hiringManagerApi.getDecisions()])
      .then(([shortlistedData, decisionsData]) => {
        setShortlisted(shortlistedData);
        setDecisions(decisionsData);
      })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load hiring decisions.')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (jobApplicationId, decision) => {
    setDecidingId(jobApplicationId);
    try {
      await hiringManagerApi.recordDecision({ jobApplicationId, decision, notes: decision === 'ExtendOffer' ? 'Offer extended.' : 'Not moving forward.' });
      message.success(decision === 'ExtendOffer' ? 'Offer extended.' : 'Candidate rejected.');
      load();
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to record decision.'));
    } finally {
      setDecidingId(null);
    }
  };

  const rows = useMemo(() => {
    const decidedIds = new Set(decisions.map((d) => d.jobApplicationId));
    const pendingRows = shortlisted
      .filter((c) => !decidedIds.has(c.jobApplicationId))
      .map((c) => ({
        key: c.jobApplicationId,
        jobApplicationId: c.jobApplicationId,
        name: c.candidateName,
        role: c.jobTitle,
        matchScore: c.matchScore,
        reviewers: c.feedbacks.length,
        status: 'Pending Decision',
      }));
    const decidedRows = decisions.map((d) => ({
      key: d.id,
      jobApplicationId: d.jobApplicationId,
      name: d.candidateName,
      role: d.jobTitle,
      matchScore: null,
      reviewers: null,
      status: d.decision === 'ExtendOffer' ? 'Offer Extended' : d.decision === 'Reject' ? 'Rejected' : 'On Hold',
    }));
    return [...pendingRows, ...decidedRows];
  }, [shortlisted, decisions]);

  const filteredRows = rows.filter((r) => {
    if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (activeTab === 'Pending') return r.status === 'Pending Decision';
    if (activeTab === 'Offers') return r.status === 'Offer Extended';
    if (activeTab === 'Rejected') return r.status === 'Rejected';
    return true;
  });

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'AI Match',
      dataIndex: 'matchScore',
      key: 'matchScore',
      align: 'center',
      render: (score) => score == null ? <Text type="secondary">—</Text> : <Text strong>{Math.round(score)}%</Text>
    },
    {
      title: 'Reviews',
      dataIndex: 'reviewers',
      key: 'reviewers',
      align: 'center',
      render: (revs) => revs == null ? <Text type="secondary">—</Text> : (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: token.colorText, fontWeight: 500, padding: '2px 10px', borderRadius: '9999px', fontSize: '12px' }}>
          {revs}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'warning';
        if (status === 'Offer Extended') color = 'success';
        if (status === 'Rejected') color = 'error';
        return <Tag color={color} style={{ margin: 0 }}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        record.status === 'Pending Decision' ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button danger size="small" icon={<XCircle size={14} />} loading={decidingId === record.jobApplicationId} onClick={() => handleDecision(record.jobApplicationId, 'Reject')}>Reject</Button>
            <Button type="primary" size="small" style={{ backgroundColor: '#16a34a' }} icon={<CheckCircle size={14} />} loading={decidingId === record.jobApplicationId} onClick={() => handleDecision(record.jobApplicationId, 'ExtendOffer')}>Extend Offer</Button>
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: '12px' }}>Decided</Text>
        )
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Hiring Decisions</Title>
        <Text type="secondary">Review feedback and make final offers.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={['All', 'Pending', 'Offers', 'Rejected'].map(tab => ({ key: tab, label: tab }))}
            style={{ marginBottom: 0 }}
          />
          <Input
            prefix={<Search size={16} color={token.colorTextSecondary} />}
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '256px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredRows}
          rowKey="key"
          loading={loading}
          pagination={false}
          style={{ margin: 0 }}
          locale={{ emptyText: 'No candidates to review yet' }}
        />
      </Card>
    </div>
  );
}

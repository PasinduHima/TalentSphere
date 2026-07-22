import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Table, Typography, theme, Spin, message } from 'antd';
import { Search, Plus } from 'lucide-react';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';
import StatusBadge from '../../../components/shared/StatusBadge';

const { Title, Text } = Typography;

export default function JobPostingsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();

  useEffect(() => {
    recruiterApi.getMyJobs()
      .then(setJobs)
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load job postings.')))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: token.colorText, fontSize: '14px' }}>{text}</div>
          {record.skills && record.skills.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {record.skills.slice(0, 3).map(skill => (
                <span key={skill} style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px' }}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'department',
      render: (text) => <span style={{ color: token.colorTextSecondary }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} type="job" />,
    },
    {
      title: 'Applicants',
      dataIndex: 'applicantsCount',
      key: 'applicants',
      render: (applicants) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', backgroundColor: applicants > 0 ? '#eef2ff' : '#f1f5f9', color: applicants > 0 ? token.colorPrimary : token.colorTextSecondary }}>
          {applicants}
        </span>
      )
    },
    {
      title: 'Posted Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date, record) => <span style={{ color: token.colorTextSecondary }}>{record.status === 'Draft' ? '--' : new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/recruiter/applications/${record.id}`)}>View Applicants</Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: `1px solid ${token.colorBorder}`, paddingBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Job Postings</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage and track open requisitions across departments.</Text>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/recruiter/jobs/new')}
          style={{ borderRadius: '9999px', padding: '0 24px', fontWeight: 500, display: 'flex', alignItems: 'center' }}
          icon={<Plus size={16} />}
        >
          Create New Job
        </Button>
      </div>

      <Input
        prefix={<Search size={16} color={token.colorTextSecondary} />}
        placeholder="Search job postings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '320px' }}
      />

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="id"
            pagination={{
              showTotal: (total, range) => <span style={{ color: token.colorTextSecondary }}>Showing {range[0]} to {range[1]} of {total} results</span>,
              style: { padding: '16px 24px', borderTop: `1px solid ${token.colorBorder}`, margin: 0 }
            }}
            locale={{ emptyText: 'No job postings yet — create your first one.' }}
          />
        )}
      </div>
    </div>
  );
}

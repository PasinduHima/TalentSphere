import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Table, Tag, Typography, theme } from 'antd';
import { Search, Filter, Plus } from 'lucide-react';
import { mockJobs } from '../../../data/mockData';

const { Title, Text } = Typography;

export default function JobPostingsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = theme.useToken();

  const filteredJobs = mockJobs.filter(job => {
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
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
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
      dataIndex: 'department',
      key: 'department',
      render: (text) => <span style={{ color: token.colorTextSecondary }}>{text || 'Engineering'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let dotColor = '#94a3b8';
        if (status === 'active') dotColor = '#10b981';
        if (status === 'draft') dotColor = '#f59e0b';
        if (status === 'closed') dotColor = '#94a3b8';

        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${token.colorBorder}`, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }}></span>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: token.colorText, letterSpacing: '0.025em' }}>{status}</span>
            {status === 'active' && <span style={{ fontSize: '12px', color: token.colorTextSecondary, backgroundColor: '#f1f5f9', padding: '0 6px', borderRadius: '4px', marginLeft: '4px' }}>12</span>}
          </div>
        );
      }
    },
    {
      title: 'Applicants',
      dataIndex: 'applicants',
      key: 'applicants',
      render: (applicants, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record.status === 'active' && record.id === '1' && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #10b981', color: '#10b981', fontWeight: 700, fontSize: '10px' }}>
                 92%
               </div>
               <span style={{ fontSize: '12px', color: token.colorTextSecondary, fontWeight: 500 }}>Match</span>
             </div>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', backgroundColor: applicants > 0 ? '#eef2ff' : '#f1f5f9', color: applicants > 0 ? token.colorPrimary : token.colorTextSecondary }}>
            {applicants}
          </span>
        </div>
      )
    },
    {
      title: 'Posted Date',
      dataIndex: 'postedAt',
      key: 'postedAt',
      render: (date, record) => <span style={{ color: token.colorTextSecondary }}>{record.status === 'draft' ? '--' : new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
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

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table 
          columns={columns} 
          dataSource={[
            { id: '1', title: 'Senior Software Engineer', department: 'Engineering', status: 'active', applicants: 42, postedAt: '2026-01-12', skills: ['React', 'Node.js', 'AWS'] },
            { id: '2', title: 'Product Designer', department: 'Design', status: 'active', applicants: 18, postedAt: '2026-02-04', skills: ['Figma', 'UI/UX'] },
            { id: '3', title: 'Director of Marketing', department: 'Marketing', status: 'draft', applicants: 0, postedAt: null, skills: [] },
            { id: '4', title: 'Data Scientist (NLP)', department: 'Data & AI', status: 'active', applicants: 85, postedAt: '2026-02-10', skills: ['Python', 'NLP', 'PyTorch'] },
            { id: '5', title: 'Customer Success Manager', department: 'Customer Success', status: 'closed', applicants: 120, postedAt: '2025-12-01', skills: [] },
            { id: '6', title: 'Financial Analyst', department: 'Finance', status: 'active', applicants: 12, postedAt: '2026-02-15', skills: [] },
            { id: '7', title: 'VP of Engineering', department: 'Engineering', status: 'draft', applicants: 0, postedAt: null, skills: [] },
            { id: '8', title: 'IT Support Specialist', department: 'IT Operations', status: 'closed', applicants: 205, postedAt: '2025-11-15', skills: [] },
          ]} 
          rowKey="id"
          pagination={{ 
            total: 8,
            showTotal: (total, range) => <span style={{ color: token.colorTextSecondary }}>Showing {range[0]} to {range[1]} of {total} results</span>,
            style: { padding: '16px 24px', borderTop: `1px solid ${token.colorBorder}`, margin: 0 }
          }}
          rowClassName={(record) => record.status === 'closed' ? "opacity-50" : ""}
        />
      </div>
    </div>
  );
}

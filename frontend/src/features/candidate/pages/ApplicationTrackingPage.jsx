import React, { useEffect, useState } from 'react';
import { Card, Progress, Typography, Space, theme, Spin, Empty, message } from 'antd';
import { candidateApi } from '../../../lib/api/candidate';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { Briefcase, CheckCircle2, Clock } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../../lib/constants';

const { Title, Text } = Typography;

export default function ApplicationTrackingPage() {
  const { token } = theme.useToken();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 'applied', label: 'Applied', status: APPLICATION_STATUSES.APPLIED },
    { id: 'screening', label: 'Screening', status: APPLICATION_STATUSES.SCREENING },
    { id: 'interview', label: 'Interview', status: APPLICATION_STATUSES.INTERVIEW },
    { id: 'offer', label: 'Offer', status: APPLICATION_STATUSES.OFFER },
    { id: 'hired', label: 'Hired', status: APPLICATION_STATUSES.HIRED },
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.status === status);

  useEffect(() => {
    candidateApi.getApplications()
      .then(setApplications)
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load applications.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Application Tracking</Title>
        <Text type="secondary">Monitor the status of your active job applications.</Text>
      </div>

      {/* Summary Card */}
      <Card bordered={false} style={{ borderLeft: `4px solid ${token.colorPrimary}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Progress type="dashboard" percent={applications.length ? 75 : 0} format={() => applications.length} size={64} strokeColor={token.colorPrimary} />
          <div>
            <Title level={5} style={{ margin: 0 }}>Active Pipeline</Title>
            <Text type="secondary">You have {applications.length} application{applications.length === 1 ? '' : 's'} in progress</Text>
          </div>
        </div>
      </Card>

      {applications.length === 0 ? (
        <Empty description="You haven't applied to any jobs yet" style={{ padding: '48px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {applications.map(app => {
            const currentStepIndex = getStepIndex(app.status);

            return (
              <Card key={app.id} bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: 0 }}>
                <div style={{ padding: '24px', borderBottom: `1px solid ${token.colorBorder}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${token.colorBorder}`, flexShrink: 0 }}>
                      <Briefcase size={24} color={token.colorTextSecondary} />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, fontWeight: 600 }}>{app.jobTitle}</Title>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{app.company}</Text>
                      <Space size={16} wrap>
                        <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}><Clock size={16} /> Applied on {new Date(app.createdAt).toLocaleDateString()}</Text>
                        <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>AI Match: {Math.round(app.matchScore)}%</Text>
                      </Space>
                    </div>
                  </div>
                </div>

                {/* Pipeline Tracker */}
                <div style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
                  {currentStepIndex === -1 ? (
                    <Text type="secondary">This application was rejected.</Text>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <div style={{ overflow: 'hidden', height: '8px', marginBottom: '16px', borderRadius: '4px', backgroundColor: '#e2e8f0', width: '100%', position: 'absolute', top: '16px', left: 0, zIndex: 0 }}>
                        <div style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`, height: '100%', backgroundColor: token.colorPrimary, transition: 'all 0.5s' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, width: '100%' }}>
                        {steps.map((step, index) => {
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          return (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: '#fff', border: `2px solid ${isCompleted ? token.colorPrimary : '#cbd5e1'}`,
                                transition: 'colors 0.3s',
                                boxShadow: isCurrent ? '0 0 0 4px #e0e7ff' : 'none'
                              }}>
                                {isCompleted ? (
                                  <CheckCircle2 size={20} color={token.colorPrimary} />
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>{index + 1}</span>
                                )}
                              </div>
                              <Text style={{ fontSize: '12px', fontWeight: 500, marginTop: '8px', color: isCompleted ? token.colorText : token.colorTextSecondary }}>
                                {step.label}
                              </Text>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {app.nextStep && (
                    <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                      <div style={{ marginTop: '4px' }}>
                        <div style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: token.colorPrimary, boxShadow: '0 0 0 4px #e0e7ff' }}></div>
                      </div>
                      <div>
                        <Text strong style={{ display: 'block', fontSize: '14px' }}>Next Action Required</Text>
                        <Text type="secondary" style={{ fontSize: '14px' }}>{app.nextStep}</Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Row, Col, Space, theme } from 'antd';
import { Calendar as CalendarIcon, Clock, Video, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

const { Title, Text } = Typography;

export default function InterviewSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { token } = theme.useToken();
  
  // Generate current week dates
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const interviews = [
    { id: 1, candidate: 'Sarah Jenkins', role: 'Senior Frontend Engineer', type: 'Technical Interview', time: '10:00 AM', duration: '60 min', date: new Date(), attendees: ['David Chen', 'Elena Rostova'] },
    { id: 2, candidate: 'Michael Chang', role: 'Frontend Developer', type: 'Culture Fit', time: '2:30 PM', duration: '45 min', date: new Date(), attendees: ['David Chen'] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Interviews</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage and schedule upcoming candidate interviews.</Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />}>
          Schedule Interview
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Calendar Sidebar */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Text strong>{format(selectedDate, 'MMMM yyyy')}</Text>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button type="text" size="small" icon={<ChevronLeft size={16} color={token.colorTextSecondary} />} onClick={() => setSelectedDate(addDays(selectedDate, -7))} />
                  <Button type="text" size="small" icon={<ChevronRight size={16} color={token.colorTextSecondary} />} onClick={() => setSelectedDate(addDays(selectedDate, 7))} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} style={{ fontSize: '12px', fontWeight: 500, color: token.colorTextSecondary, padding: '4px 0' }}>{day}</div>
                ))}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {weekDays.map((date, i) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        height: '40px', width: '100%', borderRadius: '9999px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
                        backgroundColor: isSelected ? token.colorPrimary : 'transparent',
                        color: isSelected ? '#fff' : (isToday ? token.colorPrimary : token.colorText),
                        fontWeight: isSelected || isToday ? 700 : 400,
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {format(date, 'd')}
                      {/* Show dot indicator for days with interviews */}
                      {(i === 0 || i === 2) && (
                        <span style={{ height: '4px', width: '4px', borderRadius: '50%', marginTop: '2px', backgroundColor: isSelected ? '#fff' : '#4f46e5' }}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card bordered={false} style={{ backgroundColor: '#eef2ff', borderRadius: '12px', border: '1px solid #c7d2fe' }} bodyStyle={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CalendarIcon size={16} color={token.colorPrimary} />
                <Text strong style={{ color: token.colorPrimary }}>Sync Calendar</Text>
              </div>
              <Text style={{ fontSize: '14px', color: '#4338ca', display: 'block', marginBottom: '16px' }}>Connect your Google Calendar or Outlook to sync availability automatically.</Text>
              <Button block style={{ backgroundColor: '#fff', border: '1px solid #c7d2fe' }}>Connect Calendar</Button>
            </Card>
          </div>
        </Col>

        {/* Schedule View */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              Schedule for {format(selectedDate, 'EEEE, MMMM d')}
            </Title>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviews.length > 0 ? (
                interviews.map(interview => (
                  <Card key={interview.id} hoverable bordered={false} style={{ borderLeft: `4px solid ${token.colorPrimary}`, borderRadius: '12px', borderTop: `1px solid ${token.colorBorder}`, borderRight: `1px solid ${token.colorBorder}`, borderBottom: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', minWidth: '80px', border: `1px solid ${token.colorBorder}` }}>
                            <Text strong style={{ fontSize: '18px' }}>{interview.time.split(' ')[0]}</Text>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>{interview.time.split(' ')[1]}</Text>
                          </div>
                          
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <Title level={5} style={{ margin: 0 }}>{interview.candidate}</Title>
                              <Tag color="blue" style={{ margin: 0 }}>{interview.type}</Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>{interview.role}</Text>
                            <Space size={16} wrap style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {interview.duration}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {interview.attendees.length} Attendees</span>
                            </Space>
                          </div>
                        </div>
                        
                        <div>
                          <Button icon={<Video size={16} />}>Join Call</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#fff', borderRadius: '12px', border: `1px dashed ${token.colorBorder}` }}>
                  <div style={{ backgroundColor: '#f8fafc', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <CalendarIcon size={24} color={token.colorTextSecondary} />
                  </div>
                  <Text strong style={{ display: 'block' }}>No interviews scheduled</Text>
                  <Text type="secondary" style={{ fontSize: '14px', marginTop: '4px' }}>You have a clear day today.</Text>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

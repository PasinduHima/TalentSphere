import React, { useState } from 'react';
import { Input, Button, Badge, Layout, Typography, theme, Avatar } from 'antd';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const { token } = theme.useToken();

  const contacts = [
    { id: 1, name: 'David Chen', role: 'Technical Recruiter', company: 'Acme Corp', avatar: 'https://i.pravatar.cc/150?u=david', unread: 2, lastMessage: 'Great, I will send over the calendar invite shortly.', time: '10:42 AM' },
    { id: 2, name: 'Elena Rostova', role: 'Hiring Manager', company: 'FinTrust', avatar: 'https://i.pravatar.cc/150?u=elena', unread: 0, lastMessage: 'Thank you for your time today.', time: 'Yesterday' },
    { id: 3, name: 'System', role: 'TalentSphere AI', company: '', avatar: null, unread: 0, lastMessage: 'Your application for Product Manager has been updated.', time: 'Mon' },
  ];

  const chatHistory = [
    { id: 1, sender: 'David Chen', text: 'Hi Sarah, thanks for applying to the Senior Frontend Engineer role at Acme Corp. Your background looks great!', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Sarah', text: 'Hi David, thank you! I am very excited about the opportunity.', time: '10:35 AM', isMe: true },
    { id: 3, sender: 'David Chen', text: 'Are you available for a quick 15-minute chat tomorrow anytime between 1-3 PM PST?', time: '10:38 AM', isMe: false },
    { id: 4, sender: 'Sarah', text: 'Yes, 2:00 PM PST works perfectly for me.', time: '10:40 AM', isMe: true },
    { id: 5, sender: 'David Chen', text: 'Great, I will send over the calendar invite shortly.', time: '10:42 AM', isMe: false },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <Layout style={{ height: 'calc(100vh - 150px)', backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, overflow: 'hidden' }}>
      {/* Sidebar - Contacts */}
      <Sider width={320} theme="light" style={{ borderRight: `1px solid ${token.colorBorder}` }} breakpoint="md" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}` }}>
            <Input 
              prefix={<Search size={16} color={token.colorTextSecondary} />} 
              placeholder="Search messages..." 
              style={{ backgroundColor: '#f8fafc', border: 'none', borderRadius: '8px' }}
              size="large"
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map(contact => {
              const isActive = activeChat === contact.id;
              return (
                <div 
                  key={contact.id}
                  onClick={() => setActiveChat(contact.id)}
                  style={{
                    padding: '16px',
                    borderBottom: `1px solid ${token.colorBorder}`,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#eef2ff' : '#fff',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div>
                    <Badge count={contact.unread} offset={[-4, 4]}>
                      {contact.avatar ? (
                        <Avatar src={contact.avatar} size={40} />
                      ) : (
                        <Avatar style={{ backgroundColor: '#e0e7ff', color: token.colorPrimary, fontWeight: 'bold' }} size={40}>TS</Avatar>
                      )}
                    </Badge>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <Text strong style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.name}</Text>
                      <Text type="secondary" style={{ fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>{contact.time}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.company || contact.role}</Text>
                    <Text style={{ fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px', fontWeight: contact.unread > 0 ? 500 : 400, color: contact.unread > 0 ? token.colorText : token.colorTextSecondary }}>
                      {contact.lastMessage}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Sider>

      {/* Main Chat Area */}
      <Content style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {/* Chat Header */}
        <div style={{ height: '64px', borderBottom: `1px solid ${token.colorBorder}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar src={contacts[0].avatar} size={40} />
            <div>
              <Text strong style={{ display: 'block', fontSize: '14px' }}>{contacts[0].name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{contacts[0].role} at {contacts[0].company}</Text>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button type="text" icon={<Phone size={20} color={token.colorTextSecondary} />} />
            <Button type="text" icon={<Video size={20} color={token.colorTextSecondary} />} />
            <Button type="text" icon={<MoreVertical size={20} color={token.colorTextSecondary} />} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#f8fafc' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: token.colorTextSecondary, backgroundColor: '#e2e8f0', padding: '4px 12px', borderRadius: '9999px' }}>
              Today, July 11
            </span>
          </div>
          
          {chatHistory.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', maxWidth: '80%', alignSelf: msg.isMe ? 'flex-end' : 'flex-start' }}>
              {!msg.isMe && (
                <Avatar src={contacts[0].avatar} size={32} style={{ marginRight: '12px', flexShrink: 0, alignSelf: 'flex-end', marginBottom: '20px' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: msg.isMe ? token.colorPrimary : '#fff',
                  color: msg.isMe ? '#fff' : token.colorText,
                  border: msg.isMe ? 'none' : `1px solid ${token.colorBorder}`,
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.isMe ? '4px' : '16px',
                  borderBottomLeftRadius: msg.isMe ? '16px' : '4px',
                }}>
                  <span style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.text}</span>
                </div>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>{msg.time}</Text>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div style={{ padding: '16px', backgroundColor: '#fff', borderTop: `1px solid ${token.colorBorder}`, flexShrink: 0 }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ borderRadius: '8px', resize: 'none' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              disabled={!message.trim()}
              icon={<Send size={16} />}
            />
          </form>
        </div>
      </Content>
    </Layout>
  );
}

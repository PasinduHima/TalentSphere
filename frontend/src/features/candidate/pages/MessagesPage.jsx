import React, { useState } from 'react';
import { Input, Button, Badge, Layout, Typography, theme, Avatar } from 'antd';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const CONTACTS = [
  { id: 1, name: 'David Chen', role: 'Technical Recruiter', company: 'Acme Corp', avatar: 'https://i.pravatar.cc/150?u=david', unread: 2, lastMessage: 'Great, I will send over the calendar invite shortly.', time: '10:42 AM', online: true },
  { id: 2, name: 'Elena Rostova', role: 'Hiring Manager', company: 'FinTrust', avatar: 'https://i.pravatar.cc/150?u=elena', unread: 0, lastMessage: 'Thank you for your time today. We were really impressed.', time: 'Yesterday', online: false },
  { id: 3, name: 'Marcus Johnson', role: 'Senior Recruiter', company: 'CloudNova', avatar: 'https://i.pravatar.cc/150?u=marcus', unread: 1, lastMessage: 'We have an exciting DevOps position that might interest you.', time: 'Yesterday', online: true },
  { id: 4, name: 'Priya Sharma', role: 'HR Director', company: 'BrightPath', avatar: 'https://i.pravatar.cc/150?u=priya-s', unread: 0, lastMessage: 'Your offer letter has been sent to your email.', time: 'Mon', online: false },
  { id: 5, name: 'System', role: 'TalentSphere AI', company: '', avatar: null, unread: 0, lastMessage: 'Your application for Product Manager has been updated.', time: 'Sun', online: true },
];

const CHAT_HISTORIES = {
  1: [
    { id: 1, sender: 'David Chen', text: 'Hi Sarah, thanks for applying to the Senior Frontend Engineer role at Acme Corp. Your background looks great!', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Sarah', text: 'Hi David, thank you! I am very excited about the opportunity. The tech stack aligns perfectly with my experience.', time: '10:35 AM', isMe: true },
    { id: 3, sender: 'David Chen', text: 'That is great to hear! Are you available for a quick 15-minute chat tomorrow anytime between 1-3 PM PST?', time: '10:38 AM', isMe: false },
    { id: 4, sender: 'Sarah', text: 'Yes, 2:00 PM PST works perfectly for me. Should I prepare anything specific?', time: '10:40 AM', isMe: true },
    { id: 5, sender: 'David Chen', text: 'Great, I will send over the calendar invite shortly.', time: '10:42 AM', isMe: false },
  ],
  2: [
    { id: 1, sender: 'Elena Rostova', text: 'Hello! I wanted to personally reach out about your application for the Full Stack Developer role.', time: '3:00 PM', isMe: false },
    { id: 2, sender: 'Sarah', text: 'Hi Elena! Thank you so much for reaching out. I would love to learn more about the role.', time: '3:10 PM', isMe: true },
    { id: 3, sender: 'Elena Rostova', text: 'We were really impressed with your portfolio. Would you be open to a technical interview next week?', time: '3:15 PM', isMe: false },
    { id: 4, sender: 'Sarah', text: 'Absolutely! I am available Monday through Wednesday.', time: '3:20 PM', isMe: true },
    { id: 5, sender: 'Elena Rostova', text: 'Thank you for your time today. We were really impressed.', time: '4:00 PM', isMe: false },
  ],
  3: [
    { id: 1, sender: 'Marcus Johnson', text: 'Hi Sarah! I came across your profile and was really impressed by your cloud infrastructure experience.', time: '11:00 AM', isMe: false },
    { id: 2, sender: 'Sarah', text: 'Thanks Marcus! I have been focused on cloud-native architectures for the past 3 years.', time: '11:15 AM', isMe: true },
    { id: 3, sender: 'Marcus Johnson', text: 'We have an exciting DevOps position that might interest you.', time: '11:20 AM', isMe: false },
  ],
  4: [
    { id: 1, sender: 'Priya Sharma', text: 'Congratulations Sarah! The team loved your interviews and we would like to extend an offer.', time: '9:00 AM', isMe: false },
    { id: 2, sender: 'Sarah', text: 'That is wonderful news! Thank you so much!', time: '9:15 AM', isMe: true },
    { id: 3, sender: 'Priya Sharma', text: 'Your offer letter has been sent to your email.', time: '9:30 AM', isMe: false },
  ],
  5: [
    { id: 1, sender: 'System', text: '🎉 Congratulations! Your profile completeness reached 78%. Keep adding skills to improve your match scores.', time: '8:00 AM', isMe: false },
    { id: 2, sender: 'System', text: '📋 Your application for Product Manager at DesignForge has moved to the "Screening" stage.', time: '12:00 PM', isMe: false },
    { id: 3, sender: 'System', text: '🔔 New job recommendation: "Frontend Architect" at FinVault (92% match). Check it out!', time: '2:00 PM', isMe: false },
  ],
};

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const { token } = theme.useToken();

  const activeContact = CONTACTS.find(c => c.id === activeChat) || CONTACTS[0];
  const chatHistory = CHAT_HISTORIES[activeChat] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <Layout style={{ height: 'calc(100vh - 150px)', backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, overflow: 'hidden' }}>
      {/* Sidebar - Contacts */}
      <Sider width={340} theme="light" style={{ borderRight: `1px solid ${token.colorBorder}` }} breakpoint="md" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}` }}>
            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '12px' }}>Messages</Text>
            <Input 
              prefix={<Search size={16} color={token.colorTextSecondary} />} 
              placeholder="Search messages..." 
              style={{ backgroundColor: '#f8fafc', border: 'none', borderRadius: '8px' }}
              size="large"
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {CONTACTS.map(contact => {
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
                  <div style={{ position: 'relative' }}>
                    <Badge count={contact.unread} offset={[-4, 4]}>
                      {contact.avatar ? (
                        <Avatar src={contact.avatar} size={40} />
                      ) : (
                        <Avatar style={{ backgroundColor: '#e0e7ff', color: token.colorPrimary, fontWeight: 'bold' }} size={40}>TS</Avatar>
                      )}
                    </Badge>
                    {contact.online && (
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', border: '2px solid #fff' }} />
                    )}
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
            {activeContact.avatar ? (
              <Avatar src={activeContact.avatar} size={40} />
            ) : (
              <Avatar style={{ backgroundColor: '#e0e7ff', color: token.colorPrimary, fontWeight: 'bold' }} size={40}>TS</Avatar>
            )}
            <div>
              <Text strong style={{ display: 'block', fontSize: '14px' }}>{activeContact.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {activeContact.online ? <span style={{ color: '#22c55e' }}>● Online</span> : <span>● Offline</span>}
                {activeContact.company ? ` · ${activeContact.role} at ${activeContact.company}` : ` · ${activeContact.role}`}
              </Text>
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
              Today, July 22
            </span>
          </div>
          
          {chatHistory.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', maxWidth: '80%', alignSelf: msg.isMe ? 'flex-end' : 'flex-start' }}>
              {!msg.isMe && activeContact.avatar && (
                <Avatar src={activeContact.avatar} size={32} style={{ marginRight: '12px', flexShrink: 0, alignSelf: 'flex-end', marginBottom: '20px' }} />
              )}
              {!msg.isMe && !activeContact.avatar && (
                <Avatar style={{ backgroundColor: '#e0e7ff', color: token.colorPrimary, fontWeight: 'bold', marginRight: '12px', flexShrink: 0, alignSelf: 'flex-end', marginBottom: '20px' }} size={32}>TS</Avatar>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: msg.isMe ? token.colorPrimary : '#fff',
                  color: msg.isMe ? '#fff' : token.colorText,
                  border: msg.isMe ? 'none' : `1px solid ${token.colorBorder}`,
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.isMe ? '4px' : '16px',
                  borderBottomLeftRadius: msg.isMe ? '16px' : '4px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
            <Button type="text" icon={<Paperclip size={18} color={token.colorTextSecondary} />} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <TextArea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
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
            <Button type="text" icon={<Smile size={18} color={token.colorTextSecondary} />} style={{ flexShrink: 0 }} />
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              disabled={!messageText.trim()}
              icon={<Send size={16} />}
            />
          </form>
        </div>
      </Content>
    </Layout>
  );
}

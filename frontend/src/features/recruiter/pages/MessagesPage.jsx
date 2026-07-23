import React, { useState } from 'react';
import { Input, Button, Badge, Layout, Typography, theme, Avatar } from 'antd';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const CONTACTS = [
  { id: 1, name: 'Sarah Mitchell', role: 'Senior Frontend Engineer', company: 'Applied — Acme Corp', avatar: 'https://i.pravatar.cc/150?u=sarah-m', unread: 3, lastMessage: 'Thank you! I have attached my updated portfolio as requested.', time: '11:15 AM' },
  { id: 2, name: 'James Rodriguez', role: 'Backend Developer', company: 'Applied — FinVault', avatar: 'https://i.pravatar.cc/150?u=james-r', unread: 0, lastMessage: 'Sounds great, Tuesday at 2 PM works for me.', time: '9:30 AM' },
  { id: 3, name: 'Emily Chen', role: 'Product Designer', company: 'Applied — BrightPath', avatar: 'https://i.pravatar.cc/150?u=emily-c', unread: 1, lastMessage: 'Could you send me the Figma link for the design challenge?', time: 'Yesterday' },
  { id: 4, name: 'Michael Okafor', role: 'DevOps Engineer', company: 'Applied — CloudNova', avatar: 'https://i.pravatar.cc/150?u=michael-o', unread: 0, lastMessage: 'I have 5 years of experience with Kubernetes.', time: 'Mon' },
  { id: 5, name: 'System', role: 'TalentSphere AI', company: '', avatar: null, unread: 0, lastMessage: 'New application received for Product Designer role.', time: 'Sun' },
];

const CHAT_HISTORIES = {
  1: [
    { id: 1, sender: 'You', text: 'Hi Sarah, thanks for applying to the Senior Frontend Engineer role. Your portfolio is impressive!', time: '10:45 AM', isMe: true },
    { id: 2, sender: 'Sarah Mitchell', text: 'Thank you so much! I have been following your company for a while and love the product direction.', time: '10:52 AM', isMe: false },
    { id: 3, sender: 'You', text: 'Great to hear! Could you share an updated portfolio with your most recent React work? We would like to review it before the technical interview.', time: '11:00 AM', isMe: true },
    { id: 4, sender: 'Sarah Mitchell', text: 'Of course! Give me a moment to compile the latest projects.', time: '11:08 AM', isMe: false },
    { id: 5, sender: 'Sarah Mitchell', text: 'Thank you! I have attached my updated portfolio as requested.', time: '11:15 AM', isMe: false },
  ],
  2: [
    { id: 1, sender: 'You', text: 'Hi James, we would like to schedule a technical interview for the Backend Developer position. Are you available next week?', time: '9:00 AM', isMe: true },
    { id: 2, sender: 'James Rodriguez', text: 'Hi! Yes, I am available Tuesday through Thursday. What times work for you?', time: '9:15 AM', isMe: false },
    { id: 3, sender: 'You', text: 'How about Tuesday at 2 PM PST? It would be a 60-minute session with our lead architect.', time: '9:22 AM', isMe: true },
    { id: 4, sender: 'James Rodriguez', text: 'Sounds great, Tuesday at 2 PM works for me.', time: '9:30 AM', isMe: false },
  ],
  3: [
    { id: 1, sender: 'Emily Chen', text: 'Hi, I just submitted my application for the Product Designer role. I am really excited about this opportunity!', time: '3:00 PM', isMe: false },
    { id: 2, sender: 'You', text: 'Welcome Emily! We have a design challenge as part of our process. I will send you the details shortly.', time: '3:15 PM', isMe: true },
    { id: 3, sender: 'Emily Chen', text: 'Could you send me the Figma link for the design challenge?', time: '3:30 PM', isMe: false },
  ],
  4: [
    { id: 1, sender: 'You', text: 'Hi Michael, your background in DevOps looks strong. Can you tell me more about your Kubernetes experience?', time: '2:00 PM', isMe: true },
    { id: 2, sender: 'Michael Okafor', text: 'I have 5 years of experience with Kubernetes.', time: '2:20 PM', isMe: false },
  ],
  5: [
    { id: 1, sender: 'System', text: 'New application received for Product Designer role.', time: '12:00 PM', isMe: false },
  ],
};

export default function RecruiterMessagesPage() {
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
              placeholder="Search conversations..."
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
                    gap: '12px',
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
            {activeContact.avatar ? (
              <Avatar src={activeContact.avatar} size={40} />
            ) : (
              <Avatar style={{ backgroundColor: '#e0e7ff', color: token.colorPrimary, fontWeight: 'bold' }} size={40}>TS</Avatar>
            )}
            <div>
              <Text strong style={{ display: 'block', fontSize: '14px' }}>{activeContact.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{activeContact.role}{activeContact.company ? ` · ${activeContact.company}` : ''}</Text>
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

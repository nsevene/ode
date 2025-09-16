import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message: string;
  sender_type: string;
  created_at: string;
  sender_id?: string;
  chat_id?: string;
  read_at?: string;
}

interface Chat {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
}

export const SupportChat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', subject: '' });
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentChat) return;

    const channel = supabase
      .channel(`chat-${currentChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${currentChat.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChat]);

  const loadExistingChat = async () => {
    if (!user) return;

    const { data: chats } = await supabase
      .from('support_chats')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1);

    if (chats && chats.length > 0) {
      setCurrentChat(chats[0]);
      loadMessages(chats[0].id);
    }
  };

  const loadMessages = async (chatId: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const createNewChat = async () => {
    setIsCreatingChat(true);

    try {
      let chatData;
      
      if (user) {
        chatData = {
          user_id: user.id,
          subject: 'General Support',
          status: 'open',
          priority: 'normal'
        };
      } else {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.subject) {
          toast({
            title: 'Required Fields',
            description: 'Please fill in all fields to start a chat.',
            variant: 'destructive'
          });
          setIsCreatingChat(false);
          return;
        }

        chatData = {
          guest_name: guestInfo.name,
          guest_email: guestInfo.email,
          subject: guestInfo.subject,
          status: 'open',
          priority: 'normal'
        };
      }

      const { data: chat, error } = await supabase
        .from('support_chats')
        .insert(chatData)
        .select()
        .single();

      if (error) throw error;

      setCurrentChat(chat);
      
      // Send welcome message
      await supabase.from('support_messages').insert({
        chat_id: chat.id,
        sender_type: 'system',
        message: `Chat started. We'll respond as soon as possible. Chat ID: ${chat.id.slice(-8)}`
      });

      toast({
        title: 'Chat Started',
        description: 'Your support chat has been created successfully.'
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    try {
      await supabase.from('support_messages').insert({
        chat_id: currentChat.id,
        sender_type: 'user',
        sender_id: user?.id,
        message: newMessage.trim()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const openChat = async () => {
    setIsOpen(true);
    setIsMinimized(false);
    
    if (user) {
      await loadExistingChat();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={openChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Support Chat</span>
          {currentChat && (
            <Badge variant={currentChat.status === 'open' ? 'default' : 'secondary'}>
              {currentChat.status}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Content */}
          <div className="flex-1 flex flex-col">
            {!currentChat ? (
              <div className="p-4 space-y-4">
                <h3 className="font-medium">Start a new chat</h3>
                {!user && (
                  <>
                    <Input
                      placeholder="Your name"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      placeholder="Subject"
                      value={guestInfo.subject}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </>
                )}
                <Button 
                  onClick={createNewChat} 
                  disabled={isCreatingChat}
                  className="w-full"
                >
                  {isCreatingChat ? 'Creating...' : 'Start Chat'}
                </Button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 text-sm ${
                          message.sender_type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.sender_type === 'system'
                            ? 'bg-muted text-muted-foreground text-center'
                            : 'bg-muted'
                        }`}
                      >
                        {message.message}
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
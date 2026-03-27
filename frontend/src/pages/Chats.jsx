import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatAPI, connectionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Send,
  Search,
  MoreVertical,
  Info,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Zap,
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';

export default function Chats() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadConversations(true);
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
      // On mobile, close sidebar when chat opens
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }
  }, [activeChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations();
      if (activeChat) {
        loadMessages(activeChat.id);
      }
    }, 5000); // Poll every 5 seconds for "real-time" feel without StompJS overhead
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(scrollToBottom, [messages]);

  const loadConversations = async (checkParam = false) => {
    try {
      const response = await chatAPI.getChats();
      const chats = response.data;
      setConversations(chats);

      if (checkParam && userIdParam) {
        const existingChat = chats.find(c =>
          c.user1Id === parseInt(userIdParam) || c.user2Id === parseInt(userIdParam)
        );

        if (existingChat) {
          setActiveChat(existingChat);
          // Clear param to avoid re-triggering
          setSearchParams({}, { replace: true });
        } else {
          // Attempt to create/request a new chat
          try {
            const newChatRes = await chatAPI.requestChat(parseInt(userIdParam));
            const newChat = newChatRes.data;
            setConversations(prev => [newChat, ...prev]);
            setActiveChat(newChat);
            setSearchParams({}, { replace: true });
          } catch (err) {
            console.error('Failed to initiate chat:', err.response?.data?.error || err.message);
            toast.error(err.response?.data?.error || 'Failed to start conversation');
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await chatAPI.getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await chatAPI.sendMessage(activeChat.id, newMessage);
      setMessages([...messages, {
        id: Date.now(),
        content: newMessage,
        senderId: user.id,
        createdAt: new Date().toISOString()
      }]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-140px)] flex items-center justify-center animate-pulse">
      <MessageSquare size={100} className="text-secondary-100" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-120px)] -m-6 flex overflow-hidden bg-white">
      {/* Conversations Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? (window.innerWidth < 1024 ? '100%' : '400px') : '0px' }}
        className={`bg-secondary-50 border-r border-secondary-200/50 flex flex-col z-30 transition-all ${!isSidebarOpen && 'invisible lg:visible lg:w-0'}`}
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Messages</h1>
            <div className="p-2.5 bg-white border border-secondary-200 rounded-2xl shadow-sm cursor-pointer hover:bg-primary-50 hover:text-primary-600 transition-all">
              <MoreVertical size={20} />
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-hide">
          {conversations.map(chat => (
            <motion.div
              key={chat.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveChat(chat)}
              className={`p-4 rounded-[24px] cursor-pointer transition-all flex items-center gap-4 group ${activeChat?.id === chat.id
                ? 'bg-white shadow-premium border border-primary-100 ring-1 ring-primary-500/5'
                : 'hover:bg-white/60 border border-transparent'
                }`}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-secondary-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white">
                  {(chat.user1Id === user.id ? chat.user2Name : chat.user1Name)?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-black text-secondary-900 truncate tracking-tight group-hover:text-primary-600 transition-colors">
                    {chat.user1Id === user.id ? chat.user2Name : chat.user1Name}
                  </h3>
                  <span className="text-[10px] font-bold text-secondary-400 uppercase">
                    {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                </div>
                <p className="text-sm font-medium text-secondary-500 truncate">{chat.lastMessage?.content || 'Start a new conversation...'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        {
          activeChat ? (
            <>
              {/* Chat Header */}
              <header className="h-24 px-8 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-secondary-50 rounded-xl mr-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                    {(activeChat.user1Id === user.id ? activeChat.user2Name : activeChat.user1Name)?.[0] || 'U'}
                  </div>
                  <div>
                    <h2 className="font-black text-secondary-900 tracking-tight leading-none group flex items-center gap-1.5">
                      {activeChat.user1Id === user.id ? activeChat.user2Name : activeChat.user1Name}
                      <Sparkles size={14} className="text-amber-500" />
                    </h2>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <HeaderAction icon={Info} />
                </div>
              </header >

              {/* Messages Container */}
              < div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-secondary-50/30" >
                <div className="text-center py-10">
                  <Badge className="bg-white px-4 py-1 self-center border-secondary-100 text-secondary-400 text-[10px] font-black">START OF ENCRYPTED CONVERSATION</Badge>
                </div>

                {
                  messages.map((msg, idx) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.05 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] space-y-2`}>
                          <div className={`p-5 rounded-[30px] font-medium shadow-sm leading-relaxed ${isMe
                            ? 'bg-primary-600 text-white rounded-br-none shadow-primary-500/20'
                            : 'bg-white text-secondary-900 rounded-bl-none border border-secondary-100'
                            }`}>
                            {msg.content}
                          </div>
                          <p className={`text-[10px] font-bold text-secondary-400 uppercase tracking-tighter px-2 ${isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                }
                <div ref={messagesEndRef} />
              </div >

              {/* Input Area */}
              <footer className="p-6 bg-white border-t border-secondary-100">
                {activeChat.status === 'ACCEPTED' ? (
                  <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-4 bg-secondary-50 p-2 rounded-[32px] border border-secondary-200 focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:bg-white transition-all group">
                    <input
                      type="text"
                      placeholder="Draft a message..."
                      className="flex-1 bg-transparent px-6 py-3 border-none outline-none font-medium placeholder:text-secondary-400"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="h-12 w-12 p-0 rounded-2xl shrink-0 group-focus-within:scale-105 transition-transform"
                    >
                      <Send size={20} className="ml-1" />
                    </Button>
                  </form>
                ) : (
                  <div className="max-w-4xl mx-auto p-4 bg-secondary-50 rounded-2xl border border-secondary-200 text-center">
                    <p className="text-secondary-500 font-medium flex items-center justify-center gap-2">
                      <AlertCircle size={18} className="text-amber-500" />
                      Waiting for the other participant to accept the chat request...
                    </p>
                  </div>
                )}
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-secondary-50/20">
              <div className="w-24 h-24 bg-white rounded-[32px] shadow-glass flex items-center justify-center text-primary-600 mb-8 animate-float">
                <MessageSquare size={44} />
              </div>
              <h2 className="text-3xl font-black text-secondary-900 tracking-tighter mb-4">Secure Messaging</h2>
              <p className="text-secondary-500 font-medium max-w-sm mb-10 leading-relaxed">
                Select a professional from your network to start or continue a conversation.
              </p>
              <Button variant="outline" className="rounded-2xl h-14 px-8 border-secondary-200">
                Network Guidelines
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )
        }
      </main >
    </div >
  );
}

const HeaderAction = ({ icon: Icon }) => (
  <button className="p-3 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
    <Icon size={20} />
  </button>
);

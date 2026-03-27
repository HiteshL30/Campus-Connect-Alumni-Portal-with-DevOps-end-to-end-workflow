import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectionAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
  Users,
  UserPlus,
  UserCheck,
  MessageSquare,
  Trash2,
  Clock,
  Search,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Link as LinkIcon
} from 'lucide-react';

export default function Connections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [connRes, pendRes] = await Promise.all([
        connectionAPI.getMyConnections(),
        connectionAPI.getPendingRequests()
      ]);
      setConnections(connRes.data);
      setPendingRequests(pendRes.data);
    } catch (error) {
      toast.error('Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await connectionAPI.acceptRequest(requestId);
      toast.success('Connection confirmed!');
      loadData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleRemove = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    try {
      await connectionAPI.removeConnection(connectionId);
      toast.success('Connection removed');
      loadData();
    } catch (error) {
      toast.error('Failed to remove connection');
    }
  };

  const tabs = [
    { id: 'connections', name: 'My Network', icon: Users, count: connections.length },
    { id: 'pending', name: 'Requests', icon: Clock, count: pendingRequests.length },
  ];

  if (loading) return (
    <div className="space-y-8 animate-pulse p-2">
      <div className="h-10 w-64 bg-secondary-100 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-secondary-100 rounded-[32px]" />)}
      </div>
    </div>
  );

  return (
    <AnimatedPage className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-secondary-200/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100/50 rounded-xl">
              <LinkIcon className="text-primary-600" size={20} />
            </div>
            <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Network</span>
          </div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">My Connections</h1>
          <p className="text-lg text-secondary-500 font-medium">Management and growth of your professional circle.</p>
        </div>
      </header>

      <div className="flex p-1.5 bg-secondary-100/80 backdrop-blur-sm rounded-[24px] w-fit shadow-inner-glow">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-[20px] text-sm font-black transition-all relative ${activeTab === tab.id
              ? 'bg-white text-secondary-900 shadow-premium'
              : 'text-secondary-400 hover:text-secondary-600'
              }`}
          >
            <tab.icon size={18} />
            {tab.name}
            {tab.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-black rounded-lg ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-500'
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'connections' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {connections.length > 0 ? connections.map((conn, idx) => (
            <ConnectionCard
              key={conn.id}
              person={conn}
              delay={idx * 0.05}
              onMessage={() => navigate(`/chats?userId=${conn.connectedWithId}`)}
              onRemove={() => handleRemove(conn.id)}
            />
          )) : (
            <EmptyResults message="Your professional network is waiting to be built." />
          )}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pendingRequests.length > 0 ? pendingRequests.map((req, idx) => (
            <PendingCard key={req.id} request={req} onAccept={() => handleAccept(req.id)} delay={idx * 0.05} />
          )) : (
            <EmptyResults message="No new connection requests at the moment." />
          )}
        </section>
      )}
    </AnimatedPage>
  );
}

const ConnectionCard = ({ person, delay, onMessage, onRemove }) => {
  const navigate = useNavigate();
  return (
    <Card key={person.id} delay={delay} className="p-6 flex items-center gap-6 group border-secondary-100" hover={true}>
      <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">
        {person.connectedWithFirstName?.[0]}{person.connectedWithLastName?.[0]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-black text-secondary-900 truncate tracking-tight">{person.connectedWithFirstName} {person.connectedWithLastName}</h3>
        <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mt-1">Verified Professional</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/profile/${person.connectedWithId}`)}
          className="p-3 bg-secondary-50 hover:bg-emerald-50 text-secondary-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm"
          title="View Profile"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={onMessage}
          className="p-3 bg-secondary-50 hover:bg-primary-50 text-secondary-400 hover:text-primary-600 rounded-xl transition-all shadow-sm"
          title="Send Message"
        >
          <MessageSquare size={18} />
        </button>
        <button
          onClick={onRemove}
          className="p-3 bg-secondary-50 hover:bg-red-50 text-secondary-400 hover:text-red-600 rounded-xl transition-all shadow-sm"
          title="Remove Connection"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
};

const PendingCard = ({ request, onAccept, delay }) => (
  <Card key={request.id} delay={delay} className="p-0 overflow-hidden flex flex-col group border-amber-100/50 bg-amber-50/5" hover={true}>
    <div className="p-6 flex items-center gap-5">
      <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
        {request.senderFirstName?.[0]}{request.senderLastName?.[0]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-black text-secondary-900 truncate tracking-tight">{request.senderFirstName} {request.senderLastName}</h3>
        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">Incoming Request</p>
      </div>
    </div>
    <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100 flex gap-4 mt-auto">
      <Button
        onClick={onAccept}
        className="flex-1 h-12 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-500/20 text-xs font-black"
      >
        <Check size={16} className="mr-2" /> ACCEPT
      </Button>
      <button className="p-3 bg-white text-secondary-400 hover:text-red-500 hover:bg-red-50 border border-secondary-100 rounded-xl transition-all">
        <X size={18} />
      </button>
    </div>
  </Card>
);

const EmptyResults = ({ message }) => (
  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center text-secondary-200">
      <Sparkles size={40} />
    </div>
    <div>
      <h3 className="text-xl font-black text-secondary-900">Networking Oasis</h3>
      <p className="text-secondary-500 font-medium max-w-sm mt-2">{message}</p>
    </div>
    <Button variant="ghost" className="font-black text-sm text-primary-600 mt-4">
      Discover Alumni <ArrowRight size={16} className="ml-2" />
    </Button>
  </div>
);

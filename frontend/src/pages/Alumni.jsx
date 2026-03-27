import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { alumniAPI, connectionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
  Users,
  Search,
  MapPin,
  Building2,
  UserPlus,
  Mail,
  Linkedin,
  Filter,
  Check,
  ChevronRight,
  Sparkles,
  Eye,
  Globe
} from 'lucide-react';

export default function Alumni() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    loadAlumni();
    loadMyConnections();
  }, []);

  useEffect(() => {
    const term = searchParams.get('search');
    if (term !== null) {
      setSearchTerm(term);
    }
  }, [searchParams]);

  const loadAlumni = async () => {
    try {
      const response = await alumniAPI.getAll();
      setAlumni(response.data);
    } catch (error) {
      toast.error('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  const loadMyConnections = async () => {
    try {
      const response = await connectionAPI.getMyConnections();
      const connections = response.data; // Already handled by api.js .then
      const sent = new Set(connections.map(c => c.connectedWithId));
      setSentRequests(sent);
    } catch (error) {
      console.error('Failed to load connections status');
    }
  };

  const handleConnect = async (alumniId) => {
    try {
      await connectionAPI.sendRequest(alumniId);
      toast.success('Connection request sent!');
      setSentRequests(prev => new Set(prev).add(alumniId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const filteredAlumni = alumni.filter(person => {
    const isLinked = sentRequests.has(person.id);
    if (isLinked) return false;

    return (
      person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return (
    <div className="space-y-8 animate-pulse p-2">
      <div className="h-10 w-48 bg-secondary-100 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-72 bg-secondary-100 rounded-[32px]" />)}
      </div>
    </div>
  );

  return (
    <AnimatedPage className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-secondary-200/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/50 rounded-xl">
              <Globe className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">Global Network</span>
          </div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Directory</h1>
          <p className="text-lg text-secondary-500 font-medium">Connect with professionals from your Alma Mater.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name, company, or degree..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium shadow-soft"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl border-secondary-200">
          <Filter size={18} className="mr-2" />
          Advanced Filters
        </Button>
      </div>

      {filteredAlumni.length === 0 ? (
        <Card className="py-24 text-center border-dashed" hover={false}>
          <Users size={48} className="mx-auto text-secondary-200 mb-6" />
          <p className="text-secondary-500 font-black">No alumni found matching your criteria</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredAlumni.map((person, idx) => (
            <AlumniCard
              key={person.id}
              person={person}
              isSent={sentRequests.has(person.id)}
              onConnect={() => handleConnect(person.id)}
              delay={idx * 0.05}
            />
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}

const AlumniCard = ({ person, isSent, onConnect, delay }) => {
  const navigate = useNavigate();
  return (
    <Card key={person.id} delay={delay} className="p-0 overflow-hidden flex flex-col group h-full border-secondary-100" hover={true}>
      <div className="h-24 bg-gradient-to-br from-emerald-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Globe size={100} className="absolute -right-4 -bottom-4 text-white opacity-10 group-hover:rotate-12 transition-transform duration-700" />
      </div>

      <div className="px-6 flex flex-col items-center -mt-12 mb-6">
        <div className="w-24 h-24 rounded-[32px] bg-white p-1.5 shadow-xl shadow-secondary-900/10 mb-4 group-hover:scale-105 transition-transform duration-500">
          <div className="w-full h-full bg-secondary-900 rounded-[24px] flex items-center justify-center text-white font-black text-2xl group-hover:bg-emerald-600 transition-colors">
            {person.firstName?.[0]}{person.lastName?.[0]}
          </div>
        </div>
        <h3 className="text-lg font-black text-secondary-900 text-center tracking-tight leading-tight">
          {person.firstName} {person.lastName}
        </h3>
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded-full">
          Class of {person.graduationYear || '2023'}
        </p>
      </div>

      <div className="px-6 pb-6 flex-1 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-secondary-600 font-medium">
            <Building2 size={16} className="text-secondary-400 shrink-0" />
            <span className="truncate">{person.currentPosition || 'Professional'} @ {person.currentCompany || 'Alma Mater'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-secondary-600 font-medium">
            <MapPin size={16} className="text-secondary-400 shrink-0" />
            <span className="truncate">{person.location || 'Global Citizen'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {person.skills?.split(',').slice(0, 2).map((skill, i) => (
            <Badge key={i} className="text-[10px] font-black uppercase text-secondary-400 border-secondary-100 bg-secondary-50/50">
              {skill.trim()}
            </Badge>
          ))}
          {person.skills?.split(',').length > 2 && (
            <span className="text-[10px] font-black text-secondary-300">+{person.skills.split(',').length - 2}</span>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-secondary-50/50 border-t border-secondary-100 group-hover:bg-emerald-50/30 transition-colors mt-auto space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-11 rounded-xl border-secondary-200 hover:bg-white hover:text-emerald-600 transition-all font-black text-xs"
          onClick={() => navigate(`/profile/${person.id}`)}
        >
          <span className="flex items-center gap-2">
            <Eye size={16} /> View Profile
          </span>
        </Button>

        {isSent ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
            onClick={() => navigate(`/chats?userId=${person.id}`)}
          >
            <span className="flex items-center gap-2">
              <Mail size={16} /> Message
            </span>
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
            onClick={onConnect}
          >
            <span className="flex items-center gap-2">
              <UserPlus size={16} /> Link Up
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
};

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Search,
  X,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Map,
  Trash2
} from 'lucide-react';

export default function Events() {
  const { user, isAlumni, isAdmin } = useAuth();
  const canCreate = isAlumni || isAdmin;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    registrationLink: '',
    eventType: 'Webinar'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.create(formData);
      toast.success('Event scheduled successfully!');
      setShowEventModal(false);
      setFormData({ title: '', description: '', eventDate: '', location: '', registrationLink: '', eventType: 'Webinar' });
      loadEvents();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        toast.success('Event deleted successfully');
        loadEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && events.length === 0) return (
    <div className="space-y-8 p-2">
      <div className="h-10 w-48 bg-secondary-100 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[450px] bg-white rounded-[40px] border border-secondary-100 overflow-hidden space-y-4">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatedPage className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100/50 rounded-xl">
              <Sparkles className="text-purple-600" size={20} />
            </div>
            <span className="text-sm font-black text-purple-600 uppercase tracking-widest">Connect</span>
          </div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tight">University Events</h1>
          <p className="text-secondary-500 font-medium">Join workshops, webinars, and networking meetups.</p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowEventModal(true)} className="h-14 px-8 rounded-2xl shadow-xl bg-purple-600 hover:bg-purple-700 shadow-purple-500/20">
            <Plus size={20} className="mr-2" />
            Plan Event
          </Button>
        )}
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-purple-600 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search for webinars, meetups, etc..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium shadow-soft"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <Card className="py-24 text-center border-dashed bg-transparent" hover={false}>
          <Calendar size={48} className="mx-auto text-secondary-200 mb-6" />
          <h3 className="text-xl font-black text-secondary-900 mb-2">No events scheduled</h3>
          <p className="text-secondary-500 font-medium">Try searching for something else or check back later.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredEvents.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              delay={idx * 0.1}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Event Modal (Unified) */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-md animate-fade-in">
          <Card className="w-full max-w-2xl p-0 overflow-hidden shadow-glass border-none rounded-[40px]" hover={false}>
            <div className="px-8 py-6 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-purple-900">Schedule Event</h3>
              <button onClick={() => setShowEventModal(false)} className="p-2.5 hover:bg-white rounded-2xl text-purple-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Event Title" placeholder="e.g. Alumni Meetup 2026" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-secondary-600 ml-1">Event Type</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none font-medium"
                    value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Networking">Networking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input label="Date & Time" type="datetime-local" required value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
                <Input label="Location" placeholder="e.g. Auditorium or Zoom Link" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <Input label="Registration Link (Optional)" placeholder="https://external-form.com" value={formData.registrationLink} onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-secondary-600 ml-1">About the Event</label>
                <textarea
                  rows="4"
                  className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none font-medium h-32"
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What should participants expect?"
                />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => setShowEventModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg px-8">Create Event</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AnimatedPage>
  );
}

const EventCard = ({ event, delay, currentUserId, onDelete }) => {
  const date = new Date(event.eventDate);
  const isCompleted = date < new Date();

  return (
    <Card key={event.id} delay={delay} className="p-0 overflow-hidden flex flex-col group h-full border-secondary-100" hover={true}>
      <div className="relative h-48 bg-secondary-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <Calendar size={120} className="text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 z-20">
          <Badge variant={isCompleted ? 'default' : 'warning'} className="bg-white/10 backdrop-blur-md text-white border-white/20">
            {isCompleted ? 'Finished' : 'Upcoming'}
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">{event.eventType}</p>
          <h3 className="text-2xl font-black text-white leading-tight">{event.title}</h3>
        </div>
        {currentUserId === event.createdById && (
          <button
            onClick={() => onDelete(event.id)}
            className="absolute top-4 right-4 z-30 p-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-rose-600 hover:border-rose-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="p-8 flex-1 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary-600 font-bold italic">
            <Clock size={16} className="text-purple-500" />
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600 font-bold italic">
            <Calendar size={16} className="text-purple-500" />
            {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-secondary-400 font-medium">
          <MapPin size={16} />
          <span className="truncate">{event.location || 'Online Session'}</span>
        </div>

        <p className="text-sm text-secondary-500 font-medium line-clamp-2 leading-relaxed h-10">
          {event.description}
        </p>
      </div>

      <div className="px-8 py-5 bg-secondary-50/50 border-t border-secondary-100 flex items-center justify-between group-hover:bg-purple-50/20 transition-colors">
        <Link to={`/events/${event.id}`} className="flex-1">
          <Button variant="ghost" className="w-full text-xs font-black text-secondary-600 group-hover:text-purple-600">
            RESERVE SEAT
          </Button>
        </Link>
        <ArrowUpRight size={18} className="text-secondary-300 group-hover:text-purple-500 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </Card>
  );
};

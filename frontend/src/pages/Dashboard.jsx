import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { adminAPI, jobAPI, eventAPI, alumniAPI, connectionAPI } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AnimatedPage from '../components/ui/AnimatedPage';
import Skeleton from '../components/ui/Skeleton';
import {
  Briefcase,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Zap,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RecommendedJobs from '../components/jobs/RecommendedJobs';

const CountUp = ({ to, duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      onUpdate: (value) => setCount(Math.floor(value)),
    });
    return () => controls.stop();
  }, [to, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    jobs: 0,
    events: 0,
    alumni: 0,
    connections: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        jobAPI.getAll(),
        eventAPI.getAll(),
        alumniAPI.getAll(),
        connectionAPI.getMyConnections()
      ]);

      // Helper to check if a call succeeded
      const isSuccess = (res) => res.status === 'fulfilled';

      // 1. Jobs
      if (isSuccess(results[0])) {
        const jobsRes = results[0].value;
        const jobsData = jobsRes.data.content ? jobsRes.data.content : jobsRes.data;
        setRecentJobs(jobsData.slice(0, 3));
        setStats(prev => ({
          ...prev,
          jobs: jobsRes.data.content ? jobsRes.data.totalElements : jobsRes.data.length
        }));
      } else {
        console.error('Failed to load recent jobs:', results[0].reason);
      }

      // 2. Events
      if (isSuccess(results[1])) {
        const eventsRes = results[1].value;
        setUpcomingEvents(eventsRes.data.slice(0, 2));
        setStats(prev => ({ ...prev, events: eventsRes.data.length }));
      } else {
        console.error('Failed to load upcoming events:', results[1].reason);
      }

      // 3. Alumni
      if (isSuccess(results[2])) {
        const alumniRes = results[2].value;
        setStats(prev => ({ ...prev, alumni: alumniRes.data.length }));
      } else {
        console.error('Failed to load alumni count:', results[2].reason);
      }

      // 4. Connections
      if (isSuccess(results[3])) {
        const connRes = results[3].value;
        setStats(prev => ({ ...prev, connections: connRes.data.length }));
      } else {
        console.error('Failed to load connection count:', results[3].reason);
      }

      // Admin specific check
      if (isAdmin) {
        try {
          const pendingRes = await adminAPI.getPendingUsers();
          setStats(prev => ({ ...prev, pendingApprovals: pendingRes.data.length }));
        } catch (err) {
          console.error('Failed to load pending approvals:', err);
        }
      }

    } catch (error) {
      console.error('Critical error in dashboard load:', error);
    } finally {
      // Small artificial delay for smooth transition if data loads too fast
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobAPI.delete(jobId);
        loadDashboardData();
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(eventId);
        loadDashboardData();
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-2">
        <div className="h-12 w-64 bg-secondary-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary-100 rounded-[32px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-secondary-100 rounded-[32px]" />
          <div className="h-96 bg-secondary-100 rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage className="space-y-10">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-secondary-200/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100/50 rounded-xl">
              <Sparkles className="text-primary-600" size={20} />
            </div>
            <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-secondary-900 tracking-tighter">
            Hello, {user?.firstName}
          </h1>
          <p className="text-lg text-secondary-500 font-medium">Welcome back to your professional community.</p>
        </div>
        {!user?.verified && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-200 rounded-2xl"
          >
            <AlertCircle className="text-amber-600" size={20} />
            <span className="text-sm font-bold text-amber-700">Account verification pending</span>
          </motion.div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.jobs}
          color="blue"
          trend="+12% locally"
          to="/jobs"
        />
        <StatsCard
          icon={Calendar}
          label="Upcoming Events"
          value={stats.events}
          color="purple"
          trend="3 happening today"
          to="/events"
        />
        <StatsCard
          icon={Users}
          label="Global Alumni"
          value={stats.alumni}
          color="emerald"
          trend="New members joined"
          to="/alumni"
        />
        <StatsCard
          icon={isAdmin ? ShieldCheck : Zap}
          label={isAdmin ? "Pending Approvals" : "Active Connections"}
          value={isAdmin ? stats.pendingApprovals : stats.connections}
          color={isAdmin ? "rose" : "amber"}
          trend={isAdmin ? "Requires attention" : "Last seen 2h ago"}
          to={isAdmin ? "/admin" : "/connections"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col - Jobs & Activity */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-secondary-900 tracking-tight flex items-center gap-3">
                <TrendingUp className="text-primary-600" size={24} />
                Recent Opportunities
              </h3>
              <Link to="/jobs">
                <Button variant="ghost" size="sm" className="font-black text-sm pr-2">
                  View Directory
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {recentJobs.length > 0 ? recentJobs.map((job, idx) => (
                <JobRow
                  key={job.id}
                  job={job}
                  delay={0.1 * idx}
                  currentUserId={user?.id}
                  onDelete={handleDeleteJob}
                />
              )) : (
                <Card className="py-16 text-center border-dashed border-2 border-secondary-100 bg-secondary-50/30" hover={false}>
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="text-secondary-400" size={24} />
                    </div>
                    <p className="text-secondary-900 font-black text-lg">No active jobs found</p>
                    <p className="text-secondary-500 text-sm font-medium">Be the first to post a new opportunity for the community.</p>
                  </div>
                </Card>
              )}
            </div>
          </section>

          {user?.role === 'STUDENT' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-secondary-900 tracking-tight flex items-center gap-3">
                  <Sparkles className="text-primary-600" size={24} />
                  AI Recommended for You
                </h3>
              </div>
              <RecommendedJobs />
            </section>
          )}
        </div>

        {/* Right Col - Events & Community */}
        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Calendar</h3>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                <EventMiniCard
                  key={event.id}
                  event={event}
                  delay={0.2 * idx}
                  currentUserId={user?.id}
                  onDelete={handleDeleteEvent}
                />
              )) : (
                <Card className="p-8 text-center border-secondary-100 bg-secondary-50/20" hover={false}>
                  <Calendar className="text-secondary-300 mx-auto mb-3" size={32} />
                  <p className="text-xs font-black text-secondary-500 uppercase tracking-widest">No events scheduled</p>
                  <p className="text-[10px] text-secondary-400 mt-2 font-medium">Check back later for community meetups.</p>
                </Card>
              )}
            </div>
          </section>

          <Card className="p-0 border-none bg-gradient-to-br from-primary-600 to-primary-700 text-white overflow-hidden group shadow-premium" hover={false}>
            <div className="p-8 space-y-4 relative z-10">
              <h4 className="text-2xl font-black leading-tight">Build your network today.</h4>
              <p className="text-primary-100 font-medium">Connect with professionals and advance your career journey.</p>
              <Link to="/alumni">
                <Button variant="secondary" className="bg-white text-primary-600 border-none shadow-xl w-full h-12">
                  Browse Alumni
                </Button>
              </Link>
            </div>
            <Users size={180} className="absolute -right-12 -bottom-12 text-white/10 group-hover:scale-110 transition-transform" />
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}

const StatsCard = ({ icon: Icon, label, value, color, trend, to }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <Link to={to} className="block group">
      <Card className="overflow-hidden relative border-none shadow-premium bg-white h-full" hover={true}>
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color] || colors.blue}`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-secondary-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-secondary-900 tracking-tighter">
                <CountUp to={value} />
              </h4>
              <span className="text-[10px] font-bold text-secondary-400 px-2 py-0.5 bg-secondary-50 rounded-full">{trend}</span>
            </div>
          </div>
        </div>
        <Icon size={120} className="absolute -right-8 -bottom-8 text-secondary-50 opacity-0 group-hover:opacity-50 transition-opacity" />
      </Card>
    </Link>
  );
};

const JobRow = ({ job, delay, currentUserId, onDelete }) => (
  <Link to={`/jobs/${job.id}`} className="block group">
    <Card delay={delay} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5" hover={true}>
      <div className="w-14 h-14 bg-secondary-50 border border-secondary-100 rounded-2xl flex items-center justify-center font-black text-secondary-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors shrink-0">
        {job.company?.[0] || 'J'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-black text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
          {job.title}
        </h4>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1">
          <p className="text-sm font-bold text-secondary-600">{job.company}</p>
          <span className="w-1 h-1 bg-secondary-200 rounded-full" />
          <p className="text-sm font-medium text-secondary-400">{job.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-secondary-50">
        <Badge variant="blue">{job.jobType}</Badge>
        {currentUserId === job.postedById && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(job.id); }}
            className="p-2 text-secondary-400 hover:text-rose-600 transition-colors relative z-10"
          >
            <Trash2 size={18} />
          </button>
        )}
        <ArrowRight size={18} className="text-secondary-300 group-hover:text-primary-500 transition-colors ml-auto sm:ml-0" />
      </div>
    </Card>
  </Link>
);

const EventMiniCard = ({ event, delay, currentUserId, onDelete }) => {
  const date = new Date(event.eventDate);
  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card
        key={event.id}
        delay={delay}
        className="p-4 flex items-center gap-4 border-transparent hover:border-primary-100/50"
        hover={true}
      >
        <div className="w-12 h-14 bg-primary-50 rounded-xl flex flex-col items-center justify-center text-primary-600 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-tight">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-lg font-black leading-none">{date.getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-secondary-900 truncate group-hover:text-primary-600 transition-colors">{event.title}</h4>
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1 flex items-center gap-1">
            <Zap size={10} className="text-amber-500 fill-amber-500" />
            {event.eventType}
          </p>
        </div>
        {currentUserId === event.createdById && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(event.id); }}
            className="p-2 text-secondary-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 relative z-10"
          >
            <Trash2 size={16} />
          </button>
        )}
      </Card>
    </Link>
  );
};

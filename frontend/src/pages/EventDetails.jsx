import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import SafeText from '../components/ui/SafeText';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Clock,
    Users,
    Info,
    ExternalLink,
    Share2,
    Bell,
    Map,
    Sparkles,
    Zap,
    ChevronRight
} from 'lucide-react';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getById(id);
            setEvent(response.data);
        } catch (err) {
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await eventAPI.join(id);
            if (event.registrationLink) {
                toast.success('Interest recorded! Redirecting to registration...');
                setTimeout(() => {
                    window.open(event.registrationLink, "_blank", "noopener,noreferrer");
                }, 1000);
            } else {
                toast.success('Successfully reserved your seat!');
            }
            fetchEvent(); // Refresh to show updated attendees count if available
        } catch (err) {
            // Error handled by interceptor
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto space-y-10 animate-pulse p-4">
            <div className="h-64 bg-secondary-100 rounded-[48px]" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 h-96 bg-secondary-100 rounded-[32px]" />
                <div className="h-96 bg-secondary-100 rounded-[32px]" />
            </div>
        </div>
    );

    if (!event) return <div className="text-center py-20 font-black text-secondary-400">Event not found</div>;

    const eventDate = new Date(event.eventDate);
    const isCompleted = eventDate < new Date();

    return (
        <AnimatedPage className="max-w-7xl mx-auto space-y-10 pb-20">
            <Link to="/events" className="inline-flex items-center gap-2 text-secondary-500 font-black hover:text-purple-600 transition-colors group">
                <div className="p-2 bg-secondary-100 group-hover:bg-purple-50 rounded-xl transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Main Visual Header */}
                    <section className="relative h-80 bg-secondary-900 rounded-[48px] overflow-hidden group shadow-premium">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-transparent to-black/80 z-10" />
                        <Calendar size={280} className="absolute -right-20 -top-20 text-white opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12" />

                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <Sparkles size={14} className="text-purple-400" />
                                    University Hosted
                                </Badge>
                                <Badge variant={isCompleted ? 'default' : 'warning'} className="px-4 py-1.5 rounded-full">
                                    {isCompleted ? 'Completed' : 'Upcoming'}
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter max-w-3xl">
                                <SafeText>{event.title}</SafeText>
                            </h1>
                        </div>
                    </section>

                    {/* Event Content Description */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px] bg-white" hover={false}>
                        <div className="space-y-10">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-purple-600 rounded-full" />
                                    <h3 className="text-2xl font-black text-secondary-900">Experience Highlights</h3>
                                </div>
                                <p className="text-secondary-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {event.description}
                                </p>
                            </section>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-secondary-100">
                                <DetailStat icon={Users} label="Open for" value="All Levels" />
                                <DetailStat icon={Map} label="Format" value={event.eventType || 'Networking'} />
                                <DetailStat icon={Zap} label="Benefit" value="Certificate" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Schedule & Actions */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="p-8 space-y-8 border-none shadow-premium rounded-[40px] bg-white sticky top-28" hover={false}>
                        <div className="space-y-4">
                            <div className="p-6 bg-purple-50 rounded-[32px] border border-purple-100 flex items-center gap-5">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center shrink-0">
                                    <span className="text-xs font-black text-purple-600 uppercase leading-none">{eventDate.toLocaleDateString([], { month: 'short' })}</span>
                                    <span className="text-2xl font-black text-secondary-900">{eventDate.getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-secondary-900">{eventDate.toLocaleDateString([], { weekday: 'long' })}</h4>
                                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">Starting at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="p-6 bg-secondary-50 rounded-[32px] border border-secondary-100/50 flex items-center gap-5">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary-400 shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-black text-secondary-900">Campus Location</h4>
                                    <p className="text-xs font-bold text-secondary-500 uppercase tracking-widest mt-1 truncate">
                                        <SafeText fallback="Session Link TBD">{event.location}</SafeText>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {!isCompleted ? (
                                <Button
                                    size="lg"
                                    onClick={handleJoin}
                                    className="w-full h-16 rounded-[22px] bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/20 text-lg"
                                >
                                    Reserve Seat Now
                                    <Zap size={20} className="ml-3" />
                                </Button>
                            ) : (
                                <Button size="lg" disabled className="w-full h-16 rounded-[22px] text-lg opacity-50 grayscale">
                                    Event Concluded
                                </Button>
                            )}

                            {event.registrationLink && !isCompleted && (
                                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button variant="outline" size="lg" className="w-full h-14 rounded-[22px] border-purple-200 text-purple-600">
                                        Original Website
                                        <ExternalLink size={18} className="ml-2" />
                                    </Button>
                                </a>
                            )}

                            <Button variant="ghost" className="w-full h-14 rounded-[22px] text-secondary-400 hover:text-purple-600">
                                <Share2 size={20} className="mr-3" />
                                Share with Network
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 bg-secondary-900 rounded-[40px] border-none overflow-hidden relative" hover={false}>
                        <h4 className="text-white font-black text-lg mb-4 relative z-10">Your Organizer</h4>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                {event.organizerName?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <p className="text-white font-bold">
                                    <SafeText fallback="Campus Admin">{event.organizerName}</SafeText>
                                </p>
                                <p className="text-xs text-secondary-400 font-bold uppercase tracking-tighter">Verified Official</p>
                            </div>
                        </div>
                        <ChevronRight className="absolute -right-4 -bottom-4 text-white opacity-5" size={100} />
                    </Card>
                </aside>
            </div>
        </AnimatedPage>
    );
}

const DetailStat = ({ icon: Icon, label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2 font-black text-secondary-800 text-sm">
            <Icon size={16} className="text-purple-500" />
            <span>{value}</span>
        </div>
    </div>
);

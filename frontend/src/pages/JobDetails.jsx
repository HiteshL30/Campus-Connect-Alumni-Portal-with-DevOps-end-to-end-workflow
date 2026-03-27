import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Building2,
    Clock,
    DollarSign,
    Share2,
    ExternalLink,
    Target,
    ShieldCheck,
    ChevronRight,
    Globe,
    MessageSquare
} from 'lucide-react';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const response = await jobAPI.getById(id);
            setJob(response.data);
        } catch (err) {
            // Already handled by interceptor, but good to have fallback
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
        try {
            await jobAPI.delete(id);
            toast.success('Job deleted successfully');
            navigate('/jobs');
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Opportunity link copied to clipboard!');
    };

    const handleContactRecruiter = () => {
        if (job.postedById) {
            navigate(`/chats?userId=${job.postedById}`);
        } else {
            toast.error('Recruiter contact information not available.');
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto space-y-10 animate-pulse p-4">
            <div className="h-64 bg-secondary-100 rounded-[48px]" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-96 bg-secondary-100 rounded-[32px]" />
                <div className="h-96 bg-secondary-100 rounded-[32px]" />
            </div>
        </div>
    );

    if (!job) return <div className="text-center py-20 font-black text-secondary-400 uppercase tracking-widest">Opportunity not found</div>;

    return (
        <AnimatedPage className="max-w-7xl mx-auto space-y-10 pb-20">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-secondary-500 font-black hover:text-primary-600 transition-colors group">
                <div className="p-2 bg-secondary-100 group-hover:bg-primary-50 rounded-xl transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Back to Opportunities
            </Link>

            {/* Cinematic Header Block */}
            <section className="relative h-64 md:h-80 bg-secondary-900 rounded-[48px] overflow-hidden group shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-transparent to-secondary-950/80 z-10" />
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-primary-500 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[50%] h-full bg-emerald-500 blur-[150px] rounded-full" />
                </div>

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            Verified Company
                        </Badge>
                        <Badge className="bg-primary-600 text-white border-none px-4 py-1.5 rounded-full">
                            {job.jobType}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter max-w-4xl leading-tight">
                        {job.title}
                    </h1>
                </div>
                <Briefcase size={240} className="absolute -right-20 -top-20 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Info */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="p-10 border-none shadow-soft rounded-[40px]" hover={false}>
                        <div className="space-y-12">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-primary-600 rounded-full" />
                                    <h3 className="text-2xl font-black text-secondary-900">About this Role</h3>
                                </div>
                                <p className="text-secondary-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {job.description}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-primary-600 rounded-full" />
                                    <h3 className="text-2xl font-black text-secondary-900">Key Requirements</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-secondary-50/50 rounded-3xl p-8 border border-secondary-100">
                                        <p className="text-secondary-600 font-medium whitespace-pre-wrap">
                                            {job.requirements || "Detailed requirements will be shared during the interview process."}
                                        </p>
                                    </div>

                                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            {job.requiredSkills.map(skill => (
                                                <Badge key={skill} variant="blue" className="px-4 py-2 rounded-xl text-sm font-black bg-primary-50 text-primary-700 border-primary-100 uppercase tracking-tighter">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Sticky Actions */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="p-8 space-y-8 border-none shadow-premium rounded-[40px] sticky top-28" hover={false}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-5 p-5 bg-secondary-50 rounded-[28px] border border-secondary-100/50">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-600 shrink-0 font-black text-2xl">
                                    {job.company?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-secondary-400 uppercase tracking-widest mb-1">Company</p>
                                    <p className="text-lg font-black text-secondary-900 truncate">{job.company}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <QuickInfoItem icon={MapPin} label="Location" value={job.location} />
                                <QuickInfoItem icon={Globe} label="Workplace" value={job.workplace || "On-site"} />
                                <QuickInfoItem icon={DollarSign} label="Salary" value={job.salary || "Competitive"} />
                                <QuickInfoItem icon={Clock} label="Posted" value={new Date(job.createdAt).toLocaleDateString()} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {job.applicationLink ? (
                                <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button size="lg" className="w-full h-16 rounded-[22px] text-lg shadow-xl shadow-primary-500/20">
                                        Apply Now
                                        <ExternalLink size={20} className="ml-3" />
                                    </Button>
                                </a>
                            ) : (
                                <Button 
                                    size="lg" 
                                    className="w-full h-16 rounded-[22px] text-lg shadow-xl shadow-primary-500/20"
                                    onClick={handleContactRecruiter}
                                >
                                    Contact Recruiter
                                    <MessageSquare size={20} className="ml-3" />
                                </Button>
                            )}

                            {(user?.id === job.postedById || isAdmin) && (
                                <Button onClick={handleDelete} variant="danger" className="w-full h-14 rounded-[22px]">
                                    Delete Opportunity
                                </Button>
                            )}

                            <Button 
                                variant="outline" 
                                className="w-full h-14 rounded-[22px] border-secondary-200"
                                onClick={handleShare}
                            >
                                <Share2 size={20} className="mr-3" />
                                Share Opportunity
                            </Button>
                        </div>

                        <div className="pt-6 border-t border-secondary-100 text-center">
                            <p className="text-xs font-bold text-secondary-400 uppercase tracking-tighter flex items-center justify-center gap-1.5">
                                <Target size={14} className="text-primary-500" />
                                Apply before positions are filled
                            </p>
                        </div>
                    </Card>
                </aside>
            </div>
        </AnimatedPage>
    );
}

const QuickInfoItem = ({ icon: Icon, label, value }) => (
    <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100/30">
        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2 font-black text-secondary-800 text-sm">
            <Icon size={14} className="text-primary-500" />
            <span className="truncate">{value}</span>
        </div>
    </div>
);

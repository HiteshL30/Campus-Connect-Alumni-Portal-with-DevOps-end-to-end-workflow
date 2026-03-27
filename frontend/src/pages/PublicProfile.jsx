import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
    Mail,
    Building2,
    GraduationCap,
    MapPin,
    Linkedin,
    Briefcase,
    Globe,
    Award,
    BookOpen,
    Target,
    ShieldCheck,
    ChevronLeft
} from 'lucide-react';

export default function PublicProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfileById(id);
            setProfile(response.data);
        } catch (err) {
            toast.error('Failed to load profile');
            navigate('/connections');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="space-y-10 animate-pulse p-4 max-w-7xl mx-auto">
            <div className="h-64 bg-secondary-100 rounded-[48px]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 h-96 bg-secondary-100 rounded-[40px]" />
                <div className="lg:col-span-8 h-96 bg-secondary-100 rounded-[40px]" />
            </div>
        </div>
    );

    const isStudent = profile?.role === 'STUDENT';
    const isAlumni = profile?.role === 'ALUMNI';

    return (
        <AnimatedPage className="space-y-10 max-w-7xl mx-auto pb-20">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-secondary-500 hover:text-primary-600 transition-colors"
            >
                <ChevronLeft size={20} className="mr-2" /> Back
            </Button>

            {/* Profile Header */}
            <section className="relative h-64 md:h-80 bg-secondary-900 rounded-[48px] overflow-hidden shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-secondary-900/60 to-black/90 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center md:items-end p-8 md:p-12 gap-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[40px] p-2 shadow-2xl">
                        <div className="w-full h-full bg-secondary-900 rounded-[32px] flex items-center justify-center text-white font-black text-4xl">
                            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-3 pb-2 flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                {profile?.firstName} {profile?.lastName}
                            </h1>
                            <div className="flex gap-2">
                                {profile?.verified && (
                                    <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full flex items-center gap-1.5 font-black text-[10px] tracking-widest shadow-lg">
                                        <ShieldCheck size={14} /> VERIFIED
                                    </Badge>
                                )}
                                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest">
                                    {profile?.role}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-lg text-secondary-300 font-medium flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="flex items-center gap-2"><BookOpen size={18} className="text-primary-400" /> {profile?.department}</span>
                            <span className="hidden md:block text-secondary-600">•</span>
                            <span className="flex items-center gap-2">
                                <GraduationCap size={18} className="text-primary-400" />
                                {isAlumni ? `Class of ${profile?.graduationYear}` : `Expected ${profile?.graduationYear || '2027'}`}
                            </span>
                        </p>
                    </div>

                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="p-8 space-y-8 border-none shadow-soft rounded-[40px]" hover={false}>
                        <h3 className="text-xl font-black text-secondary-900 tracking-tight flex items-center gap-3">
                            <Globe className="text-primary-600" size={24} />
                            Professional Info
                        </h3>
                        <div className="space-y-6">
                            <IdentityItem icon={Mail} label="Contact Email" value={profile?.email} />
                            {isAlumni && (
                                <>
                                    <IdentityItem icon={Briefcase} label="Current Company" value={profile?.currentCompany} />
                                    <IdentityItem icon={Target} label="Role" value={profile?.currentPosition} />
                                    <IdentityItem icon={MapPin} label="Location" value={profile?.location} />
                                </>
                            )}
                            {isStudent && (
                                <>
                                    <IdentityItem icon={Target} label="Major" value={profile?.major} />
                                    <IdentityItem icon={Award} label="Interests" value={profile?.interests} />
                                </>
                            )}
                        </div>
                        {profile?.linkedinUrl && (
                            <div className="pt-8 border-t border-secondary-100">
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="w-full h-14 rounded-2xl border-secondary-200 hover:bg-blue-50 hover:border-blue-200 group">
                                        <Linkedin size={20} className="mr-3 text-blue-600" />
                                        LinkedIn Profile
                                    </Button>
                                </a>
                            </div>
                        )}
                    </Card>
                </aside>

                {/* Right Content */}
                <main className="lg:col-span-8 space-y-8">
                    <Card className="p-10 border-none shadow-soft rounded-[40px]" hover={false}>
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight mb-6">About</h3>
                                <p className="text-secondary-600 text-lg leading-relaxed font-medium">
                                    {profile?.bio || "No biography provided yet."}
                                </p>
                            </section>

                            {profile?.skills && (
                                <section className="pt-8 border-t border-secondary-100">
                                    <h3 className="text-xl font-black text-secondary-900 tracking-tight mb-6 flex items-center gap-2">
                                        <Award size={20} className="text-primary-600" /> Skills & Expertise
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.skills.split(',').map((skill, i) => (
                                            <Badge key={i} className="px-6 py-3 bg-secondary-50 text-secondary-700 border-none rounded-2xl font-bold text-sm">
                                                {skill.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </Card>
                </main>
            </div>
        </AnimatedPage>
    );
}

const IdentityItem = ({ icon: Icon, label, value }) => (
    <div className="group">
        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-3 font-black text-secondary-800">
            <div className="p-2 bg-secondary-50 rounded-xl">
                <Icon size={18} className="text-secondary-400" />
            </div>
            <span className="truncate">{value || 'Not provided'}</span>
        </div>
    </div>
);

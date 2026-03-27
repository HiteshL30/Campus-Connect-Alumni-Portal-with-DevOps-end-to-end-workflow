import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
    ShieldCheck,
    Hourglass,
    Search,
    Lock,
    ArrowRight,
    CheckCircle2,
    Zap,
    Sparkles,
    HelpCircle,
    Mail
} from 'lucide-react';

export default function PendingVerification() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-secondary-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-100/30 rounded-full blur-[140px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-4xl relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left Info Panel */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                            <Hourglass size={18} className="animate-spin duration-[3000ms]" />
                            <span className="text-sm font-black tracking-widest uppercase">Identity Verification Still in Progress</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-secondary-900 tracking-tighter leading-none">
                            We're Checking Your <span className="text-primary-600">Credentials.</span>
                        </h1>

                        <p className="text-xl text-secondary-500 font-medium leading-relaxed max-w-lg">
                            To maintain a high-trust professional network for our university, every application is manually reviewed by our administrative team.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button className="h-16 px-10 rounded-2xl shadow-xl shadow-primary-500/20 text-lg">
                                Check Status
                                <ArrowRight size={20} className="ml-3" />
                            </Button>
                            <Button variant="ghost" className="h-16 px-10 rounded-2xl text-secondary-500 font-black">
                                Contact Support
                            </Button>
                        </div>
                    </div>

                    {/* Right Progress Card */}
                    <Card className="p-0 border-none shadow-glass rounded-[48px] bg-white overflow-hidden" hover={false}>
                        <div className="p-10 space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-primary-50 rounded-[28px] flex items-center justify-center text-primary-600 shadow-inner">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <Sparkles className="absolute -top-2 -right-2 text-amber-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-secondary-900">Next Steps</h3>
                                    <p className="text-sm text-secondary-400 font-bold uppercase tracking-widest">Average Wait: 12-24 Hours</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <StepItem
                                    icon={CheckCircle2}
                                    title="Account Created"
                                    desc="Your basic profile is set up and secure."
                                    status="completed"
                                />
                                <StepItem
                                    icon={Search}
                                    title="Identity Review"
                                    desc="Our team is currently verifying your records."
                                    status="active"
                                />
                                <StepItem
                                    icon={Lock}
                                    title="Full Access"
                                    desc="Access directory, jobs and real-time chat."
                                    status="pending"
                                />
                            </div>

                            <div className="p-6 bg-secondary-50 rounded-[32px] border border-secondary-100/50 flex items-center gap-5 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <p className="text-xs font-bold text-secondary-600">We'll notify your institutional email once approved.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <p className="mt-16 text-center text-[10px] font-black text-secondary-400 uppercase tracking-[0.3em]">
                    Trust • Security • Professionalism • University Platform 2026
                </p>
            </motion.div>
        </div>
    );
}

const StepItem = ({ icon: Icon, title, desc, status }) => {
    const styles = {
        completed: 'text-primary-600',
        active: 'text-amber-500',
        pending: 'text-secondary-300'
    };

    return (
        <div className="flex gap-6 relative group">
            <div className="flex flex-col items-center shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 bg-white transition-all ${status === 'completed' ? 'border-primary-100 bg-primary-50' : status === 'active' ? 'border-amber-100 bg-amber-50' : 'border-secondary-100'}`}>
                    <Icon size={20} className={styles[status]} />
                </div>
                <div className="w-0.5 h-10 bg-secondary-100 group-last:hidden mt-2" />
            </div>
            <div className="pt-1">
                <h4 className={`text-lg font-black tracking-tight ${status === 'pending' ? 'text-secondary-400' : 'text-secondary-900'}`}>{title}</h4>
                <p className="text-sm text-secondary-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

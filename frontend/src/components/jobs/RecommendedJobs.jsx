import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobAPI } from '../../services/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Briefcase, MapPin, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await jobAPI.getRecommended();
                setJobs(response.data);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="h-32 bg-secondary-100 rounded-[32px] animate-pulse" />
                ))}
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <Card className="py-12 text-center border-dashed bg-secondary-50/50" hover={false}>
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-secondary-300">
                        <Zap size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-secondary-900 font-bold">No perfect matches yet</p>
                        <p className="text-secondary-500 text-sm font-medium px-8">Update your skills in your profile to get personalized recommendations.</p>
                    </div>
                    <Link to="/profile">
                        <Button variant="outline" size="sm" className="mt-2">Update Profile</Button>
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            {jobs.map((job, idx) => (
                <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="p-6 relative overflow-hidden group border-none shadow-premium bg-white" hover={true}>
                        {/* Match Score Badge */}
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Match Score</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 bg-secondary-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${job.matchScore || 0}%` }}
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                                        />
                                    </div>
                                    <span className="text-sm font-black text-secondary-900">{Math.round(job.matchScore)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center font-black text-primary-600 shrink-0">
                                {job.company?.[0] || 'J'}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h4 className="text-xl font-black text-secondary-900 group-hover:text-primary-600 transition-colors">
                                        {job.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <p className="text-sm font-bold text-secondary-600">{job.company}</p>
                                        <span className="w-1 h-1 bg-secondary-200 rounded-full" />
                                        <p className="text-sm font-medium text-secondary-400 flex items-center gap-1">
                                            <MapPin size={14} /> {job.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {job.matchingSkills?.slice(0, 3).map(skill => (
                                        <Badge key={skill} variant="blue" className="bg-primary-50 text-primary-700 border-primary-100 lowercase">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {job.matchingSkills?.length > 3 && (
                                        <span className="text-xs font-bold text-secondary-400 flex items-center self-center px-1">
                                            +{job.matchingSkills.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="blue">{job.jobType}</Badge>
                                    </div>
                                    <Link to={`/jobs/${job.id}`}>
                                        <Button variant="primary" size="sm" className="rounded-xl font-black text-xs">
                                            View Details
                                            <ArrowRight size={14} className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import AnimatedPage from '../components/ui/AnimatedPage';
import { ScrollRevealList, ScrollRevealItem } from '../components/ui/ScrollReveal';
import AnimatedModal from '../components/ui/AnimatedModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Search,
  Building2,
  Clock,
  Plus,
  Filter,
  ArrowRight,
  TrendingUp,
  X,
  Target,
  Trash2
} from 'lucide-react';

export default function Jobs() {
  const { user, isAlumni, isAdmin } = useAuth();
  const canPost = isAlumni || isAdmin;

  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 9, totalPages: 0 });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    jobType: 'Full-time',
    workplace: 'On-site',
    salary: '',
    requirements: '',
    applicationUrl: '',
    requiredSkills: ''
  });

  useEffect(() => {
    loadJobs(0);
  }, [selectedType, searchTerm]);

  useEffect(() => {
    const term = searchParams.get('search');
    if (term !== null) {
      setSearchTerm(term);
    }
  }, [searchParams]);

  const loadJobs = async (page = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pagination.size,
        type: selectedType === 'All' ? undefined : selectedType,
        search: searchTerm || undefined
      };
      const response = await jobAPI.getAll(params);

      if (response.data.content) {
        setJobs(response.data.content);
        setPagination(prev => ({ ...prev, page, totalPages: response.data.totalPages }));
      } else {
        setJobs(response.data);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobAPI.create({
        ...formData,
        requiredSkills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '') : []
      });
      toast.success('Job posted successfully!');
      setShowPostModal(false);
      setFormData({ title: '', company: '', location: '', description: '', jobType: 'Full-time', workplace: 'On-site', salary: '', requirements: '', applicationUrl: '', requiredSkills: '' });
      loadJobs(0);
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobAPI.delete(id);
        toast.success('Job deleted successfully');
        loadJobs(pagination.page);
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const filteredJobs = jobs; // Filtered on backend now

  if (loading && jobs.length === 0) return (
    <div className="space-y-8 p-2">
      <div className="h-10 w-48 bg-secondary-100 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} variant="card" className="h-[380px]" />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatedPage className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100/50 rounded-xl">
              <Target className="text-primary-600" size={20} />
            </div>
            <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Opportunities</span>
          </div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tight">Career Directory</h1>
          <p className="text-secondary-500 font-medium">Find your next professional leap in our verified community.</p>
        </div>
        {canPost && (
          <Button onClick={() => setShowPostModal(true)} className="h-14 px-8 rounded-2xl shadow-xl">
            <Plus size={20} className="mr-2" />
            Post Opportunity
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <form onSubmit={(e) => { e.preventDefault(); loadJobs(0); }}>
            <input
              type="text"
              placeholder="Search by job title or company name..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium shadow-soft"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {['All', 'Full-time', 'Internship', 'Contract', 'Remote'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap shadow-soft
                ${selectedType === type
                  ? 'bg-secondary-900 text-white'
                  : 'bg-white text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50'}`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-24 border-dashed bg-transparent" hover={false}>
          <div className="w-20 h-20 bg-white shadow-soft rounded-full flex items-center justify-center text-secondary-200 mb-6">
            <Briefcase size={40} />
          </div>
          <h3 className="text-xl font-black text-secondary-900 mb-2">No matching jobs found</h3>
          <p className="text-secondary-500 font-medium max-w-sm text-center">Try adjusting your filters or search terms.</p>
        </Card>
      ) : (
        <>
          <ScrollRevealList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" staggerDelay={0.06}>
            {filteredJobs.map((job, idx) => (
              <ScrollRevealItem key={job.id} variant="fade-up">
                <JobCard
                  job={job}
                  delay={0}
                  currentUserId={user?.id}
                  onDelete={handleDelete}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealList>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-10">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => loadJobs(i)}
                  className={`w-12 h-12 rounded-xl font-black transition-all ${pagination.page === i ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white text-secondary-500 hover:bg-secondary-50'}`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Post Job Modal (Simplified for UI view) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-md animate-fade-in">
          <Card className="w-full max-w-2xl p-0 overflow-hidden shadow-glass border-none rounded-[40px]" hover={false}>
            <div className="px-8 py-6 bg-secondary-50 border-b border-secondary-200/50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-secondary-900">Post Opportunity</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2.5 hover:bg-white rounded-2xl text-secondary-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Job Title" placeholder="e.g. Senior Software Engineer" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <Input label="Company Name" placeholder="e.g. Acme Corp" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                <Input label="Location" placeholder="e.g. Remote or San Francisco, CA" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-secondary-600 ml-1">Job Type</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-secondary-600 ml-1">Workplace</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium"
                    value={formData.workplace}
                    onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <Input label="Salary" placeholder="e.g. $100k - $120k" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
              </div>
              <Input label="Application Link" placeholder="https://..." value={formData.applicationUrl} onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-secondary-600 ml-1">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium h-32"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about the role..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-secondary-600 ml-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Java, Spring Boot"
                  className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                />
              </div>
              <div className="pt-4 border-t border-secondary-100 flex justify-end gap-3">
                <Button type="button" variant="ghost" className="rounded-2xl h-12 px-6" onClick={() => setShowPostModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-2xl h-12 px-8 shadow-lg">Post Job</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AnimatedPage>
  );
}

const JobCard = ({ job, delay, currentUserId, onDelete }) => (
  <Card key={job.id} delay={delay} className="p-0 overflow-hidden flex flex-col group h-full" hover={true}>
    <div className="p-8 flex-1 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-16 h-16 bg-secondary-900 rounded-[28px] flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-500 group-hover:-rotate-3 relative group/icon">
          {job.company?.[0]}
          {currentUserId === job.postedById && (
            <button
              onClick={(e) => { e.preventDefault(); onDelete(job.id); }}
              className="absolute -top-2 -right-2 p-2 bg-white shadow-xl rounded-xl text-secondary-300 hover:text-rose-600 transition-all opacity-0 group-hover/icon:opacity-100 z-10"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="blue" className="bg-primary-50 text-primary-700 h-7 border border-primary-100 px-3 flex items-center">{job.jobType}</Badge>
          {job.expiryDate && (
            <span className="text-[10px] font-black text-secondary-400 uppercase tracking-tight">
              Exp: {new Date(job.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-secondary-900 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2 min-h-[3rem]">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <Building2 size={14} className="text-secondary-400" />
          <p className="text-sm font-bold text-secondary-700">{job.company}</p>
        </div>
      </div>

      <div className="space-y-3 pb-2">
        <div className="flex items-center gap-2 text-sm text-secondary-600 font-medium">
          <MapPin size={16} className="text-secondary-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary-600 font-medium">
          <Clock size={16} className="text-secondary-400" />
          Posted by {job.postedByName || 'Alumni'}
        </div>
      </div>
    </div>

    <div className="px-8 py-5 bg-secondary-50/50 border-t border-secondary-100 flex items-center justify-between group-hover:bg-primary-50/30 transition-colors">
      <Link to={`/jobs/${job.id}`} className="flex-1">
        <Button variant="ghost" className="w-full text-sm font-black text-secondary-600 group-hover:text-primary-600">
          Explore Details
        </Button>
      </Link>
    </div>
  </Card>
);

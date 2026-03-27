import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  MapPin,
  Linkedin,
  Save,
  Camera,
  ShieldCheck,
  Briefcase,
  Globe,
  Award,
  BookOpen,
  Target,
  FileText,
  UserCheck,
  Settings,
  Activity,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getMe();
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await userAPI.updateMe(profile);
      setProfile(response.data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-10 animate-pulse p-4 max-w-7xl mx-auto">
      <div className="h-80 bg-secondary-100 rounded-[48px]" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 h-96 bg-secondary-100 rounded-[40px]" />
        <div className="lg:col-span-8 h-screen bg-secondary-100 rounded-[40px]" />
      </div>
    </div>
  );

  const isStudent = profile?.role === 'STUDENT';
  const isAlumni = profile?.role === 'ALUMNI';
  const isAdmin = profile?.role === 'ADMIN';

  return (
    <AnimatedPage className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Profile Header */}
      <section className="relative h-64 md:h-80 bg-secondary-900 rounded-[48px] overflow-hidden shadow-premium group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-secondary-900/60 to-black/90 z-10" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-500 blur-[150px] rounded-full animate-float" />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center md:items-end p-8 md:p-12 lg:p-16 gap-8">
          <div className="relative group/avatar">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[40px] p-2 shadow-2xl overflow-hidden ring-4 ring-white/10 group-hover/avatar:scale-105 transition-all duration-500">
              <div className="w-full h-full bg-secondary-900 rounded-[32px] flex items-center justify-center text-white font-black text-4xl group-hover/avatar:bg-primary-600 transition-colors">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95 z-30 ring-4 ring-white">
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-3 pb-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <div className="flex gap-2">
                <Badge className={`${profile?.verified ? 'bg-emerald-500' : 'bg-amber-500'} text-white border-none px-4 py-1.5 rounded-full flex items-center gap-1.5 font-black text-[10px] tracking-widest shadow-lg`}>
                  {profile?.verified ? <ShieldCheck size={14} /> : <Activity size={14} />}
                  {profile?.verified ? 'VERIFIED' : 'PENDING'}
                </Badge>
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest">
                  {profile?.role}
                </Badge>
              </div>
            </div>
            <p className="text-lg text-secondary-300 font-medium flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center gap-2"><BookOpen size={18} className="text-primary-400" /> {profile?.department}</span>
              <span className="hidden md:block text-secondary-600">•</span>
              <span className="flex items-center gap-2"><GraduationCap size={18} className="text-primary-400" /> Class of {profile?.graduationYear || (isStudent ? '2027' : '2023')}</span>
            </p>
          </div>

          <div className="pb-2">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "ghost" : "outline"}
              className={`${editMode ? 'text-white hover:bg-white/10' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'} h-12 px-6 rounded-2xl backdrop-blur-md`}
            >
              {editMode ? "Cancel Editing" : "Manage Profile"}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-8 space-y-8 border-none shadow-soft rounded-[40px]" hover={false}>
            <h3 className="text-xl font-black text-secondary-900 tracking-tight flex items-center gap-3">
              <UserCheck className="text-primary-600" size={24} />
              Identity Details
            </h3>
            <div className="space-y-6">
              <IdentityItem icon={Mail} label="Contact Email" value={profile?.email} />
              <IdentityItem icon={Building2} label="Institution Context" value="Main Campus • Engineering" />
              {isStudent && <IdentityItem icon={Target} label="Roll Number" value={profile?.rollNumber} />}
              {isAlumni && <IdentityItem icon={Briefcase} label="Current Status" value={`${profile?.currentPosition} @ ${profile?.currentCompany}`} />}
              {isAdmin && <IdentityItem icon={Settings} label="Access Level" value="Full System Authorization" />}
            </div>
            {profile?.linkedinUrl && (
              <div className="pt-8 border-t border-secondary-100">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-secondary-200 hover:bg-blue-50 hover:border-blue-200 group">
                    <Linkedin size={20} className="mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                    Professional Profile
                  </Button>
                </a>
              </div>
            )}
          </Card>

          {isAlumni && (
            <Card className={`p-8 border-none rounded-[40px] text-white shadow-premium relative overflow-hidden transition-all duration-500 ${profile?.availableForMentoring ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-secondary-800 to-secondary-900'}`} hover={false}>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-black">Mentorship Status</h4>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${profile?.availableForMentoring ? 'bg-emerald-300' : 'bg-secondary-500'}`} />
                </div>
                <p className="text-white/80 font-medium text-sm">
                  {profile?.availableForMentoring
                    ? "You are currently marked as available to guide students. Your profile is visible in the Mentors directory."
                    : "Help the next generation! Turn on mentorship to share your experience with current students."}
                </p>
                <Button
                  variant="glass"
                  className="w-full bg-white/20 hover:bg-white/30 border-white/20 rounded-2xl h-12"
                  onClick={() => {
                    const newStatus = !profile.availableForMentoring;
                    setProfile({ ...profile, availableForMentoring: newStatus });
                    userAPI.updateMe({ ...profile, availableForMentoring: newStatus })
                      .then(() => toast.success(`Mentorship ${newStatus ? 'Enabled' : 'Disabled'}`))
                      .catch(() => toast.error('Failed to update status'));
                  }}
                >
                  {profile?.availableForMentoring ? "Disable Mentorship" : "Enable Mentorship"}
                </Button>
              </div>
              <Users size={180} className="absolute -right-16 -bottom-16 text-white/10" />
            </Card>
          )}

          {isAdmin && (
            <Card className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 border-none rounded-[40px] text-white shadow-premium relative overflow-hidden" hover={false}>
              <div className="relative z-10 space-y-4">
                <h4 className="text-xl font-black">System Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <p className="text-2xl font-black">4.2k</p>
                    <p className="text-[10px] uppercase font-bold text-indigo-200">Total Users</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <p className="text-2xl font-black">12</p>
                    <p className="text-[10px] uppercase font-bold text-indigo-200">Reports</p>
                  </div>
                </div>
              </div>
              <Activity size={180} className="absolute -right-16 -bottom-16 text-white/10" />
            </Card>
          )}
        </aside>

        {/* Right Content Form */}
        <main className="lg:col-span-8 space-y-8">
          <Card className="p-10 border-none shadow-soft rounded-[40px]" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Professional Portfolio</h3>
                <AnimatePresence>
                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Button type="submit" isLoading={saving} className="h-12 px-8 rounded-2xl shadow-xl">
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="First Name"
                  disabled={!editMode}
                  value={profile?.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  disabled={!editMode}
                  value={profile?.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                />

                {/* Academic Fields */}
                <Input
                  label="Department"
                  disabled={!editMode}
                  value={profile?.department}
                  onChange={e => setProfile({ ...profile, department: e.target.value })}
                />
                <Input
                  label="Graduation Year"
                  type="number"
                  disabled={!editMode}
                  value={profile?.graduationYear}
                  onChange={e => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })}
                />

                {isStudent && (
                  <>
                    <Input
                      label="Student ID / Roll Number"
                      disabled={!editMode}
                      value={profile?.studentId || profile?.rollNumber}
                      onChange={e => setProfile({ ...profile, studentId: e.target.value })}
                    />
                    <Input
                      label="Major / Specialization"
                      disabled={!editMode}
                      value={profile?.major}
                      placeholder="e.g. Computer Science"
                      onChange={e => setProfile({ ...profile, major: e.target.value })}
                    />
                  </>
                )}

                {isAlumni && (
                  <>
                    <Input
                      label="Current Company"
                      disabled={!editMode}
                      value={profile?.currentCompany}
                      onChange={e => setProfile({ ...profile, currentCompany: e.target.value })}
                    />
                    <Input
                      label="Current Position"
                      disabled={!editMode}
                      value={profile?.currentPosition}
                      onChange={e => setProfile({ ...profile, currentPosition: e.target.value })}
                    />
                    <Input
                      label="Industry"
                      disabled={!editMode}
                      value={profile?.industry}
                      placeholder="e.g. Software, Finance"
                      onChange={e => setProfile({ ...profile, industry: e.target.value })}
                    />
                    <Input
                      label="Location"
                      disabled={!editMode}
                      value={profile?.location}
                      placeholder="e.g. London, UK"
                      onChange={e => setProfile({ ...profile, location: e.target.value })}
                    />
                  </>
                )}

                <Input
                  label="LinkedIn URL"
                  disabled={!editMode}
                  placeholder="https://linkedin.com/in/..."
                  value={profile?.linkedinUrl}
                  onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })}
                />
                {isStudent && (
                  <Input
                    label="Resume Link (Google Drive/Dropbox)"
                    disabled={!editMode}
                    placeholder="https://..."
                    value={profile?.resumeUrl}
                    onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })}
                  />
                )}
              </div>

              {/* Shared Rich Fields */}
              {!isAdmin && (
                <>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-secondary-600 ml-1">Professional Bio</label>
                    <textarea
                      rows="4"
                      disabled={!editMode}
                      className="w-full px-5 py-4 rounded-3xl border border-secondary-200 bg-secondary-50/30 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium h-40 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      value={profile?.bio || ''}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Write a brief professional summary..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-secondary-100/50">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-secondary-600 ml-1 flex items-center gap-2">
                        <Award size={16} /> Skills & Expertise
                      </label>
                      <Input
                        disabled={!editMode}
                        placeholder="e.g. React, Java, Cloud Architecture"
                        value={profile?.skills}
                        onChange={e => setProfile({ ...profile, skills: e.target.value })}
                      />
                    </div>
                    {isStudent && (
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-secondary-600 ml-1 flex items-center gap-2">
                          <Target size={16} /> Career Interests
                        </label>
                        <Input
                          disabled={!editMode}
                          placeholder="e.g. AI Research, UX Design"
                          value={profile?.interests}
                          onChange={e => setProfile({ ...profile, interests: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {isAdmin && (
                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-amber-900 font-bold mb-1">Administrative Account</h4>
                    <p className="text-amber-700 text-sm font-medium">As an administrator, your primary fields are managed through system configuration. You can only update your name and contact preference here.</p>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </main>
      </div>
    </AnimatedPage>
  );
}

const IdentityItem = ({ icon: Icon, label, value }) => (
  <div className="group">
    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1 group-hover:text-primary-500 transition-colors uppercase tracking-[0.1em]">{label}</p>
    <div className="flex items-center gap-3 font-black text-secondary-800">
      <div className="p-2 bg-secondary-50 rounded-xl group-hover:bg-primary-50 transition-colors">
        <Icon size={18} className="text-secondary-400 group-hover:text-primary-600 transition-colors" />
      </div>
      <span className="truncate">{value || 'Not provided'}</span>
    </div>
  </div>
);

const ImpactStat = ({ label, value }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
    <p className="text-2xl font-black leading-none">{value}</p>
    <p className="text-[10px] font-black text-primary-200 uppercase tracking-tighter mt-1">{label}</p>
  </div>
);

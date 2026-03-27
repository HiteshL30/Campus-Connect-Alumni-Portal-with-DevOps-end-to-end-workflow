import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { User, Mail, Lock, Building2, GraduationCap, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: '',
    rollNumber: '',
    graduationYear: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.register(formData);
      toast.success('Registration successful! Please wait for admin verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-secondary-50 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[130px] animate-float" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[900px] relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-glass rounded-[48px] bg-white">
          {/* Left Visual Panel */}
          <div className="hidden lg:flex lg:col-span-4 bg-secondary-900 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/40 mb-8 font-black text-xl">
                C
              </div>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight">Your gateway to the professional world.</h2>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="text-primary-400" size={20} />
                </div>
                <p className="text-secondary-300 text-sm font-medium">Verified academic records for trust and safety.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <GraduationCap className="text-primary-400" size={20} />
                </div>
                <p className="text-secondary-300 text-sm font-medium">Exclusive access only for university members.</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8 p-8 md:p-12 lg:p-16">
            <header className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black text-secondary-900 tracking-tight mb-2">Create Professional Account</h1>
              <p className="text-secondary-500 font-medium">Join our global community of alumni and students.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Picker */}
              <div className="flex p-1.5 bg-secondary-100 rounded-2xl w-fit mx-auto lg:mx-0">
                {['STUDENT', 'ALUMNI'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`px-8 py-3 text-sm font-black rounded-xl transition-all ${formData.role === role ? 'bg-white text-primary-600 shadow-lg' : 'text-secondary-400 hover:text-secondary-900'}`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                <Input label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                <Input label="Institutional Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <Input label="Secure Password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-secondary-600 ml-1">Academic Department</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border border-secondary-200 bg-white/50 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm h-[58px]"
                    required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>

                <Input label="Roll / Faculty Number" required value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })} />

                <AnimatePresence mode="wait">
                  {formData.role === 'ALUMNI' && (
                    <motion.div
                      key="alumni-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <Input label="Graduation Year" required value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} />
                      <Input label="Current Company" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-sm font-medium text-secondary-500">
                  Already a member?{' '}
                  <Link to="/login" className="text-primary-600 font-black hover:underline">Sign In</Link>
                </p>
                <Button type="submit" isLoading={isLoading} className="h-14 px-12 rounded-2xl shadow-xl w-full md:w-auto">
                  Complete Registration
                  <ArrowRight size={20} className="ml-3" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

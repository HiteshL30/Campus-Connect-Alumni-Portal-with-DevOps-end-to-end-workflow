import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, LogIn, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Attempting login for:', email);
    try {
      const userData = await login(email, password);
      console.log('Login successful, navigating...', userData);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login action failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-secondary-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="text-center mb-10 space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
            className="w-16 h-16 bg-primary-600 rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/30 rotate-3"
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Access CampusConnect</h1>
          <p className="text-secondary-500 font-medium">Join thousands of alumni and students worldwide.</p>
        </div>

        <Card className="p-8 md:p-10 border-none shadow-glass bg-white/80 backdrop-blur-xl rounded-[40px]" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors z-10" size={18} />
                <Input
                  label="Academic Email"
                  type="email"
                  placeholder="name@university.edu"
                  className="pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors z-10" size={18} />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-sm font-black text-primary-600 hover:text-primary-700 transition-colors">
                Recover Credentials?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl shadow-xl shadow-primary-500/20 text-lg"
              isLoading={isLoading}
            >
              Sign In
              <LogIn size={20} className="ml-3" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-secondary-100/50 text-center">
            <p className="text-secondary-500 font-medium">
              New to the community?{' '}
              <Link to="/signup" className="text-primary-600 font-black inline-flex items-center hover:translate-x-1 transition-transform">
                Create Account
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </p>
          </div>
        </Card>

        {/* Security Footnote */}
        <p className="mt-8 text-center text-secondary-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          Academic Security Verified <Lock size={12} />
        </p>
      </motion.div>
    </div>
  );
}

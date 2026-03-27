import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AnimatedPage from '../components/ui/AnimatedPage';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Filter,
  Mail,
  GraduationCap,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowRight,
  Target
} from 'lucide-react';

export default function AdminVerification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING', 'ALUMNI', 'STUDENT'

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'PENDING') {
        response = await adminAPI.getPendingUsers();
      } else if (activeTab === 'ALUMNI') {
        response = await adminAPI.getAlumni();
      } else {
        response = await adminAPI.getStudents();
      }
      setUsers(response.data);
    } catch (error) {
      toast.error(`Failed to load ${activeTab.toLowerCase()} list`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, approve) => {
    try {
      await adminAPI.verifyUser(userId, approve);
      toast.success(approve ? 'User Access Granted' : 'Application Rejected');
      loadUsers();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete the account for ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      toast.success('Account deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="space-y-10 animate-pulse p-2">
      <div className="h-12 w-64 bg-secondary-100 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-secondary-100 rounded-[40px]" />)}
      </div>
      <div className="h-[500px] bg-secondary-100 rounded-[40px]" />
    </div>
  );

  return (
    <AnimatedPage className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-secondary-200/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100/50 rounded-xl">
              <ShieldCheck className="text-rose-600" size={20} />
            </div>
            <span className="text-sm font-black text-rose-600 uppercase tracking-widest">Administrative Gate</span>
          </div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">
            {activeTab === 'PENDING' ? 'Access Verification' : activeTab === 'ALUMNI' ? 'Alumni Registry' : 'Student Registry'}
          </h1>
          <p className="text-lg text-secondary-500 font-medium">Manage and monitor institutional access and registry.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 bg-secondary-100 rounded-2xl border border-secondary-200/50">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'PENDING' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-400'}`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('ALUMNI')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'ALUMNI' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-400'}`}
          >
            Alumni
          </button>
          <button
            onClick={() => setActiveTab('STUDENT')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'STUDENT' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-400'}`}
          >
            Students
          </button>
        </div>
      </header>

      {/* Admin Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AdminStatCard icon={Users} label={`Total ${activeTab.toLowerCase()}s`} value={users.length} color="rose" />
        <AdminStatCard icon={CheckCircle} label="Processed Today" value="12" color="emerald" />
        <AdminStatCard icon={Target} label="Success Rate" value="98%" color="blue" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-rose-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}s by name or email...`}
            className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-[20px] text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium shadow-soft"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-premium rounded-[40px] bg-white" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-50 text-secondary-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-secondary-100">
                <th className="px-10 py-6">User Profile</th>
                <th className="px-10 py-6">Identity Info</th>
                <th className="px-10 py-6">{activeTab === 'PENDING' ? 'Date Submitted' : 'Member Since'}</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-50">
              {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                <tr key={user.id} className="group hover:bg-secondary-50/50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-secondary-900 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:bg-rose-600 transition-colors">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-secondary-900 group-hover:text-rose-600 transition-colors">{user.firstName} {user.lastName}</h4>
                        <Badge className="mt-1.5 bg-secondary-100 text-secondary-500 border-none font-black text-[10px]">{user.role}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-bold text-secondary-600">
                        <Mail size={14} className="text-secondary-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-secondary-600">
                        <GraduationCap size={14} className="text-secondary-400" />
                        {user.department || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-secondary-400 uppercase tracking-tighter">
                      {activeTab === 'PENDING' ? 'Recent' : new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleVerify(user.id, true)}
                            className="h-11 w-11 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Approve Access"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => handleVerify(user.id, false)}
                            className="h-11 w-11 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Reject Access"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/profile/${user.id}`}
                            className="h-11 w-11 flex items-center justify-center bg-secondary-50 text-secondary-600 hover:bg-secondary-900 hover:text-white rounded-xl transition-all shadow-sm"
                            title="View Profile"
                          >
                            <ArrowRight size={20} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                            className="h-11 w-11 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Delete Account"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center">
                        <AlertCircle size={40} className="text-secondary-200" />
                      </div>
                      <h3 className="text-xl font-black text-secondary-900">No {activeTab.toLowerCase()} entries found</h3>
                      <p className="text-secondary-500 font-medium">Try adjusting your filters or check back later.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AnimatedPage>
  );
}

const AdminStatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    rose: 'bg-rose-50 border-rose-100 text-rose-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600'
  };
  return (
    <Card className={`p-8 border-none ${colors[color]} rounded-[40px] drop-shadow-sm`} hover={true}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
          <h4 className="text-4xl font-black tracking-tighter">{value}</h4>
        </div>
        <div className="w-14 h-14 bg-white/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Icon size={28} />
        </div>
      </div>
    </Card>
  );
};

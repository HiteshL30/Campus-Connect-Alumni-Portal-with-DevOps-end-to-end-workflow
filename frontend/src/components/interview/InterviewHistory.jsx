import { useEffect, useState } from 'react';
import { aiInterviewAPI } from '../../services/api';
import { History, Clock, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await aiInterviewAPI.getHistory();
      setHistory(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch interview history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8 bg-secondary-50 rounded-xl border border-secondary-200 mt-8">
        <History className="mx-auto text-secondary-400 mb-3" size={32} />
        <p className="text-secondary-600">No interview history yet. Start a session above!</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
        <History className="text-primary-600" /> Past Interview Sessions
      </h2>

      <div className="space-y-4">
        {history.map((session) => (
          <div key={session.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {session.role}
              </span>
              <span className="text-sm text-secondary-500 flex items-center gap-1">
                <Clock size={14} />
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="font-medium text-secondary-900 mb-2">{session.question}</p>
            
            {session.score !== null ? (
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-secondary-700 bg-secondary-50 py-2 px-3 rounded-lg w-fit border border-secondary-200">
                <Trophy size={16} className={session.score >= 8 ? 'text-green-500' : 'text-primary-500'} /> 
                Score: {session.score}/10
              </div>
            ) : (
              <span className="text-sm text-secondary-500 italic mt-2 block">Not evaluated</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { Trophy, CheckCircle, FileText } from 'lucide-react';

export default function InterviewReport({ report, onRestart }) {
  if (!report) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden animate-fade-in my-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-primary-200" />
        <h2 className="text-3xl font-black mb-2">Interview Completed!</h2>
        <p className="text-primary-100 font-medium">Here is your comprehensive evaluation summary.</p>
      </div>
      
      <div className="p-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center shadow-sm w-full max-w-xs">
            <span className="block text-green-600 font-bold mb-1 text-sm uppercase tracking-wider">Final Score</span>
            <span className="text-5xl font-black text-green-700">{report.totalScore}<span className="text-2xl text-green-400">/10</span></span>
          </div>
        </div>

        <div className="bg-secondary-50 p-6 rounded-xl border border-secondary-200">
          <h3 className="font-bold text-secondary-900 mb-3 flex items-center gap-2">
            <FileText className="text-primary-600" size={20} />
            Executive Summary
          </h3>
          <p className="text-secondary-700 whitespace-pre-wrap leading-relaxed">
            {report.summary}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={onRestart}
            className="flex items-center gap-2 px-8 py-3 bg-secondary-900 text-white rounded-xl font-bold hover:bg-secondary-800 transition-colors shadow-md hover:shadow-lg focus:ring focus:ring-secondary-300"
          >
            <CheckCircle size={20} />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

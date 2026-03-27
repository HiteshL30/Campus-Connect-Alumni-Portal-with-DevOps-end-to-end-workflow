import { CheckCircle, AlertTriangle, Trophy } from 'lucide-react';

export default function FeedbackPanel({ evaluation }) {
  if (!evaluation) return null;

  const { score, strengths, improvements } = evaluation;

  // Visual color based on score
  const getScoreColor = () => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden mt-8 animate-fade-in">
      <div className="bg-secondary-50 border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-secondary-900">
          <Trophy className="text-primary-600" /> AI Evaluation Results
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-secondary-600">Score</span>
          <span className={`text-3xl font-black ${getScoreColor()}`}>
            {score}/10
          </span>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-lg p-5">
          <h3 className="text-green-800 font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Key Strengths
          </h3>
          <p className="text-green-900 leading-relaxed whitespace-pre-wrap">
            {strengths}
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-5">
          <h3 className="text-orange-800 font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={20} />
            Areas for Improvement
          </h3>
          <p className="text-orange-900 leading-relaxed whitespace-pre-wrap">
            {improvements}
          </p>
        </div>
      </div>
    </div>
  );
}

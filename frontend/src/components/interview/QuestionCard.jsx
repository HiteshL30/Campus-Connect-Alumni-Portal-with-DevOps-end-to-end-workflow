import { MessageSquare, Flame } from 'lucide-react';

export default function QuestionCard({ question, difficulty }) {
  if (!question) return null;

  const difficultyColors = {
    EASY: 'bg-green-100 text-green-800 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HARD: 'bg-red-100 text-red-800 border-red-200'
  };

  const badgeConfig = difficultyColors[difficulty] || difficultyColors.MEDIUM;

  return (
    <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-xl shadow-sm mb-6 flex flex-col overflow-hidden">
      {/* Target Difficulty Header */}
      {difficulty && (
         <div className="bg-white px-6 py-3 border-b border-primary-100 flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-widest">Target Difficulty</span>
            <div className={`px-3 py-1 rounded-full border text-xs font-black flex items-center gap-1.5 shadow-sm ${badgeConfig}`}>
                <Flame size={12} strokeWidth={3} />
                {difficulty}
            </div>
         </div>
      )}

      <div className="p-6">
        <h3 className="text-sm font-bold text-primary-800 uppercase tracking-wider mb-2 flex items-center gap-2">
          <MessageSquare size={16} />
          Interview Question
        </h3>
        <p className="text-lg text-secondary-900 leading-relaxed font-medium">
          {question}
        </p>
      </div>
    </div>
  );
}

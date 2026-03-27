import { CheckCircle2, Circle } from 'lucide-react';

export default function ProgressBar({ currentRound, totalRounds }) {
  const percentage = (currentRound / totalRounds) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-secondary-600">
          Round {currentRound} of {totalRounds}
        </span>
        <span className="text-sm font-semibold text-primary-600">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      
      <div className="flex items-center gap-1 w-full">
        {Array.from({ length: totalRounds }).map((_, index) => {
          const roundNum = index + 1;
          const isCompleted = roundNum < currentRound;
          const isCurrent = roundNum === currentRound;

          return (
            <div key={index} className="flex-1">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary-500 animate-pulse' : 'bg-secondary-200'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

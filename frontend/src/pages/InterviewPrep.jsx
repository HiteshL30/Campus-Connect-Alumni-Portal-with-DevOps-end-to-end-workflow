import { useState } from 'react';
import toast from 'react-hot-toast';
import { aiInterviewAPI } from '../services/api';
import RoleSelector from '../components/interview/RoleSelector';
import QuestionCard from '../components/interview/QuestionCard';
import TypedAnswerBox from '../components/interview/TypedAnswerBox';
import VoiceRecorder from '../components/interview/VoiceRecorder';
import FeedbackPanel from '../components/interview/FeedbackPanel';
import InterviewHistory from '../components/interview/InterviewHistory';
import ProgressBar from '../components/interview/ProgressBar';
import InterviewReport from '../components/interview/InterviewReport';
import { Bot, ArrowRight, CornerUpRight, AlertCircle, RefreshCcw } from 'lucide-react';

export default function InterviewPrep() {
  const [session, setSession] = useState(null);
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [answerType, setAnswerType] = useState('type'); // 'type' | 'voice'
  const [answer, setAnswer] = useState('');
  
  // Track current round evaluation so user can review it before advancing
  const [evaluation, setEvaluation] = useState(null);
  const [nextQuestionTarget, setNextQuestionTarget] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const startInterview = async (role) => {
    try {
      setIsGenerating(true);
      setSession(null);
      setReport(null);
      setEvaluation(null);
      setNextQuestionTarget(null);
      setIsFinished(false);
      setAnswer('');
      
      const res = await aiInterviewAPI.startInterview({ role });
      setSession(res.data);
      toast.success('Interview Started!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async (submittedAnswer) => {
    if (!session?.sessionId || !submittedAnswer.trim()) return;

    try {
      setIsEvaluating(true);
      const res = await aiInterviewAPI.submitAnswer({
        sessionId: session.sessionId,
        answer: submittedAnswer
      });
      
      // The backend returns { evaluation, nextQuestion, isFinished }
      setEvaluation(res.data.evaluation);
      setNextQuestionTarget(res.data.nextQuestion);
      setIsFinished(res.data.isFinished);
      
      toast.success('Answer Evaluated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to evaluate answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  const proceedToNextRound = () => {
    setSession(nextQuestionTarget);
    setEvaluation(null);
    setNextQuestionTarget(null);
    setAnswer('');
  };

  const finishInterview = async () => {
    if (!session?.sessionId) return;
    try {
      setIsGenerating(true); // Reuse loader overlay 
      const res = await aiInterviewAPI.finishInterview(session.sessionId);
      setReport(res.data);
      
      // Cleanup run state
      setSession(null);
      setEvaluation(null);
      setNextQuestionTarget(null);
      setIsFinished(false);
      setAnswer('');
      
      toast.success('Interview Completed Successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to finalize interview report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setSession(null);
    setReport(null);
    setEvaluation(null);
    setNextQuestionTarget(null);
    setIsFinished(false);
    setAnswer('');
  };

  const currentAnswerValue = answer;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
            <Bot className="w-10 h-10 text-primary-600 bg-primary-50 p-2 rounded-xl border border-primary-200" />
            AI Mock Interview Agent
          </h1>
          <p className="text-secondary-600 mt-2 text-lg max-w-2xl">
            Simulate a realistic 5-round technical and behavioral interview with context-aware follow-up questions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Landing State - Start Role Selector */}
          {!session && !report && (
            <div className="animate-fade-in transition-all">
              <RoleSelector onSubmit={startInterview} isLoading={isGenerating} />
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
                <AlertCircle className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900">How it works:</h4>
                  <ul className="list-disc list-inside text-sm font-medium text-blue-800 mt-2 space-y-1">
                    <li>The interview consists of up to 5 rounds.</li>
                    <li>Questions will dynamically adapt based on your previous answers.</li>
                    <li>You will receive immediate feedback after each round.</li>
                    <li>A comprehensive assessment report is provided at the end.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Active Interview Progress */}
          {session && (
            <div className="animate-fade-in">
              <ProgressBar currentRound={session.round} totalRounds={5} />
              
              <QuestionCard 
                question={session.question} 
                difficulty={session.difficulty} 
              />

              {!evaluation && (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden mt-6">
                  <div className="flex border-b border-secondary-200">
                    <button
                      onClick={() => setAnswerType('type')}
                      className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                        answerType === 'type'
                          ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50'
                          : 'border-b border-transparent text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                      }`}
                    >
                      Type Answer
                    </button>
                    <button
                      onClick={() => setAnswerType('voice')}
                      className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                        answerType === 'voice'
                          ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50'
                          : 'border-b border-transparent text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                      }`}
                    >
                      Voice Recording
                    </button>
                  </div>

                  <div className="p-1">
                    {answerType === 'type' ? (
                      <TypedAnswerBox
                        answer={currentAnswerValue}
                        setAnswer={setAnswer}
                        onSubmit={() => submitAnswer(currentAnswerValue)}
                        isLoading={isEvaluating}
                      />
                    ) : (
                      <VoiceRecorder
                        transcript={currentAnswerValue}
                        setTranscript={setAnswer}
                        onSubmit={() => submitAnswer(currentAnswerValue)}
                        isLoading={isEvaluating}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Post-Round Feedback Panel & Next Transitions */}
          {evaluation && (
             <div className="space-y-6 animate-fade-in mt-6">
                <FeedbackPanel evaluation={evaluation} />
                
                <div className="flex flex-col sm:flex-row justify-between items-center bg-secondary-50 p-4 border border-secondary-200 rounded-xl">
                    <div className="text-secondary-600 font-medium mb-3 sm:mb-0 text-sm">
                        {isFinished 
                          ? "You've completed all rounds. Well done!" 
                          : "Review the feedback above before proceeding."}
                    </div>

                    {!isFinished && nextQuestionTarget && (
                        <button 
                          onClick={proceedToNextRound}
                          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-colors shadow-md w-full sm:w-auto justify-center"
                        >
                          Next Round <ArrowRight size={18} />
                        </button>
                    )}

                    {isFinished && (
                        <button 
                          onClick={finishInterview}
                          disabled={isGenerating}
                          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors shadow-md w-full sm:w-auto justify-center"
                        >
                          {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <CornerUpRight size={18} />}
                          View Final Report
                        </button>
                    )}
                </div>

                {/* Allow exiting early if not finished, so they don't get stuck */}
                {!isFinished && (
                    <div className="flex justify-center mt-2">
                        <button 
                          onClick={finishInterview}
                          className="text-xs text-secondary-500 font-bold uppercase tracking-wider hover:text-primary-600 transition-colors"
                        >
                          Finish Early & Get Report
                        </button>
                    </div>
                )}
             </div>
          )}

          {/* Final Report Terminal Node */}
          {report && (
             <InterviewReport report={report} onRestart={handleRestart} />
          )}

        </div>

        {/* History Sidebar */}
        <div className="col-span-1 border-t lg:border-t-0 lg:border-l border-secondary-200 lg:pl-8 pt-8 lg:pt-0">
          <InterviewHistory key={report ? report.sessionId : (session ? session.sessionId : 'initial')} />
        </div>
      </div>
    </div>
  );
}

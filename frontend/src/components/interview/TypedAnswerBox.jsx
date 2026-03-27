export default function TypedAnswerBox({ answer, setAnswer, onSubmit, isLoading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-200 mt-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-3">
        Type Your Answer
      </h3>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
        disabled={isLoading}
        placeholder="Type your comprehensive answer here..."
        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-shadow"
      ></textarea>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={!answer.trim() || isLoading}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Evaluating...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
}

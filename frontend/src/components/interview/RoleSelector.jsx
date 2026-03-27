import { useState } from 'react';
import { Briefcase } from 'lucide-react';

export default function RoleSelector({ onSubmit, isLoading }) {
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role.trim()) {
      onSubmit(role);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-200">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <Briefcase className="text-primary-600" />
        Start Interview Practice
      </h2>
      <p className="text-secondary-600 mb-6">
        Enter the role you are preparing for, and our AI will generate a realistic technical interview question.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-1">
            Target Job Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer, Product Manager, Data Analyst"
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!role.trim() || isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </span>
          ) : (
            'Generate Question'
          )}
        </button>
      </form>
    </div>
  );
}

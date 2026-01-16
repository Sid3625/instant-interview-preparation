import { Bug } from "lucide-react";
import { useState } from "react";


interface DebugQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  buggyCode: string;
  correctCode: string;
  bugDescription: string;
  explanation: string;
}

export const CodeDebugQuizApp: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const sampleQuestion: DebugQuestion = {
    id: 1,
    difficulty: 'medium',
    topic: 'Array Methods',
    buggyCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => {
  num * 2; // Bug here!
});
console.log(doubled);`,
    correctCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => {
  return num * 2; // Fixed: Added return
});
console.log(doubled);`,
    bugDescription: 'Missing return statement in arrow function',
    explanation: 'Arrow functions with curly braces need an explicit return statement. Without it, the function returns undefined.'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Bug className="text-red-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Find & Fix the Bug</h1>
        </div>

        {/* Buggy Code */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6 border border-slate-700">
          <div className="text-red-400 text-sm mb-2">🐛 Buggy Code:</div>
          <pre className="text-gray-200 text-sm overflow-x-auto">
            <code>{sampleQuestion.buggyCode}</code>
          </pre>
        </div>

        {/* User Answer */}
        {!showSolution && (
          <>
            <label className="block text-white mb-2 font-semibold">Your Fix:</label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write the corrected code here..."
              className="w-full h-40 p-4 bg-slate-900 text-gray-200 rounded-xl border border-slate-700 font-mono text-sm mb-4 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => setShowSolution(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
            >
              Show Solution
            </button>
          </>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="space-y-4">
            <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">✅ Correct Code:</h3>
              <pre className="text-gray-200 text-sm overflow-x-auto">
                <code>{sampleQuestion.correctCode}</code>
              </pre>
            </div>
            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">💡 Explanation:</h3>
              <p className="text-gray-200 mb-2">
                <strong>Bug:</strong> {sampleQuestion.bugDescription}
              </p>
              <p className="text-gray-200">{sampleQuestion.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
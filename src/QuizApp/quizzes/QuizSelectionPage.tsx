import { Trophy, Brain, Target, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AVAILABLE_QUIZZES } from "../config/quizzes.config";

export const QuizSelectionPage: React.FC<{ onSelectQuiz: (id: string) => void }> = ({ onSelectQuiz }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  return (
   <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-200 to-pink-100 p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="text-center mb-12 pt-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <Trophy className="text-yellow-500" size={48} />
        <h1 className="text-5xl font-bold text-gray-800">Quiz Arena</h1>
      </div>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto">
        Master JavaScript & React through interactive challenges. Choose your battle!
      </p>
    </div>

    {/* Stats Bar */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center border border-white/30">
        <Brain className="mx-auto mb-2 text-blue-500" size={32} />
        <div className="text-3xl font-bold text-gray-800 mb-1">6</div>
        <div className="text-gray-700">Quiz Types</div>
      </div>
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center border border-white/30">
        <Target className="mx-auto mb-2 text-green-500" size={32} />
        <div className="text-3xl font-bold text-gray-800 mb-1">150+</div>
        <div className="text-gray-700">Questions</div>
      </div>
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center border border-white/30">
        <Clock className="mx-auto mb-2 text-purple-500" size={32} />
        <div className="text-3xl font-bold text-gray-800 mb-1">2-3 hrs</div>
        <div className="text-gray-700">Total Content</div>
      </div>
    </div>

    {/* Quiz Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {AVAILABLE_QUIZZES.map((quiz) => (
        <div
          key={quiz.id}
          className={`group relative bg-white/50 backdrop-blur-md rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            selectedQuiz === quiz.id
              ? 'border-gray-300 shadow-xl'
              : 'border-white/30 hover:border-gray-400'
          }`}
          onClick={() => setSelectedQuiz(quiz.id)}
        >
          {/* Gradient Header */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"
            style={{ background: quiz.gradient }}
          />

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white relative z-10"
            style={{ background: quiz.gradient }}
          >
            {quiz.icon}
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">
            {quiz.name}
          </h3>
          <p className="text-gray-700 mb-4 relative z-10">{quiz.description}</p>

          {/* Features */}
          <div className="space-y-2 mb-4 relative z-10">
            {quiz.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {feature}
              </div>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 relative z-10">
            <span>{quiz.questionCount} questions</span>
            <span>{quiz.estimatedTime}</span>
          </div>

          {/* Difficulty Badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-semibold mb-4 relative z-10">
            {quiz.difficulty}
          </div>

          {/* Start Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectQuiz(quiz.id);
            }}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all relative z-10 flex items-center justify-center gap-2 group-hover:gap-3"
            style={{ background: quiz.gradient }}
          >
            Start Quiz
            <ArrowRight size={18} />
          </button>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="text-center mt-12 text-gray-600">
      <p className="text-sm">💡 Tip: Start with easier quizzes to build confidence!</p>
    </div>
  </div>
</div>

  );
};
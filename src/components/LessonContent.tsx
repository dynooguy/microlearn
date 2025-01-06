import React, { useState } from 'react';
import { Clock, BookOpen, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Lesson } from '../types';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === lesson.quiz.correctAnswer) {
      onComplete(lesson.id);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="perspective">
      <div className={`relative transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front side - Lesson Content */}
        <div className={`absolute w-full backface-hidden ${isFlipped ? 'invisible' : ''}`}>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
              <div className="flex items-center text-blue-600">
                <Clock className="w-5 h-5 mr-1" />
                <span>{lesson.duration} min</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>Reading material</span>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none mb-8">
              {lesson.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mb-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.slice(2)}</li>;
                }
                if (line.match(/^\d+\./)) {
                  return <li key={index} className="ml-4">{line.slice(line.indexOf('.') + 2)}</li>;
                }
                return line.trim() ? <p key={index} className="mb-4">{line}</p> : null;
              })}
            </div>

            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Take the Quiz</span>
            </button>
          </div>
        </div>

        {/* Back side - Quiz */}
        <div className={`absolute w-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Knowledge Check</h2>
              <button
                onClick={() => !showResult && setIsFlipped(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-lg font-medium mb-6">{lesson.quiz.question}</p>
            <div className="space-y-4">
              {lesson.quiz.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  } ${
                    showResult && index === lesson.quiz.correctAnswer
                      ? 'border-green-600 bg-green-50'
                      : showResult && index === selectedAnswer
                      ? 'border-red-600 bg-red-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => !showResult && setSelectedAnswer(index)}
                      className="h-4 w-4 text-purple-600"
                      disabled={showResult}
                    />
                    <span>{option}</span>
                    {showResult && index === lesson.quiz.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                    {showResult && index === selectedAnswer && index !== lesson.quiz.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                    )}
                  </div>
                </label>
              ))}
            </div>

            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-6 space-y-4">
                {selectedAnswer === lesson.quiz.correctAnswer ? (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Correct! Lesson marked as complete.
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Incorrect. Try again!
                  </div>
                )}
                {selectedAnswer !== lesson.quiz.correctAnswer && (
                  <button
                    onClick={resetQuiz}
                    className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
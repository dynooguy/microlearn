import React, { useState, useEffect, useRef } from 'react';
import { Clock, BookOpen, CheckCircle, XCircle, RotateCcw, Volume2, VolumeX, Pause, MessageSquare } from 'lucide-react';
import { Lesson } from '../types';
import { AIAssistant } from './AIAssistant';

interface LessonContentProps {
  lesson: Lesson;
  moduleId: string;
  onComplete: (lessonId: string, moduleId: string) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson, moduleId, onComplete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    speechRef.current = new SpeechSynthesisUtterance();
    speechRef.current.lang = 'de-DE';
    speechRef.current.rate = 0.9;
    speechRef.current.pitch = 1;

    // Handle speech end
    const handleSpeechEnd = () => {
      setIsPlaying(false);
    };

    speechRef.current.onend = handleSpeechEnd;

    // Cleanup
    return () => {
      if (speechRef.current) {
        speechRef.current.onend = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isFlipped && contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isFlipped]);

  const toggleAudio = () => {
    if (!speechRef.current) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Extract text content from lesson
      const textContent = lesson.content
        .split('\n')
        .map(line => {
          if (line.startsWith('#')) {
            return line.replace(/#/g, '').trim();
          }
          if (line.startsWith('- ')) {
            return line.slice(2);
          }
          if (line.match(/^\d+\./)) {
            return line.slice(line.indexOf('.') + 1);
          }
          return line;
        })
        .filter(line => line.trim())
        .join('. ');

      speechRef.current.text = textContent;
      window.speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === lesson.quiz.correctAnswer) {
      onComplete(lesson.id, moduleId);
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
          <div className="bg-gray-100 rounded-t-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAssistant(!showAssistant)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">KI-Assistent</span>
                </button>
                <button
                  onClick={toggleAudio}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="text-sm">Pause</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">Vorlesen</span>
                    </>
                  )}
                </button>
                <div className="flex items-center text-amber-600">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{lesson.duration} Min.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm text-amber-600">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>Lernmaterial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div ref={contentRef}>
              <div className="prose max-w-none mb-8">
                {lesson.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mb-4 text-gray-800">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-700">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index} className="ml-4 text-gray-600">{line.slice(2)}</li>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <li key={index} className="ml-4 text-gray-600">{line.slice(line.indexOf('.') + 2)}</li>;
                  }
                  return line.trim() ? <p key={index} className="mb-4 text-gray-600">{line}</p> : null;
                })}
              </div>

              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg font-semibold"
              >
                <span>Quiz starten</span>
              </button>
            </div>

            {showAssistant && (
              <div className="h-full">
                <AIAssistant course={{ title: 'Kurs', modules: [] }} currentLesson={lesson} />
              </div>
            )}
          </div>
        </div>

        {/* Back side - Quiz */}
        <div className={`absolute w-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}>
          <div className="bg-gray-100 rounded-t-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Wissensüberprüfung</h2>
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
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-200'
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
                      className="h-4 w-4 text-amber-600"
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
                className="mt-6 w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                Antwort einreichen
              </button>
            ) : (
              <div className="mt-6 space-y-4">
                {selectedAnswer === lesson.quiz.correctAnswer ? (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Richtig! Lektion als abgeschlossen markiert.
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Falsch. Versuche es noch einmal!
                  </div>
                )}
                {selectedAnswer !== lesson.quiz.correctAnswer && (
                  <button
                    onClick={resetQuiz}
                    className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Erneut versuchen
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
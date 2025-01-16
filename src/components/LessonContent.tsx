import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, MessageSquare, CheckCircle, RotateCw, RotateCcw, X } from 'lucide-react';
import { Lesson } from '../types';
import { AIAssistant } from './AIAssistant';
import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

interface LessonContentProps {
  lesson: Lesson;
  moduleId: string;
  onComplete: (lessonId: string, moduleId: string) => void;
  onClose: () => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson, moduleId, onComplete, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openai, setOpenai] = useState<OpenAI | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeOpenAI();
  }, []);

  const initializeOpenAI = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('service', 'openai')
        .single();

      if (error) {
        console.error('Error fetching OpenAI API key:', error);
        throw new Error('Could not fetch OpenAI API key');
      }

      if (!data?.key) {
        throw new Error('OpenAI API key not found');
      }

      const openaiInstance = new OpenAI({
        apiKey: data.key,
        dangerouslyAllowBrowser: true
      });

      setOpenai(openaiInstance);
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      setError('Text-to-Speech konnte nicht initialisiert werden.');
    }
  };

  const generateSpeech = async () => {
    if (!openai) return;

    try {
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

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: textContent,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      setError('Fehler beim Generieren der Sprachausgabe.');
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioUrl) {
        await generateSpeech();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleComplete = () => {
    onComplete(lesson.id, moduleId);
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="perspective">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setError('Fehler bei der Audiowiedergabe.');
          setIsPlaying(false);
        }}
      />
      
      <div className={`relative transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front side - Lesson Content */}
        <div className={`absolute w-full backface-hidden ${isFlipped ? 'invisible' : ''}`}>
          <div className="bg-yellow-300 shadow-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 truncate pr-4">
                  {lesson.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleAudio}
                    disabled={!openai}
                    className="p-2 rounded-full hover:bg-amber-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isPlaying ? 'Pause' : 'Vorlesen'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-2 rounded-full hover:bg-amber-300 text-gray-700 transition-colors"
                    title="Zur KI-Assistenz wechseln"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleComplete}
                    className={`p-2 rounded-md transition-colors ${
                      lesson.completed
                        ? 'bg-green-100 text-green-600'
                        : 'hover:bg-amber-300 text-green-600'
                    }`}
                    title={lesson.completed ? 'Abgeschlossen' : 'Als erledigt markieren'}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-amber-500/30" />
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-amber-300 text-red-600 transition-colors"
                    title="Schließen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="p-6" ref={contentRef}>
            <div className="prose max-w-none">
              {lesson.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return null; // Skip the title as it's shown in the header
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
          </div>
        </div>

        {/* Back side - AI Assistant */}
        <div className={`absolute w-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}>
          <div className="bg-yellow-300 shadow-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  KI-Lernassistent
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="p-2 rounded-full hover:bg-amber-300 text-gray-700 transition-colors"
                    title="Zurück zum Inhalt"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-amber-500/30" />
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-amber-300 text-red-600 transition-colors"
                    title="Schließen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <AIAssistant 
              course={{ title: lesson.title, modules: [] }} 
              currentLesson={lesson} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
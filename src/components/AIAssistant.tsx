import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import { Course, Lesson } from '../types';
import OpenAI from 'openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  course: Course;
  currentLesson: Lesson | null;
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const AIAssistant: React.FC<AIAssistantProps> = ({ course, currentLesson }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if OpenAI is properly configured
    if (!API_KEY) {
      setError('Der KI-Assistent ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.');
      return;
    }

    // Initialize OpenAI client
    try {
      const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      setError('Der KI-Assistent konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.');
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isInitialized) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
      });

      const systemPrompt = `Du bist ein hilfreicher Lernassistent für den Kurs "${course.title}". 
        ${currentLesson ? `Aktuelle Lektion: "${currentLesson.title}"` : ''}
        
        Deine Aufgaben:
        1. Beantworte Fragen zum Kursinhalt präzise und verständlich
        2. Gib konstruktives Feedback zu Antworten der Lernenden
        3. Erkläre komplexe Konzepte mit einfachen Worten
        4. Motiviere die Lernenden und unterstütze ihren Lernfortschritt
        
        Wichtige Regeln:
        1. Antworte immer auf Deutsch
        2. Verwende einen freundlichen, ermutigenden Ton
        3. Bei technischen Problemen oder wenn du eine Frage nicht beantworten kannst, 
           sage "Entschuldigung, ich konnte deine Frage gerade nicht verarbeiten. Bitte versuche es später noch einmal."
        4. Bleibe immer beim Thema des Kurses und der aktuellen Lektion`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const assistantMessage = response.choices[0]?.message?.content;
      if (assistantMessage) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      } else {
        throw new Error('No response from assistant');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Entschuldigung, ich konnte deine Frage gerade nicht verarbeiten. Bitte versuche es später noch einmal.');
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, ich konnte deine Frage gerade nicht verarbeiten. Bitte versuche es später noch einmal.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized || error) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-gray-50 border-b flex items-center space-x-2">
          <Bot className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">KI-Lernassistent</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">
              {error || 'Der KI-Assistent wird initialisiert...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gray-50 border-b flex items-center space-x-2">
        <Bot className="w-5 h-5 text-amber-600" />
        <h3 className="font-semibold text-gray-800">KI-Lernassistent</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            <p>Stelle eine Frage zum Kursinhalt oder zur aktuellen Lektion.</p>
            <p className="text-sm mt-2">Ich helfe dir gerne beim Lernen!</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-amber-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stelle eine Frage zum Kursinhalt..."
            className="flex-1 rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
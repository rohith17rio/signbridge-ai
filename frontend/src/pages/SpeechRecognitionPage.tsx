import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useChat } from '../context/ChatContext';
import { FiMic, FiMicOff, FiSend, FiTrash2 } from 'react-icons/fi';
import { TbHandClick } from 'react-icons/tb';

export const SpeechRecognitionPage: React.FC = () => {
  const { messages, addMessage, clearMessages } = useChat();
  const [typedInput, setTypedInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partialTranscript]);

  // Web Speech API initialization for voice typing (STT)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setPartialTranscript(interim);
        }

        if (final.trim()) {
          addMessage(final.trim(), 'speech');
          setPartialTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (partialTranscript.trim()) {
          addMessage(partialTranscript.trim(), 'speech');
          setPartialTranscript('');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [addMessage, partialTranscript]);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setPartialTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendTypedMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedInput.trim()) return;
    addMessage(typedInput.trim(), 'type');
    setTypedInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <TbHandClick className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold font-tech text-slate-800 dark:text-slate-100 flex items-center gap-2">
                💬 SignSetu Unified Chat
              </h1>
              <p className="text-xs text-slate-500">
                Single chronological conversation thread merging Live Sign Recognition, Voice Typing, and Typed Messages
              </p>
            </div>
          </div>

          <button
            onClick={clearMessages}
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-400 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Clear Chat Thread"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>
      </GlassCard>

      {/* Main Unified Chat Feed Container */}
      <GlassCard className="h-[60vh] flex flex-col justify-between p-4 sm:p-6">
        {/* Messages Feed List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.source === 'type' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1 px-1">
                {msg.source === 'sign' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    🖐️ Sign Recognized
                  </span>
                )}
                {msg.source === 'speech' && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                    🎤 Voice Speech-to-Text
                  </span>
                )}
                {msg.source === 'type' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-500/15 text-slate-300 border border-slate-500/20">
                    ⌨️ Typed Message
                  </span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm font-sans shadow-md ${
                  msg.source === 'sign'
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 text-emerald-100 font-bold font-tech text-base tracking-wide'
                    : msg.source === 'speech'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 text-indigo-100'
                    : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-medium'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Partial Live Speech Transcription Bubble */}
          {isListening && (
            <div className="flex flex-col items-start animate-pulse">
              <span className="text-[10px] font-bold text-indigo-400 mb-1 px-1 flex items-center gap-1">
                <FiMic className="animate-ping text-indigo-400" /> Listening to voice...
              </span>
              <div className="max-w-[75%] px-4 py-3 rounded-2xl text-sm bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 italic font-mono">
                {partialTranscript || 'Speak now...'}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Toolbar Section */}
        <form onSubmit={handleSendTypedMessage} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* Voice Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleVoiceListening}
            className={`p-3.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
            }`}
            title={isListening ? 'Click to stop speaking' : 'Click to start speaking (Speech-to-Text)'}
          >
            {isListening ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            placeholder="Type a message to send..."
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

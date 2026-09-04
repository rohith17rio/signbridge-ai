import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import { FiMic, FiMicOff, FiSend, FiTrash2, FiMessageSquare } from 'react-icons/fi';

export const UnifiedChatBox: React.FC = () => {
  const { messages, addMessage, clearMessages } = useChat();
  const { t } = useApp();
  const [typedInput, setTypedInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [accumulatedVoiceText, setAccumulatedVoiceText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, accumulatedVoiceText, isRecording]);

  // Web Speech API for WhatsApp-style voice recording
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let textBuffer = '';
        for (let i = 0; i < event.results.length; ++i) {
          textBuffer += event.results[i][0].transcript;
        }
        setAccumulatedVoiceText(textBuffer);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Handler: Start Voice Recording on Mic click
  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (!isRecording) {
      setAccumulatedVoiceText('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Handle if already started
      }
      setIsRecording(true);
    }
  };

  // Handler: Stop Recording ONLY when Send is pressed (Section 4 requirement)
  const handleSendVoiceOrText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRecording) {
      // Stop voice recording and submit accumulated voice text
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);

      if (accumulatedVoiceText.trim()) {
        addMessage(accumulatedVoiceText.trim(), 'speech');
        setAccumulatedVoiceText('');
      }
      return;
    }

    // Normal typed text send
    if (typedInput.trim()) {
      addMessage(typedInput.trim(), 'type');
      setTypedInput('');
    }
  };

  return (
    <GlassCard className="p-4 sm:p-6 space-y-4 shadow-xl transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 dark:bg-brand-500/10 text-sky-600 dark:text-brand-400 border border-sky-500/20 dark:border-brand-500/20">
            <FiMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base font-tech text-slate-900 dark:text-slate-100 flex items-center gap-2">
              💬 {t('chatHeader')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Sign Recognized (LEFT) • User Typed Messages (RIGHT) • Voice Speech-to-Text
            </p>
          </div>
        </div>

        <button
          onClick={clearMessages}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
          title={t('clearChat')}
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          <span>{t('clearChat')}</span>
        </button>
      </div>

      {/* WhatsApp-Style Chat Feed Window */}
      <div className="h-[460px] overflow-y-auto space-y-3.5 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.source === 'type' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Tag / Badge Header */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 px-1">
              {msg.source === 'sign' && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                  {t('signTag')}
                </span>
              )}
              {msg.source === 'speech' && (
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/20">
                  {t('speechTag')}
                </span>
              )}
              {msg.source === 'type' && (
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/20">
                  {t('typedTag')}
                </span>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-sans shadow-md ${
                msg.source === 'sign'
                  ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-bold font-tech text-base rounded-tl-none'
                  : msg.source === 'speech'
                  ? 'bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-950 dark:to-slate-900 border border-indigo-300 dark:border-indigo-500/30 text-indigo-950 dark:text-indigo-100 rounded-tl-none'
                  : 'bg-sky-600 dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 text-white font-medium rounded-tr-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Active Voice Recording Partial Bubble */}
        {isRecording && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mb-1 px-1 flex items-center gap-1">
              <FiMic className="animate-ping text-rose-500" /> {t('recordingVoice')}
            </span>
            <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-100 italic font-mono rounded-tl-none">
              {accumulatedVoiceText || t('clickToSendVoice')}
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSendVoiceOrText} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
        {/* Mic Recording Trigger Button */}
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/40 opacity-90'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
          }`}
          title="Click to start voice recording"
        >
          {isRecording ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
        </button>

        {/* Text Input Box */}
        <input
          type="text"
          placeholder={t('typePlaceholder')}
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          disabled={isRecording}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-sky-500 dark:focus:ring-brand-500 focus:outline-none disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!isRecording && !typedInput.trim()}
          className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
            isRecording
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30 animate-bounce'
              : 'bg-sky-600 hover:bg-sky-500 dark:bg-brand-600 dark:hover:bg-brand-500 text-white shadow-md disabled:opacity-50'
          }`}
        >
          <FiSend className="w-4 h-4" />
          <span>{t('send')}</span>
        </button>
      </form>
    </GlassCard>
  );
};

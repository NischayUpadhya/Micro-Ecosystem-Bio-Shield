import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Leaf,
  Info,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';
import { RAGSource } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatBubble {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RAGSource[];
  expertVerificationSuggested?: boolean;
  safeManagementFlags?: string[];
  timestamp: string;
}

export const SustainabilityChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your **Campus Biodiversity & Sustainability Assistant**. I can help you investigate recorded campus flora, safe physical management strategies for invasive plants, ecological desert zones, and potential pollinator corridor connections.\n\nAll recommendations are grounded in our verified campus botanical repository and follow strict non-chemical stewardship policies.",
      timestamp: 'Just now',
      safeManagementFlags: ['Safe Non-Chemical Policy', 'RAG-Grounded AI']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userBubble: ChatBubble = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userBubble]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await sendChatMessage(history, query);

      const botBubble: ChatBubble = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        sources: res.sources,
        expertVerificationSuggested: res.expert_verification_suggested,
        safeManagementFlags: res.safe_management_flags,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botBubble]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorBubble: ChatBubble = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Error contacting the campus sustainability service. Please ensure the backend is running.',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorBubble]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What invasive species have we observed on campus?',
    'Which campus areas need restoration the most?',
    'How do we manage English Ivy without chemicals?',
    'How can we improve habitat connectivity for pollinators?'
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            RAG-Grounded Conversational Steward
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI Campus Sustainability Assistant
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Safety Guardrails: Active
          </span>
        </div>
      </div>

      {/* Suggested prompts row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Quick Inquiries:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition shrink-0 whitespace-nowrap shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-600/20 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                m.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-sm shadow-md'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}
            >
              <div className="text-xs leading-relaxed whitespace-pre-line font-normal">
                {m.content}
              </div>

              {/* Safe Management Badges */}
              {m.safeManagementFlags && m.safeManagementFlags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.safeManagementFlags.map((flag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              {/* Citations Box */}
              {m.sources && m.sources.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-2 mt-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Knowledge Grounding Citations ({m.sources.length})
                  </div>
                  <div className="space-y-1.5">
                    {m.sources.map((s, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="font-semibold text-slate-800">{s.title}</div>
                        <div className="text-slate-500 italic">"{s.excerpt}"</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Ref: {s.citation_ref}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expert Verification Recommendation */}
              {m.expertVerificationSuggested && (
                <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-[11px] text-purple-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Human-in-the-loop:</strong> Insufficient high-confidence data in knowledge base. Expert botanical verification strongly suggested.
                  </span>
                </div>
              )}

              <div
                className={`text-[10px] text-right font-mono ${
                  m.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3.5 items-center text-xs text-slate-500 italic">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>Grounding query with campus ecological database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about campus invasive species, safe non-chemical management, or pollinator corridors..."
          className="flex-1 px-4 py-3 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition disabled:opacity-50 shadow-sm flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function KisanAIChatbot() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'mr' 
        ? '🙏 नमस्कार! मी आपला **AgroConnect किसान सहाय्यक** आहे. आजचे कळमना मंडी भाव, थेट खरेदीतील बचत किंवा पीक सल्ल्याबद्दल मला विचारा.'
        : lang === 'hi'
        ? '🙏 नमस्ते! मैं आपका **AgroConnect किसान सहायक** हूँ। आज के कलमना मंडी भाव, बचत या फसल परामर्श हेतु मुझसे पूछें।'
        : '🌾 Namaste! I am your **Kisan AI Assistant**. Ask me about live Kalamna APMC rates, direct farmer savings, or consignment tracking!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    lang === 'mr' ? 'कळमना संत्रा भाव आज' : lang === 'hi' ? 'कलमना संतरा भाव आज' : 'Kalamna Santra Rate Today',
    lang === 'mr' ? 'हळद खरेदीतील थेट बचत' : lang === 'hi' ? 'हल्दी खरीद पर सीधी बचत' : 'Turmeric Direct Savings',
    'Track #AGC-20260829-NAGPUR01',
    lang === 'mr' ? 'सोयाबीन साठवणूक सल्ला' : lang === 'hi' ? 'सोयाबीन भंडारण सलाह' : 'Soybean Storage Tips'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.sendAIChat(query, lang);
      setMessages(prev => [...prev, { sender: 'ai', text: response.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: '⚠️ Apologies, I could not retrieve that information right now. Please try again or check the Mandi Analytics page.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs px-4 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 border-2 border-emerald-300 dark:border-emerald-500"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </div>
          <span className="hidden sm:inline tracking-wide font-black">
            {t('kisanAI')}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[90vw] sm:w-96 h-[500px] max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-slate-900 dark:text-slate-100">
          
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs flex items-center gap-1">
                  Kisan AI Assistant <Sparkles className="w-3 h-3 text-amber-400 inline" />
                </h4>
                <p className="text-[10px] text-emerald-300">Vidarbha Agro & APMC Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-2 border-b border-emerald-100 dark:border-emerald-900/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-slate-700 rounded-full font-medium text-emerald-900 dark:text-emerald-300 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs p-2 bg-slate-100 dark:bg-slate-800 w-24 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about mandi rates, crops, savings..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

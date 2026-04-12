'use client';

import { useState, use } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';

interface Msg {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStep?: boolean;
}

export default function ChatPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = use(params);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: async (text: string) => {
      // Hardcoded dummy IDs since we stubbed auth and haven't fetched real IDs in this UI layer
      const payload = {
        productInstanceId: '60d21b4667d0d8992e610c85', // mocked for UI Demo
        conversationId: '60d21b4667d0d8992e610c86', 
        message: text
      };

      const res = await fetch(`/api/projects/${projectSlug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((step: any, i: number) => {
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + i, role: 'system', content: step.content, isStep: true }]);
          }, i * 600); // staggering step appearance
        });
        
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now() + 100, role: 'assistant', content: data.response.content }]);
        }, data.steps.length * 600 + 500);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: data.response.content }]);
      }
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: input }]);
    chatMutation.mutate(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto pt-8">
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={clsx("flex items-start max-w-[80%]", 
            m.role === 'user' ? "ml-auto flex-row-reverse" : "",
            m.isStep ? "mx-auto text-neutral-500 opacity-80 mb-2" : ""
          )}>
            {!m.isStep && (
              <div className={clsx("w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mt-1",
                m.role === 'user' ? "bg-indigo-600 ml-4" : "bg-neutral-800 border border-neutral-700 mr-4"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-400" />}
              </div>
            )}
            
            <div className={clsx(
              "px-5 py-3.5 rounded-2xl",
              m.role === 'user' ? "bg-indigo-600 text-white rounded-br-sm shadow-md" : 
              m.isStep ? "bg-transparent text-xs py-1 flex items-center space-x-2" :
              "bg-surface border border-neutral-800 text-neutral-200 rounded-bl-sm shadow-md"
            )}>
              {m.isStep && chatMutation.isPending && <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />}
              {m.isStep ? <span className="italic">{m.content}</span> : <p className="leading-relaxed">{m.content}</p>}
            </div>
          </div>
        ))}
        {chatMutation.isPending && !messages[messages.length-1]?.isStep && (
          <div className="flex items-start max-w-[80%]">
             <div className="w-8 h-8 flex-shrink-0 rounded-full bg-neutral-800 border border-neutral-700 mr-4 flex items-center justify-center mt-1">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-surface border border-neutral-800 shadow-md flex items-center space-x-2">
                 <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                 <span className="text-neutral-400 text-sm">Thinking...</span>
              </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={chatMutation.isPending}
            placeholder="Send a message..."
            className="w-full bg-surface border border-neutral-700 focus:border-indigo-500 rounded-full px-6 py-4 pr-16 outline-none text-white shadow-xl transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Bot, User } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMyActiveSessionQuery, useSendMessageMutation, useAgentReplyMutation } from '@/api/hooks/chat.hooks';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export default function ChatSupport() {
  const { data: activeSession, isLoading } = useMyActiveSessionQuery();
  const sendMessageMutation = useSendMessageMutation();
  const agentReplyMutation = useAgentReplyMutation();
  const { toast } = useToast();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dbMessages = activeSession?.messages || [];
  const uiMessages: Message[] = dbMessages.map((m: any) => ({
    id: m.id,
    text: m.text,
    sender: m.sender === 'USER' ? 'user' : 'agent',
    timestamp: new Date(m.createdAt),
  }));

  const displayMessages: Message[] = [
    {
      id: '__welcome__',
      text: "Hi! 👋 Welcome to Protein & Nutrients support. I'm here to help you with your orders, products, or any questions you have.",
      sender: 'agent',
      timestamp: new Date(Date.now() - 60000),
    },
    ...uiMessages,
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const currentText = inputValue;
    setInputValue('');
    setIsTyping(true);
    try {
      const result = await sendMessageMutation.mutateAsync({
        text: currentText,
        sessionId: activeSession?.id,
      });
      setTimeout(async () => {
        const responses = [
          'I understand. Let me check that for you.',
          'Could you please provide your order number?',
          'I can certainly help with that request.',
          "Is there anything else you'd like to know?",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        try {
          const sessionId = activeSession?.id || result.sessionId;
          if (sessionId) {
            await agentReplyMutation.mutateAsync({ text: randomResponse, sessionId });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsTyping(false);
        }
      }, 1500);
    } catch (error: any) {
      console.error('Failed to send message', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message. Please log in.',
        variant: 'destructive',
      });
      setIsTyping(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black pt-28 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-[calc(100vh-9rem)] flex flex-col">

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10 border border-gray-100">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold">SA</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">Support Team</p>
                  <p className="text-[11px] text-emerald-500 font-medium">Online · Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Bot className="w-3.5 h-3.5" />
                Live Support
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-5 py-4 bg-[#F7F8FA]/50">
              <div className="space-y-4">
                {/* Date pill */}
                <div className="flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1">
                    Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {displayMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <Avatar className="w-7 h-7 flex-shrink-0 border border-gray-100 mt-1">
                      {msg.sender === 'agent' ? (
                        <>
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" />
                          <AvatarFallback className="bg-gray-100 text-[9px] font-bold text-gray-600">SA</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-black text-[9px] font-bold text-white">ME</AvatarFallback>
                      )}
                    </Avatar>

                    {/* Bubble */}
                    <div className={`max-w-[72%]`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-black text-white rounded-tr-sm'
                            : 'bg-white border border-gray-100 text-black rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2.5"
                    >
                      <Avatar className="w-7 h-7 flex-shrink-0 border border-gray-100">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" />
                        <AvatarFallback className="bg-gray-100 text-[9px] font-bold">SA</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-50"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message…"
                  className="flex-1 px-4 py-2.5 text-sm bg-[#F7F8FA] border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-50"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-900 disabled:opacity-40 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

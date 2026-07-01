import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Paperclip, Smile, MoreVertical, Phone, Video, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMyActiveSessionQuery, useSendMessageMutation, useAgentReplyMutation } from '@/api/hooks/chat.hooks';
import { useToast } from '@/hooks/use-toast';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

const ChatSupport = () => {
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
        timestamp: new Date(m.createdAt)
    }));

    const displayMessages = [
        {
            id: '1',
            text: "Hello! Welcome to Luxe Support. I'm Sarah, your virtual assistant. How can I help you today?",
            sender: 'agent',
            timestamp: new Date(Date.now() - 60000)
        } as Message,
        ...uiMessages
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
                sessionId: activeSession?.id 
            });

            // Simulate agent response via backend
            setTimeout(async () => {
                const responses = [
                    "I understand. Let me check that for you.",
                    "Could you please provide your order number?",
                    "I can certainly help with that request.",
                    "Is there anything else you'd like to know about our premium services?"
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
            console.error("Failed to send message", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send message. Please log in.",
                variant: "destructive"
            });
            setIsTyping(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary/30 pt-24 pb-12 lg:pt-32 lg:pb-20 flex flex-col">
                <div className="container-luxe flex-1 flex flex-col max-w-5xl h-[calc(100vh-180px)]">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden flex flex-col"
                    >
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" />
                                        <AvatarFallback>SA</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-sm">Sarah - Luxe Support</h2>
                                    <p className="text-xs text-muted-foreground">Typically replies in a few minutes</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <Phone className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Call Support</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <Video className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Video Call</TooltipContent>
                                </Tooltip>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <ScrollArea className="flex-1 p-4 bg-secondary/10">
                            <div className="space-y-6 pb-4">
                                <div className="text-center text-xs text-muted-foreground my-4">
                                    <span>Today, {new Date().toLocaleDateString()}</span>
                                </div>

                                {displayMessages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] md:max-w-[60%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Avatar className="h-8 w-8 border border-border shrink-0">
                                                {msg.sender === 'user' ? (
                                                    <>
                                                        <AvatarFallback className="bg-primary/10 text-primary">ME</AvatarFallback>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" />
                                                        <AvatarFallback>SA</AvatarFallback>
                                                    </>
                                                )}
                                            </Avatar>

                                            <div
                                                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                          ${msg.sender === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                                        : 'bg-card border border-border/50 rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.text}
                                                <div className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="flex items-end gap-2">
                                            <Avatar className="h-8 w-8 border border-border shrink-0">
                                                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" />
                                                <AvatarFallback>SA</AvatarFallback>
                                            </Avatar>
                                            <div className="bg-card border border-border/50 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-card border-t border-border/50">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary shrink-0">
                                    <Paperclip className="w-5 h-5" />
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Type your message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="pr-10 py-6 bg-secondary/20 border-transparent focus:bg-background transition-all"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary h-8 w-8"
                                    >
                                        <Smile className="w-5 h-5" />
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shrink-0 shadow-md transition-all hover:scale-105 active:scale-95"
                                    disabled={!inputValue.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>

                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ChatSupport;

"use client";
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { StreamChannel } from '@/types';

export interface ChatContextType {
    channels: StreamChannel[];
    setChannels: Dispatch<SetStateAction<StreamChannel[]>>;
    activeChannel: StreamChannel | undefined;
    setActiveChannel: Dispatch<SetStateAction<StreamChannel | undefined>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [channels, setChannels] = useState<StreamChannel[]>([]);
    const [activeChannel, setActiveChannel] = useState<StreamChannel>();

    return (
        <ChatContext.Provider value={{ channels, setChannels, activeChannel, setActiveChannel }}>
            {children}
        </ChatContext.Provider>
    );
};
import { createContext, useContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [value, setValue] = useState(null);

    return (
        <ChatContext.Provider value={{ value, setValue }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use the ChatContext
export const useChat = () => useContext(ChatContext);

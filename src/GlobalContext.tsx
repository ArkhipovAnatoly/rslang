import React, { createContext, useContext, useMemo, useState } from 'react';

export type GlobalContent = {
    userId: string;
    setUserId: (c: string) => void;
};

const GlobalContext: React.Context<GlobalContent> = createContext<GlobalContent>({
    userId: '',
    setUserId: () => {},
});

export const GlobalContextProvider: React.FC = ({ children }) => {
    const [userId, setUserId] = useState<string>('');
    const context = useMemo(() => ({ userId, setUserId }), [userId]);
    return <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);

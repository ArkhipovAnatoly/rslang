import React, { createContext, useContext, useMemo, useState } from 'react';

export type GlobalContent = {
    isPageLearned: boolean;
    setIsPageLearned: (c: boolean) => void;
    totalPagesLearned: number;
    setTotalPagesLearned: (c: React.SetStateAction<number>) => void;
    isAuth: boolean;
    setIsAuth: (c: boolean) => void;
};

const GlobalContext: React.Context<GlobalContent> = createContext<GlobalContent>({
    isPageLearned: false,
    totalPagesLearned: 0,
    setIsPageLearned: () => {},
    setTotalPagesLearned: () => {},
    isAuth: false,
    setIsAuth: () => {},
});

export const GlobalContextProvider: React.FC = ({ children }) => {
    const [isPageLearned, setIsPageLearned] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [totalPagesLearned, setTotalPagesLearned] = useState<number>(0);
    const context = useMemo(
        () => ({ isPageLearned, setIsPageLearned, totalPagesLearned, setTotalPagesLearned, isAuth, setIsAuth }),
        [isPageLearned, totalPagesLearned, isAuth]
    );
    return <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);

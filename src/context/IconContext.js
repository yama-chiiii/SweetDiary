import React, { createContext, useContext, useState } from 'react';

const IconContext = createContext();

export const useIcons = () => useContext(IconContext);

export const IconProvider = ({ children }) => {
    const [icons, setIcons] = useState({});

    const setIconForDate = (date, icon) => {
        setIcons(prevIcons => ({ ...prevIcons, [date]: icon }));
    };

    return (
        <IconContext.Provider value={{ icons, setIconForDate }}>
            {children}
        </IconContext.Provider>
    );
};

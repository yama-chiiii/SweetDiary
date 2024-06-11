import React, { createContext, useContext, useState } from 'react';

// ユーザー情報を保持するContextの作成
const UserContext = createContext();

// ユーザー情報を管理するプロバイダーコンポーネント
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ユーザー情報の状態

    // ユーザー情報を設定する関数
    const value = {
        user,
        setUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// ユーザー情報を使うためのカスタムフック
export const useUser = () => useContext(UserContext);

export default UserContext;

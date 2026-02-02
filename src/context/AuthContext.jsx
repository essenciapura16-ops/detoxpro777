import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Verificar token ao carregar
    useEffect(() => {
        const verifyToken = async () => {
            const savedToken = localStorage.getItem('token');

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                // Para agora, apenas verificar que o token existe
                // A verificação total seria feita em um endpoint real de verify
                setUser({ token: savedToken });
                setToken(savedToken);
            } catch (error) {
                console.error('Erro ao verificar token:', error);
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (email, senha) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Salvar token e usuário
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (nome, email, senha) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Erro ao criar conta');
            }

            // Salvar token e usuário
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

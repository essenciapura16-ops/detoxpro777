import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyTask from './pages/DailyTask';
import Recipes from './pages/Recipes';
import Progress from './pages/Progress';
import Ebook from './pages/Ebook';
import CalorieAnalysis from './pages/CalorieAnalysis';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Rotas públicas */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Rotas protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tarefa/:dia"
                    element={
                        <ProtectedRoute>
                            <DailyTask />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/receitas"
                    element={
                        <ProtectedRoute>
                            <Recipes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/progresso"
                    element={
                        <ProtectedRoute>
                            <Progress />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ebook"
                    element={
                        <ProtectedRoute>
                            <Ebook />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analise-calorias"
                    element={
                        <ProtectedRoute>
                            <CalorieAnalysis />
                        </ProtectedRoute>
                    }
                />

                {/* Rota padrão */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;

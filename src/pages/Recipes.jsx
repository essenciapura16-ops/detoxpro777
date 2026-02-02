import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen,
    Search,
    Leaf,
    Scale,
    ArrowLeft,
    FileText,
    ChefHat,
    Sparkles,
    Clock
} from 'lucide-react';
import './Recipes.css';

function Recipes() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [receitas, setReceitas] = useState({ detox: [], emagrecimento: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('detox');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReceitas();
    }, []);

    const fetchReceitas = async () => {
        try {
            const response = await fetch('/api/tasks/receitas/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReceitas({
                    detox: data.detox || [],
                    emagrecimento: data.emagrecimento || []
                });
            }
        } catch (error) {
            console.error('Erro ao buscar receitas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReceitas = receitas[activeTab].filter(receita =>
        receita.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="recipes-container">
            <header className="recipes-header">
                <div className="container">
                    <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar
                    </button>
                </div>
            </header>

            <main className="recipes-main">
                <div className="container">
                    <div className="recipes-title-section fade-in">
                        <div className="flex-center" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                            <BookOpen size={40} color="var(--primary-green)" />
                        </div>
                        <h1>Biblioteca de Receitas</h1>
                        <p>Explore receitas saudáveis para sua jornada</p>
                    </div>

                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar receita..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="recipes-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'detox' ? 'active' : ''}`}
                            onClick={() => setActiveTab('detox')}
                        >
                            <Leaf size={18} style={{ marginRight: '8px' }} />
                            Receitas Detox ({receitas.detox.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'emagrecimento' ? 'active' : ''}`}
                            onClick={() => setActiveTab('emagrecimento')}
                        >
                            <Scale size={18} style={{ marginRight: '8px' }} />
                            Receitas para Emagrecer ({receitas.emagrecimento.length})
                        </button>
                    </div>

                    <div className="recipes-grid">
                        {filteredReceitas.length === 0 ? (
                            <div className="no-results">
                                <p>Nenhuma receita encontrada</p>
                            </div>
                        ) : (
                            filteredReceitas.map((receita) => (
                                <div key={receita.dia} className="recipe-card-mini card">
                                    <div className="recipe-card-header">
                                        <h3>{receita.nome}</h3>
                                        <span className="day-label">Dia {receita.dia}</span>
                                    </div>

                                    <div className="recipe-info">
                                        <div className="info-item">
                                            <strong>
                                                <FileText size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom' }} />
                                                Ingredientes:
                                            </strong>
                                            <p>{receita.ingredientes}</p>
                                        </div>

                                        <div className="info-item">
                                            <strong>
                                                <ChefHat size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom' }} />
                                                Preparo:
                                            </strong>
                                            <p>{receita.preparo}</p>
                                        </div>

                                        <div className="info-item benefits-mini">
                                            <strong>
                                                <Sparkles size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom' }} />
                                                Benefícios:
                                            </strong>
                                            <p>{receita.beneficios}</p>
                                        </div>

                                        <div className="recipe-footer">
                                            <span className="time-info">
                                                <Clock size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom' }} />
                                                {receita.tempo_estimado} min
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Recipes;

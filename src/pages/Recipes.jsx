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
                return;
            }
        } catch (error) {
            console.log('[v0] API indisponível, usando receitas mock para teste no preview:', error.message);
        }

        // Fallback com receitas mockadas para teste no preview
        try {
            const receitasMock = {
                detox: [
                    {
                        dia: 1,
                        nome: 'Suco Verde Matinal',
                        tipo: 'detox',
                        ingredientes: '1 xícara de espinafre, 1 maçã verde, 1 cenoura, 1 laranja, 1/2 limão, 200ml de água filtrada',
                        preparo: 'Bata todos os ingredientes no liquidificador por 2 minutos. Coe se preferir. Beba na hora.',
                        beneficios: 'Rico em clorofila e antioxidantes, ajuda na desintoxicação natural do corpo, melhora a energia e acelera o metabolismo.',
                        tempo_estimado: 10
                    },
                    {
                        dia: 2,
                        nome: 'Chá Detox com Gengibre',
                        tipo: 'detox',
                        ingredientes: '1 colher de chá de gengibre ralado, 1 limão, 1 colher de mel, 1 canela em pau, 250ml de água quente',
                        preparo: 'Coloque a canela e o gengibre na água quente. Deixe em repouso por 5 minutos. Coe, adicione o suco de limão e mel.',
                        beneficios: 'Acelera o metabolismo, reduz inflamações, melhora a digestão e aumenta a queima de calorias.',
                        tempo_estimado: 8
                    },
                    {
                        dia: 3,
                        nome: 'Água Detox com Frutas Vermelhas',
                        tipo: 'detox',
                        ingredientes: '200ml de morangos, 100ml de framboesas, 1 limão fatiado, 1 litro de água filtrada, gelo',
                        preparo: 'Coloque as frutas e o limão em uma jarra com água. Deixe de um dia para o outro na geladeira. Sirva gelado.',
                        beneficios: 'Hidratação completa com antioxidantes, reduz retenção de líquidos, melhora a qualidade da pele.',
                        tempo_estimado: 5
                    },
                    {
                        dia: 4,
                        nome: 'Chá de Gengibre e Cúrcuma',
                        tipo: 'detox',
                        ingredientes: '1 colher de chá de gengibre ralado, 1/2 colher de chá de cúrcuma, 1 limão, 1 colher de mel, 250ml de água quente',
                        preparo: 'Despeje a água quente e adicione gengibre e cúrcuma. Deixe em infusão por 5 minutos. Coe e adicione limão e mel.',
                        beneficios: 'Propriedades anti-inflamatórias, melhora a digestão, acelera o metabolismo e ajuda na desintoxicação.',
                        tempo_estimado: 8
                    },
                    {
                        dia: 5,
                        nome: 'Suco Detox com Beterraba',
                        tipo: 'detox',
                        ingredientes: '1/2 beterraba crua, 2 maçãs verdes, 1 cenoura, 1/2 limão, 200ml de água',
                        preparo: 'Passe todos os ingredientes pelo extrator de suco. Se não tiver, bata no liquidificador e coe.',
                        beneficios: 'Limpa o fígado, melhora a circulação, fornece energia natural e ajuda a eliminar toxinas.',
                        tempo_estimado: 12
                    }
                ],
                emagrecimento: [
                    {
                        dia: 1,
                        nome: 'Smoothie de Proteína Natural',
                        tipo: 'emagrecimento',
                        ingredientes: '1 xícara de leite desnatado, 1 banana, 2 colheres de sopa de iogurte grego, 1 colher de mel, 1/2 xícara de morangos congelados',
                        preparo: 'Bata todos os ingredientes no liquidificador até ficar cremoso. Sirva gelado.',
                        beneficios: 'Fornece proteína para recuperação muscular, mantém saciedade, melhora a composição corporal e ajuda no emagrecimento saudável.',
                        tempo_estimado: 8
                    },
                    {
                        dia: 2,
                        nome: 'Omelete de Claras com Vegetais',
                        tipo: 'emagrecimento',
                        ingredientes: '3 claras de ovo, 1/2 xícara de espinafre, 1/4 cebola, 1/4 pimentão, sal e pimenta a gosto, 1 colher de azeite',
                        preparo: 'Bata as claras levemente. Refogue os vegetais em azeite. Despeje as claras e deixe cozinhar até ficar firme.',
                        beneficios: 'Alta em proteína e baixa em calorias, melhora a saciedade, acelera o metabolismo e mantém a massa muscular.',
                        tempo_estimado: 15
                    },
                    {
                        dia: 3,
                        nome: 'Salada de Frango com Quinoa',
                        tipo: 'emagrecimento',
                        ingredientes: '100g de peito de frango cozido, 1/2 xícara de quinoa cozida, 2 xícaras de alface, 1/2 tomate, 1/4 pepino, azeite e limão',
                        preparo: 'Cozinhe a quinoa conforme instruções. Grelhe o frango. Misture a salada e tempere com azeite e limão.',
                        beneficios: 'Refeição completa e balanceada, rica em proteína, fibras e nutrientes, promove saciedade prolongada.',
                        tempo_estimado: 20
                    },
                    {
                        dia: 4,
                        nome: 'Iogurte Grego com Frutas e Granola Low Carb',
                        tipo: 'emagrecimento',
                        ingredientes: '150ml de iogurte grego, 50g de frutas vermelhas, 30g de granola low carb, 1 colher de mel',
                        preparo: 'Coloque o iogurte em uma tigela. Adicione as frutas. Polvilhe a granola. Regue com mel.',
                        beneficios: 'Fonte de proteína e probióticos, melhora a digestão, fornece energia e mantém a saciedade.',
                        tempo_estimado: 5
                    },
                    {
                        dia: 5,
                        nome: 'Caldo de Osso com Vegetais',
                        tipo: 'emagrecimento',
                        ingredientes: '2 litros de água, 1kg de ossos de frango, 3 cenouras, 3 aipo, 1 cebola, sal e pimenta, temperos naturais',
                        preparo: 'Cozinhe os ossos por 3 horas em fogo baixo com água. Adicione vegetais na última hora. Coe antes de servir.',
                        beneficios: 'Rico em colágeno e minerais, melhora a saúde do intestino, promove saciedade e acelera o metabolismo.',
                        tempo_estimado: 180
                    }
                ]
            };

            setReceitas(receitasMock);
        } catch (error) {
            console.error('Erro ao carregar receitas mock:', error);
            setReceitas({ detox: [], emagrecimento: [] });
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

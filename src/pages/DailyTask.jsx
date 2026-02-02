import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Clock,
    Dumbbell,
    Salad,
    Leaf,
    Scale,
    FileText,
    ChefHat,
    Sparkles,
    CheckCircle,
    ArrowLeft,
    Check
} from 'lucide-react';
import './DailyTask.css';

function DailyTask() {
    const { dia } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        fetchTarefa();
    }, [dia]);

    const fetchTarefa = async () => {
        try {
            const response = await fetch(`/api/tasks/${dia}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTarefa(data);
            } else {
                alert('Erro ao carregar tarefa');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
            alert('Erro ao carregar tarefa');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm('Tem certeza que deseja concluir este dia?')) {
            return;
        }

        setCompleting(true);
        try {
            const response = await fetch('/api/progress/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    dia: parseInt(dia)
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate('/dashboard');
            } else {
                alert('Erro ao concluir tarefa');
            }
        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            alert('Erro ao concluir tarefa');
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!tarefa) {
        return null;
    }

    return (
        <div className="daily-task-container">
            <header className="task-header">
                <div className="container">
                    <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar
                    </button>
                </div>
            </header>

            <main className="task-main">
                <div className="container">
                    <div className="task-title-section fade-in">
                        <span className="day-number">Dia {tarefa.dia}</span>
                        <h1>{tarefa.titulo}</h1>
                        <p className="objective">{tarefa.objetivo}</p>
                        <div className="time-badge badge badge-info">
                            <Clock size={16} style={{ marginRight: '6px' }} />
                            {tarefa.tempo_estimado} minutos
                        </div>
                    </div>

                    <div className="task-content">
                        <div className="exercise-card card">
                            <div className="card-header">
                                <h2 className="flex-center">
                                    <Dumbbell className="section-icon" size={24} />
                                    Exercício do Dia
                                </h2>
                            </div>
                            <p className="exercise-description">{tarefa.exercicio}</p>
                        </div>

                        <div className="recipe-card card">
                            <div className="card-header">
                                <h2 className="flex-center">
                                    <Salad className="section-icon" size={24} />
                                    Receita do Dia
                                </h2>
                                <span className={`recipe-type-badge badge ${tarefa.receita.tipo === 'detox' ? 'badge-success' : 'badge-info'}`}>
                                    {tarefa.receita.tipo === 'detox' ? (
                                        <>
                                            <Leaf size={14} style={{ marginRight: '4px' }} />
                                            Detox
                                        </>
                                    ) : (
                                        <>
                                            <Scale size={14} style={{ marginRight: '4px' }} />
                                            Emagrecimento
                                        </>
                                    )}
                                </span>
                            </div>

                            <h3 className="recipe-name">{tarefa.receita.nome}</h3>

                            <div className="recipe-section">
                                <h4>
                                    <FileText size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Ingredientes
                                </h4>
                                <p>{tarefa.receita.ingredientes}</p>
                            </div>

                            <div className="recipe-section">
                                <h4>
                                    <ChefHat size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Modo de Preparo
                                </h4>
                                <p>{tarefa.receita.preparo}</p>
                            </div>

                            <div className="recipe-section benefits">
                                <h4>
                                    <Sparkles size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Benefícios
                                </h4>
                                <p>{tarefa.receita.beneficios}</p>
                            </div>
                        </div>
                    </div>

                    <div className="task-actions">
                        <button
                            className="btn btn-primary btn-complete"
                            onClick={handleComplete}
                            disabled={completing}
                        >
                            {completing ? (
                                'Concluindo...'
                            ) : (
                                <>
                                    <CheckCircle size={20} style={{ marginRight: '8px' }} />
                                    Concluir Tarefa & Avançar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DailyTask;

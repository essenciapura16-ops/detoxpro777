import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Download, BookOpen, Leaf } from 'lucide-react';
import './Ebook.css';

function Ebook() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // 70 receitas detox mockadas para o ebook
    const recipes = [
        // Sucos e Bebidas (20)
        { id: 1, nome: 'Suco Verde Matinal', categoria: 'Sucos', ingredientes: '1 xícara espinafre, 1 maçã verde, 1 cenoura, 1 laranja, 1/2 limão', calorias: 120 },
        { id: 2, nome: 'Suco de Abacaxi com Gengibre', categoria: 'Sucos', ingredientes: '2 xícaras abacaxi, 1 colher gengibre, 1 limão', calorias: 110 },
        { id: 3, nome: 'Suco de Beterraba e Maçã', categoria: 'Sucos', ingredientes: '1/2 beterraba, 2 maçãs verdes, 1 cenoura', calorias: 95 },
        { id: 4, nome: 'Suco Detox com Couve', categoria: 'Sucos', ingredientes: '3 folhas couve, 1 maçã, 1 cenoura, 1/2 limão', calorias: 85 },
        { id: 5, nome: 'Suco de Melancia e Limão', categoria: 'Sucos', ingredientes: '2 xícaras melancia, 1 limão, gelo', calorias: 75 },
        { id: 6, nome: 'Suco Verde com Gengibre', categoria: 'Sucos', ingredientes: '1 xícara couve, 2 maçãs, 1 gengibre, água', calorias: 100 },
        { id: 7, nome: 'Suco de Cenoura e Laranja', categoria: 'Sucos', ingredientes: '3 cenouras, 2 laranjas, 1/2 limão', calorias: 90 },
        { id: 8, nome: 'Suco Detox com Maçã', categoria: 'Sucos', ingredientes: '2 maçãs, 1 cenoura, 1/2 beterraba, gengibre', calorias: 105 },
        { id: 9, nome: 'Suco de Abacaxi e Hortelã', categoria: 'Sucos', ingredientes: '2 xícaras abacaxi, 10 folhas hortelã, 1 limão', calorias: 115 },
        { id: 10, nome: 'Suco Verde com Maçã', categoria: 'Sucos', ingredientes: '1 xícara espinafre, 1 maçã, 1 cenoura, água', calorias: 80 },
        
        // Chás Detox (15)
        { id: 11, nome: 'Chá Detox com Gengibre', categoria: 'Chás', ingredientes: '1 colher gengibre, 1 limão, mel, canela, água quente', calorias: 20 },
        { id: 12, nome: 'Chá de Hibisco', categoria: 'Chás', ingredientes: '2 colheres hibisco, canela, mel, água quente', calorias: 15 },
        { id: 13, nome: 'Chá Verde com Hortelã', categoria: 'Chás', ingredientes: '1 colher chá verde, 10 folhas hortelã, água quente', calorias: 10 },
        { id: 14, nome: 'Chá de Gengibre e Cúrcuma', categoria: 'Chás', ingredientes: '1 colher gengibre, 1/2 colher cúrcuma, limão, mel', calorias: 25 },
        { id: 15, nome: 'Chá de Alecrim', categoria: 'Chás', ingredientes: '1 ramo alecrim, 1 limão, mel, água quente', calorias: 15 },
        { id: 16, nome: 'Chá Branco Detox', categoria: 'Chás', ingredientes: '1 colher chá branco, gengibre, mel, água quente', calorias: 18 },
        { id: 17, nome: 'Chá de Camomila', categoria: 'Chás', ingredientes: '1 colher camomila, mel, água quente', calorias: 12 },
        { id: 18, nome: 'Chá de Gengibre e Limão', categoria: 'Chás', ingredientes: '1 colher gengibre ralado, 1 limão, água quente', calorias: 22 },
        { id: 19, nome: 'Chá de Hortelã e Gengibre', categoria: 'Chás', ingredientes: '15 folhas hortelã, 1 colher gengibre, água quente', calorias: 20 },
        { id: 20, nome: 'Chá de Menta e Limão', categoria: 'Chás', ingredientes: '10 folhas menta, 1 limão, mel, água quente', calorias: 18 },
        { id: 21, nome: 'Chá de Gengibre e Mel', categoria: 'Chás', ingredientes: '1 colher gengibre, 1 colher mel, água quente', calorias: 35 },
        
        // Smoothies (15)
        { id: 22, nome: 'Smoothie de Banana e Berries', categoria: 'Smoothies', ingredientes: '1 banana, 1/2 xícara berries, iogurte grego', calorias: 150 },
        { id: 23, nome: 'Smoothie Verde Detox', categoria: 'Smoothies', ingredientes: '1 xícara espinafre, 1 banana, 1/2 abacate, leite desnatado', calorias: 180 },
        { id: 24, nome: 'Smoothie de Morango', categoria: 'Smoothies', ingredientes: '1 xícara morangos, iogurte grego, mel, gelo', calorias: 140 },
        { id: 25, nome: 'Smoothie de Blueberry', categoria: 'Smoothies', ingredientes: '1 xícara blueberry, iogurte grego, mel', calorias: 160 },
        { id: 26, nome: 'Smoothie de Abacate', categoria: 'Smoothies', ingredientes: '1/2 abacate, 1 banana, leite desnatado, mel', calorias: 200 },
        { id: 27, nome: 'Smoothie de Coco e Manga', categoria: 'Smoothies', ingredientes: '1 manga, 1/2 xícara coco ralado, iogurte, gelo', calorias: 170 },
        { id: 28, nome: 'Smoothie de Melancia', categoria: 'Smoothies', ingredientes: '2 xícaras melancia, iogurte grego, gengibre', calorias: 130 },
        { id: 29, nome: 'Smoothie de Uva e Morango', categoria: 'Smoothies', ingredientes: '1 xícara uva, 1/2 xícara morango, iogurte', calorias: 145 },
        { id: 30, nome: 'Smoothie de Pêssego', categoria: 'Smoothies', ingredientes: '2 pêssegos, iogurte grego, mel, gelo', calorias: 155 },
        { id: 31, nome: 'Smoothie de Damasco', categoria: 'Smoothies', ingredientes: '4 damascos, iogurte, mel, gelo', calorias: 140 },
        { id: 32, nome: 'Smoothie de Abacaxi', categoria: 'Smoothies', ingredientes: '1 xícara abacaxi, iogurte grego, gengibre', calorias: 150 },
        { id: 33, nome: 'Smoothie de Romã', categoria: 'Smoothies', ingredientes: '1/2 xícara sementes romã, iogurte, mel', calorias: 165 },
        { id: 34, nome: 'Smoothie de Kiwi', categoria: 'Smoothies', ingredientes: '2 kiwis, iogurte grego, mel, gelo', calorias: 135 },
        { id: 35, nome: 'Smoothie de Goiaba', categoria: 'Smoothies', ingredientes: '2 goiabas, iogurte, mel, gelo', calorias: 145 },
        { id: 36, nome: 'Smoothie de Maçã Verde', categoria: 'Smoothies', ingredientes: '2 maçãs verdes, espinafre, iogurte, gengibre', calorias: 155 },
        
        // Saladas e Refeições (20)
        { id: 37, nome: 'Salada Verde com Abacate', categoria: 'Saladas', ingredientes: 'Alface, rúcula, 1/2 abacate, tomate, azeite', calorias: 180 },
        { id: 38, nome: 'Salada de Beterraba', categoria: 'Saladas', ingredientes: 'Beterraba ralada, rúcula, gorgonzola, azeite', calorias: 220 },
        { id: 39, nome: 'Salada de Quinoa', categoria: 'Saladas', ingredientes: '1 xícara quinoa cozida, tomate, pepino, azeite', calorias: 250 },
        { id: 40, nome: 'Salada de Grão de Bico', categoria: 'Saladas', ingredientes: '1 lata grão de bico, tomate, cebola, limão', calorias: 280 },
        { id: 41, nome: 'Salada de Frango Grelhado', categoria: 'Saladas', ingredientes: '150g frango, alface, tomate, cenoura ralada', calorias: 300 },
        { id: 42, nome: 'Salada de Peixe Branco', categoria: 'Saladas', ingredientes: '150g peixe, rúcula, limão, azeite', calorias: 320 },
        { id: 43, nome: 'Salada de Ovos Cozidos', categoria: 'Saladas', ingredientes: '2 ovos cozidos, alface, tomate, cenoura', calorias: 240 },
        { id: 44, nome: 'Salada de Brócolis', categoria: 'Saladas', ingredientes: '2 xícaras brócolis cru ralado, cenoura, azeite', calorias: 150 },
        { id: 45, nome: 'Salada de Couve', categoria: 'Saladas', ingredientes: '2 xícaras couve ralada, limão, azeite, alho', calorias: 140 },
        { id: 46, nome: 'Salada Grega', categoria: 'Saladas', ingredientes: 'Tomate, pepino, queijo feta, azeitona, azeite', calorias: 280 },
        { id: 47, nome: 'Omelete com Vegetais', categoria: 'Refeições', ingredientes: '2 ovos, espinafre, tomate, cebola, azeite', calorias: 220 },
        { id: 48, nome: 'Frango Grelhado com Brócolis', categoria: 'Refeições', ingredientes: '150g frango, 2 xícaras brócolis, limão', calorias: 350 },
        { id: 49, nome: 'Peixe Assado com Vegetais', categoria: 'Refeições', ingredientes: '150g peixe, abóbora, cenoura, sal', calorias: 380 },
        { id: 50, nome: 'Batata Doce com Frango', categoria: 'Refeições', ingredientes: '1 batata doce, 100g frango, azeite', calorias: 400 },
        { id: 51, nome: 'Arroz Integral com Feijão', categoria: 'Refeições', ingredientes: '1/2 xícara arroz integral, 1/2 xícara feijão, alho', calorias: 320 },
        { id: 52, nome: 'Caldo de Osso', categoria: 'Refeições', ingredientes: 'Ossos frango, cenoura, cebola, sal, pimenta', calorias: 150 },
        { id: 53, nome: 'Sopa de Abóbora', categoria: 'Refeições', ingredientes: '200g abóbora, cebola, alho, caldo vegetal', calorias: 180 },
        { id: 54, nome: 'Sopa de Brócolis', categoria: 'Refeições', ingredientes: '2 xícaras brócolis, cebola, alho, caldo', calorias: 160 },
        { id: 55, nome: 'Berinjela Grelhada', categoria: 'Refeições', ingredientes: '2 berinjelas, azeite, alho, sal', calorias: 140 },
        { id: 56, nome: 'Abóbora Assada', categoria: 'Refeições', ingredientes: '300g abóbora em cubos, azeite, temperos', calorias: 120 },
    ];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(recipes.length / itemsPerPage);
    const currentRecipes = recipes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDownloadPDF = () => {
        alert('PDF do Ebook "70 Receitas Detox" será disponibilizado em breve!');
    };

    return (
        <div className="ebook-container">
            <header className="ebook-header">
                <div className="container">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-title">
                        <Leaf className="header-icon" size={28} />
                        <h1>Ebook 70 Receitas Detox</h1>
                    </div>
                    <button className="btn btn-primary btn-download" onClick={handleDownloadPDF}>
                        <Download size={18} style={{ marginRight: '8px' }} />
                        Download PDF
                    </button>
                </div>
            </header>

            <main className="ebook-main">
                <div className="container">
                    <div className="ebook-intro">
                        <BookOpen size={40} color="#10b981" />
                        <h2>Transforme Sua Saúde com 70 Receitas Detox</h2>
                        <p>Descubra as melhores receitas para desintoxicar seu corpo, acelerar o metabolismo e alcançar seu peso ideal. Todas as receitas são simples, práticas e deliciosas!</p>
                    </div>

                    <div className="recipes-grid">
                        {currentRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="recipe-card"
                                onClick={() => setSelectedRecipe(recipe)}
                            >
                                <div className="recipe-header">
                                    <h3>{recipe.nome}</h3>
                                    <span className="recipe-category">{recipe.categoria}</span>
                                </div>
                                <p className="recipe-ingredients">{recipe.ingredientes}</p>
                                <div className="recipe-footer">
                                    <span className="recipe-calories">{recipe.calorias} kcal</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginação */}
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-secondary"
                        >
                            Anterior
                        </button>
                        <span className="page-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-secondary"
                        >
                            Próxima
                        </button>
                    </div>

                    {/* Modal de Receita */}
                    {selectedRecipe && (
                        <div className="recipe-modal" onClick={() => setSelectedRecipe(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedRecipe(null)}
                                >
                                    ✕
                                </button>
                                <h2>{selectedRecipe.nome}</h2>
                                <p className="modal-category">{selectedRecipe.categoria}</p>
                                <div className="modal-section">
                                    <h4>Ingredientes:</h4>
                                    <p>{selectedRecipe.ingredientes}</p>
                                </div>
                                <div className="modal-section">
                                    <h4>Informações Nutricionais:</h4>
                                    <p>Calorias: {selectedRecipe.calorias} kcal</p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setSelectedRecipe(null)}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Ebook;

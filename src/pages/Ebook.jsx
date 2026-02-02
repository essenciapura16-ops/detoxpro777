import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import './Ebook.css';

function Ebook() {
    const navigate = useNavigate();

    const handleDownloadPDF = async () => {
        try {
            const pdfUrl = 'https://blobs.vusercontent.net/blob/70-Receitas-Saudaveis-1xAygSHCukJgMXFB3nCy55eBmWKAFB.pdf';
            
            const response = await fetch(pdfUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) {
                console.log('[v0] Erro ao fazer fetch do PDF, abrindo em nova aba');
                window.open(pdfUrl, '_blank');
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = '70-Receitas-Saudaveis.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log('[v0] Erro no download:', error.message);
            // Fallback: abrir PDF em nova aba
            window.open('https://blobs.vusercontent.net/blob/70-Receitas-Saudaveis-1xAygSHCukJgMXFB3nCy55eBmWKAFB.pdf', '_blank');
        }
    };

    return (
        <div className="ebook-container">
            <header className="ebook-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1>Ebook 70 Receitas Detox</h1>
                <button
                    className="btn-download-header"
                    onClick={handleDownloadPDF}
                >
                    <Download size={20} />
                    Download PDF
                </button>
            </header>

            <main className="ebook-content">
                <div className="ebook-cover-section">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_4791b93bc0dbd62aef04c0ed9ea25aa2eg-cCOX0IXZZB6AGYFIEh0vbtiRlw65P0.png"
                        alt="70 Receitas Saudáveis para Revigorar o Corpo"
                        className="ebook-cover"
                    />
                </div>
            </main>
        </div>
    );
}

export default Ebook;

document.getElementById('email-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailText = document.getElementById('email-text').value;
    const resultsContainer = document.getElementById('results-container');
    const resultContent = document.getElementById('result-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const categorySpan = document.getElementById('email-category');
    const replyDiv = document.getElementById('suggested-reply');

    if (!emailText.trim()) {
        alert('Por favor, insira o texto do email.');
        return;
    }

    resultsContainer.style.display = 'block';
    loadingSpinner.style.display = 'block';
    resultContent.style.display = 'none';

try {
    const response = await fetch('/classify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_text: emailText })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();


    const categorySpan = document.getElementById('email-category');
    const replyDiv = document.getElementById('suggested-reply');
    const confidenceScoreSpan = document.getElementById('confidence-score');

    const confidencePercent = (data.confianca * 100).toFixed(1);
    
    categorySpan.textContent = data.categoria;
    replyDiv.textContent = data.resposta_sugerida;
    confidenceScoreSpan.textContent = `${confidencePercent}%`;

    if (data.confianca > 0.90) {
        confidenceScoreSpan.style.color = 'green';
    } else if (data.confianca > 0.70) {
        confidenceScoreSpan.style.color = 'orange';
    } else {
        confidenceScoreSpan.style.color = 'red';
    }
    if (data.categoria === 'Produtivo') {
        categorySpan.className = 'badge bg-success';
    } else {
        categorySpan.className = 'badge bg-warning text-dark';
    }
    loadingSpinner.style.display = 'none';
    resultContent.style.display = 'block';

} catch (error) {
    
        loadingSpinner.style.display = 'none';
        resultContent.style.display = 'block';
        categorySpan.textContent = 'Erro';
        categorySpan.className = 'badge bg-danger';
        replyDiv.textContent = `Ocorreu um erro ao processar sua solicitação: ${error.message}`;
        replyDiv.className = 'alert alert-danger';
    }
});
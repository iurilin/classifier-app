const emailForm = document.getElementById('email-form');
const emailText = document.getElementById('email-text');
const emailFile = document.getElementById('email-file');
const fileNameDisplay = document.getElementById('file-name-display');
const resultsContainer = document.getElementById('results-container');
const resultContent = document.getElementById('result-content');
const loadingSpinner = document.getElementById('loading-spinner');

emailFile.addEventListener('change', () => {
    if (emailFile.files.length > 0) {
        fileNameDisplay.textContent = `Arquivo selecionado: ${emailFile.files[0].name}`;
        emailText.disabled = true;
    } else {
        fileNameDisplay.textContent = '';
        emailText.disabled = false;
    }
});

emailText.addEventListener('input', () => {
    if (emailText.value.length > 0) {
        emailFile.value = '';
        fileNameDisplay.textContent = '';
    }
});

emailForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const textContent = emailText.value;
    const fileContent = emailFile.files[0];

    if (!textContent.trim() && !fileContent) {
        alert('Por favor, insira um texto ou selecione um arquivo.');
        return;
    }

    const formData = new FormData();
    formData.append('email_text', textContent);
    formData.append('email_file', fileContent);

    resultsContainer.style.display = 'block';
    loadingSpinner.style.display = 'block';
    resultContent.style.display = 'none';

    try {
        const response = await fetch('/classify', {
            method: 'POST',
            body: formData 
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
        const categorySpan = document.getElementById('email-category');
        const replyDiv = document.getElementById('suggested-reply');
        categorySpan.textContent = 'Erro';
        categorySpan.className = 'badge bg-danger';
        replyDiv.textContent = `Ocorreu um erro ao processar sua solicitação: ${error.message}`;
        replyDiv.className = 'alert alert-danger';
    }
});
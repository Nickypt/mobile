document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const resultsDiv = document.getElementById('quiz-results');
    const questions = document.querySelectorAll('.question-box');
    
    let userAnswers = {};

    function checkIfQuizIsComplete() {
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(userAnswers).length;

        submitBtn.disabled = answeredQuestions !== totalQuestions;
    }

    function handleOptionClick(event) {
        const selectedItem = event.currentTarget;
        const optionsList = selectedItem.closest('.options-list');
        const questionBox = selectedItem.closest('.question-box');
        const questionId = questionBox ? questionBox.dataset.questionId : null;
        const selectedOption = selectedItem.dataset.option;

        if (!questionId) return; // Segurança

        // Remove a seleção de todos os itens da mesma pergunta
        optionsList.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Adiciona a seleção ao item clicado
        selectedItem.classList.add('selected');

        // Armazena a resposta
        userAnswers[questionId] = selectedOption;

        // Verifica se todas as perguntas foram respondidas
        checkIfQuizIsComplete();
    }

    function sendResultsToBackend(missedQuestions, score) {
        const payload = {
            topic: "Funções do 1º Grau",
            score: score.toFixed(2),
            errors: missedQuestions,
            timestamp: new Date().toISOString()
        };
        
        // SIMULAÇÃO DE ENVIO DE DADOS. No ambiente real, use 'fetch'
        console.log("--- SIMULAÇÃO DE ENVIO PARA O BACKEND ---");
        console.log("Dados que seriam enviados para personalização:");
        console.log(payload);
    }

    function submitQuiz() {
        let correctCount = 0;
        let questionsMissed = [];

        questions.forEach(questionBox => {
            const questionId = questionBox.dataset.questionId;
            const optionsList = questionBox.querySelector('.options-list');
            const correctAnswer = optionsList.dataset.answer;
            const userAnswer = userAnswers[questionId];

            optionsList.querySelectorAll('.option-item').forEach(item => {
                if (item.dataset.option === correctAnswer) {
                    item.classList.add('correct');
                }
                if (item.dataset.option === userAnswer && userAnswer !== correctAnswer) {
                    item.classList.add('wrong');
                    questionsMissed.push(questionId);
                }
            });

            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        });

        const totalQuestions = questions.length;
        const scorePercentage = (correctCount / totalQuestions) * 100;

        // Exibe os Resultados
        resultsDiv.innerHTML = `
            <h2>Resultado Final</h2>
            <div class="score-display ${correctCount >= totalQuestions * 0.7 ? 'message-success' : 'message-fail'}">
                ${correctCount} / ${totalQuestions}
            </div>
            <p>Percentual de Acerto: <strong>${scorePercentage.toFixed(0)}%</strong></p>
            <p class="${correctCount >= totalQuestions * 0.7 ? 'message-success' : 'message-fail'}">
                ${correctCount >= totalQuestions * 0.7 
                    ? 'Excelente trabalho! Você domina o assunto.' 
                    : 'Você precisa revisar as Funções do 1º Grau.'}
            </p>
            <p>Os resultados foram registrados no seu Dashboard.</p>
        `;
        
        resultsDiv.style.display = 'block';
        submitBtn.style.display = 'none';

        // Desabilita novas interações
        document.querySelectorAll('.option-item').forEach(item => {
            item.removeEventListener('click', handleOptionClick);
            item.style.cursor = 'default';
        });
        
        sendResultsToBackend(questionsMissed, scorePercentage);
    }

    // Configuração: Adiciona Listeners
    if (quizForm) {
        document.querySelectorAll('.options-list').forEach(list => {
            list.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', handleOptionClick);
            });
        });

        submitBtn.addEventListener('click', submitQuiz);
    }
});
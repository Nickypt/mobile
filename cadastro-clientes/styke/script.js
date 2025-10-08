// static/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    // 1. Validação de Formulário Front-end
    if (form) {
        form.addEventListener('submit', function(e) {
            const nomeInput = document.getElementById('nome');
            
            // Verifica se o nome existe e tem pelo menos 3 caracteres
            if (nomeInput && nomeInput.value.trim().length < 3) {
                e.preventDefault(); // Impede o envio
                alert('O campo Nome deve ter pelo menos 3 caracteres.');
                nomeInput.focus();
                return false;
            }

            return true; // Permite o envio
        });
    }

    // 2. Fechamento Automático de Mensagens Flash
    const flashMessages = document.querySelectorAll('.flashes li');
    flashMessages.forEach(msg => {
        // Define um temporizador para iniciar a animação de saída após 5 segundos
        setTimeout(() => {
            msg.style.opacity = 0; // Transição de opacidade
            
            // Depois que a transição de opacidade terminar (0.5s no CSS), remove o espaço
            setTimeout(() => {
                msg.style.height = 0;
                msg.style.padding = 0;
                msg.style.margin = 0;
                // Remove o elemento do DOM completamente após mais 0.5s
                setTimeout(() => msg.remove(), 500);
            }, 500);

        }, 5000); 
    });
});
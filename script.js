// Obtém o elemento do letreiro
const marqueeText = document.getElementById('marqueeText');

// Obtém o contêiner da tela (para saber a largura)
const screen = document.querySelector('.screen');

// Controle de velocidade (Ajuste para um movimento suave)
const speed = 1.5; 

// Variáveis de estado
let position = 0; // Posição horizontal atual (em pixels)
let direction = 1; // 1 para direita, -1 para esquerda

// Função principal de animação
function animateMarquee() {
    // Calcula a largura total do espaço de movimento
    const screenWidth = screen.clientWidth;
    const textWidth = marqueeText.clientWidth;
    const maxPosition = screenWidth - textWidth; 

    // 1. Move o texto
    position += speed * direction;

    // 2. Lógica de ida e volta (reversão)
    if (direction === 1) { // Movendo para a direita
        if (position >= maxPosition) {
            position = maxPosition; 
            direction = -1; // Inverte para mover para a esquerda
        }
    } else { // Movendo para a esquerda
        if (position <= 0) {
            position = 0; 
            direction = 1; // Inverte para mover para a direita
        }
    }

    // 3. Aplica a nova posição ao elemento
    marqueeText.style.left = `${position}px`;

    // 4. Agenda o próximo frame (melhor para animação)
    requestAnimationFrame(animateMarquee);
}

// Inicia a animação
animateMarquee();
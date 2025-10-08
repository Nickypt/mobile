// script.js

// Constantes para acesso aos elementos da DOM
const form = document.getElementById('client-form');
const clientIdInput = document.getElementById('client-id');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const telefoneInput = document.getElementById('telefone');
const tableBody = document.querySelector('#clients-table tbody');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const noClientsMessage = document.getElementById('no-clients-message');

// Chave do LocalStorage
const STORAGE_KEY = 'clientes_db';

// --- Funções Principais de Banco de Dados (LocalStorage) ---

/**
 * Carrega a lista de clientes do LocalStorage.
 * @returns {Array} Lista de clientes ou array vazio se não houver dados.
 */
function getClients() {
    const clientsJSON = localStorage.getItem(STORAGE_KEY);
    return clientsJSON ? JSON.parse(clientsJSON) : [];
}

/**
 * Salva a lista de clientes atualizada no LocalStorage.
 * @param {Array} clients - A lista de clientes a ser salva.
 */
function saveClients(clients) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// --- Funções de Manipulação da Interface (CRUD) ---

/**
 * Gera um ID único simples.
 * @returns {number} O novo ID.
 */
function generateId() {
    const clients = getClients();
    const maxId = clients.reduce((max, client) => Math.max(max, client.id || 0), 0);
    return maxId + 1;
}

/**
 * Renderiza a tabela com os clientes.
 */
function renderClients() {
    const clients = getClients();
    tableBody.innerHTML = ''; // Limpa a tabela

    if (clients.length === 0) {
        noClientsMessage.style.display = 'block';
        return;
    }
    noClientsMessage.style.display = 'none';

    clients.forEach(client => {
        const row = tableBody.insertRow();
        
        row.insertCell().textContent = client.nome;
        row.insertCell().textContent = client.email;
        row.insertCell().textContent = client.telefone;
        
        // Célula de Ações (Editar e Deletar)
        const actionsCell = row.insertCell();
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('button', 'edit-button');
        editButton.onclick = () => loadClientForEdit(client.id);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.classList.add('button', 'delete-button');
        deleteButton.onclick = () => deleteClient(client.id, client.nome);
        
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
}

/**
 * Processa o envio do formulário (CRIAR ou ATUALIZAR).
 */
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = clientIdInput.value;
    const nome = nomeInput.value;
    const email = emailInput.value;
    const telefone = telefoneInput.value;
    
    let clients = getClients();

    if (id) {
        // ATUALIZAR
        const index = clients.findIndex(c => c.id == id);
        if (index !== -1) {
            // Verifica duplicidade de email (exceto o próprio cliente)
            const isEmailTaken = clients.some(c => c.email === email && c.id != id);
            if (isEmailTaken) {
                alert("Erro: O email já está cadastrado em outro cliente.");
                return;
            }

            clients[index] = { id: parseInt(id), nome, email, telefone };
            alert(`Cliente ${nome} atualizado com sucesso!`);
        }
    } else {
        // CRIAR
        const isEmailTaken = clients.some(c => c.email === email);
        if (isEmailTaken) {
            alert("Erro: O email já está cadastrado.");
            return;
        }

        const newClient = {
            id: generateId(),
            nome,
            email,
            telefone
        };
        clients.push(newClient);
        alert(`Cliente ${nome} cadastrado com sucesso!`);
    }

    saveClients(clients);
    form.reset();
    resetFormState();
    renderClients();
});

/**
 * Carrega os dados do cliente no formulário para edição.
 * @param {number} id - O ID do cliente a ser editado.
 */
function loadClientForEdit(id) {
    const clients = getClients();
    const client = clients.find(c => c.id === id);

    if (client) {
        clientIdInput.value = client.id;
        nomeInput.value = client.nome;
        emailInput.value = client.email;
        telefoneInput.value = client.telefone;

        saveButton.textContent = 'Salvar Alterações';
        saveButton.classList.remove('add-button');
        saveButton.classList.add('edit-button');
        cancelButton.style.display = 'inline-block';
        nomeInput.focus();
    }
}

/**
 * Deleta um cliente.
 * @param {number} id - O ID do cliente a ser deletado.
 * @param {string} nome - O nome do cliente para a confirmação.
 */
function deleteClient(id, nome) {
    if (confirm(`Tem certeza que deseja deletar o cliente ${nome}?`)) {
        let clients = getClients();
        clients = clients.filter(client => client.id !== id);
        saveClients(clients);
        renderClients();
        alert(`Cliente ${nome} deletado.`);
        resetFormState(); // Caso estivesse editando
    }
}

/**
 * Reseta o formulário após salvar ou cancelar a edição.
 */
function resetFormState() {
    form.reset();
    clientIdInput.value = '';
    saveButton.textContent = 'Cadastrar';
    saveButton.classList.remove('edit-button');
    saveButton.classList.add('add-button');
    cancelButton.style.display = 'none';
}

cancelButton.addEventListener('click', resetFormState);

// Inicialização: Carrega os clientes na primeira vez que a página carrega
document.addEventListener('DOMContentLoaded', renderClients);
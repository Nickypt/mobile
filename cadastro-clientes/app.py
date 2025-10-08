import sqlite3
from flask import Flask, render_template, request, redirect, url_for, g, flash

app = Flask(__name__)
# CHAVE SECRETA É OBRIGATÓRIA para usar o sistema de 'flash'
app.secret_key = 'sua_chave_secreta_aqui_muito_segura' 
DATABASE = 'database.db'

# --- Funções de Conexão com o Banco de Dados ---

def get_db():
    # Conecta ou retorna a conexão existente com o SQLite para o request atual
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row # Retorna dados como dicionários
    return db

@app.teardown_appcontext
def close_connection(exception):
    # Garante que a conexão com o banco de dados é fechada
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    # Cria a tabela de clientes se ela não existir
    with app.app_context():
        db = get_db()
        db.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                telefone TEXT
            )
        """)
        db.commit()

# --- Rotas da Aplicação (CRUD) ---

# Rota principal: LER (Read) - Lista todos os clientes
@app.route('/')
def index():
    db = get_db()
    clientes = db.execute("SELECT * FROM clientes ORDER BY nome").fetchall()
    return render_template('index.html', clientes=clientes)

# Rota de Adição: CRIAR (Create)
@app.route('/add', methods=['GET', 'POST'])
def add_cliente():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        telefone = request.form.get('telefone', '')
        
        try:
            db = get_db()
            db.execute("INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)",
                       (nome, email, telefone))
            db.commit()
            flash(f'Cliente "{nome}" cadastrado com sucesso!', 'success')
            return redirect(url_for('index'))
        except sqlite3.IntegrityError:
            flash('Erro: O email fornecido já está cadastrado.', 'danger')
            return render_template('add.html')

    return render_template('add.html')

# Rota de Edição: ATUALIZAR (Update)
@app.route('/edit/<int:cliente_id>', methods=['GET', 'POST'])
def edit_cliente(cliente_id):
    db = get_db()
    cliente = db.execute("SELECT * FROM clientes WHERE id = ?", (cliente_id,)).fetchone()

    if cliente is None:
        flash("Cliente não encontrado.", 'warning')
        return redirect(url_for('index'))

    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        telefone = request.form.get('telefone', '')

        try:
            db.execute("UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?",
                       (nome, email, telefone, cliente_id))
            db.commit()
            flash(f'Cliente "{nome}" atualizado com sucesso!', 'success')
            return redirect(url_for('index'))
        except sqlite3.IntegrityError:
            flash("Erro: O email fornecido já está cadastrado em outro cliente.", 'danger')
            return render_template('edit.html', cliente=cliente)

    return render_template('edit.html', cliente=cliente)

# Rota de Exclusão: DELETAR (Delete)
@app.route('/delete/<int:cliente_id>', methods=['POST'])
def delete_cliente(cliente_id):
    db = get_db()
    cliente = db.execute("SELECT nome FROM clientes WHERE id = ?", (cliente_id,)).fetchone()
    if cliente:
        db.execute("DELETE FROM clientes WHERE id = ?", (cliente_id,))
        db.commit()
        flash(f'Cliente "{cliente["nome"]}" deletado com sucesso.', 'success')
    else:
        flash('Erro: Cliente não encontrado para exclusão.', 'danger')
        
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
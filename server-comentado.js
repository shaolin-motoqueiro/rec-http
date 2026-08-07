// ============================================================================
// ARQUIVO DIDÁTICO — cópia comentada do server.js
// Este arquivo NÃO deve ser executado como servidor principal.
// Serve só para estudar linha a linha o que cada parte faz.
// ============================================================================

// Importa o framework Express (por causa do "type": "module" no package.json).
// O Express facilita criar um servidor HTTP e definir rotas (GET, POST, DELETE, etc.).
import express from 'express';

// Cria a aplicação Express.
// "app" é o objeto principal: nele registramos middlewares, rotas e o listen da porta.
const app = express();

// Middleware global: interpreta o corpo das requisições
// Sem isso, req.body fica undefined no POST (e em outros métodos com body JSON).
// Precisa vir ANTES das rotas que usam req.body.
app.use(express.json());

// Array em memória que simula um "banco de dados" de livros.
// "let" (e não "const") porque no DELETE reatribuímos a variável com o array filtrado.
let livros = [
    // Cada objeto é um livro com id (número), nome e autor.
    {id: 1, nome: 'livro 1', autor: 'autor 1'},
    {id: 2, nome: 'livro 2', autor: 'autor 2'},
    {id: 3, nome: 'livro 3', autor: 'autor 3'},
]; // Observação: o ponto e vírgula no fim do array é opcional em JS, mas boa prática.

// ---------- ROTA GET /livros ----------
// Lista TODOS os livros.
// Quando alguém acessa GET http://localhost:3000/livros, esta função é chamada.
app.get('/livros', (req, res) => {
    // req  = objeto da requisição (dados que o cliente enviou: params, body, query, headers...)
    // res  = objeto da resposta (o que vamos devolver ao cliente)
    // res.json() envia o array "livros" como JSON e já define Content-Type: application/json.
    res.json(livros);
});

// ---------- ROTA GET /livros/:id ----------
// Busca UM livro pelo id na URL.
// Exemplo: GET /livros/2 → req.params.id vale "2" (string).
app.get('/livros/:id', (req, res) => {
    // :id na rota vira req.params.id.
    // parseInt converte a string "2" para o número 2, porque no array o id é number.
    // .find() percorre o array e devolve o primeiro item que satisfaz a condição (ou undefined).
    const livro = livros.find(livro => livro.id === parseInt(req.params.id));
    // Devolve o livro encontrado em JSON.
    // Se não existir, devolve undefined (na prática, resposta vazia/estranha; ideal seria 404).
    res.json(livro);
});


// ---------- ROTA POST /livros ----------
// Cria um NOVO livro a partir do JSON enviado no body da requisição.
// Exemplo de body: { "nome": "livro 4", "autor": "autor 4" }
app.post('/livros', (req, res) => {
    // Monta o objeto do novo livro.
    const livro = {
        // id simples: tamanho atual do array + 1 (funciona bem só enquanto não houver "buracos" de ids).
        id: livros.length + 1,
        // Lê "nome" e "autor" do corpo JSON (só funciona com app.use(express.json())).
        nome: req.body.nome,
        autor: req.body.autor
    };

    // Adiciona o novo livro ao final do array em memória.
    livros.push(livro);

    // status(201) = Created (recurso criado com sucesso).
    // .send() devolve uma mensagem em texto simples.
    res.status(201).send("livro criado com sucesso");
});


// ---------- ROTA DELETE /livros/:id ----------
// Remove um livro pelo id da URL.
// Exemplo: DELETE /livros/2
app.delete('/livros/:id', (req, res) => {
    // .filter() cria um NOVO array só com os livros cujo id NÃO é o id da URL.
    // Assim o livro com aquele id é "removido".
    // Reatribuímos em "livros" porque usamos let.
    livros = livros.filter(livro => livro.id !== parseInt(req.params.id));
    // status(204) = No Content (sucesso, mas sem corpo de resposta é o padrão HTTP).
    // Aqui ainda enviamos uma mensagem com .send() — funciona, mas o mais "correto" seria só 204 sem body.
    res.status(204).send(`livro ${req.params.id} deletado com sucesso `);
});

// ---------- INICIAR O SERVIDOR ----------
// Faz o servidor "ouvir" na porta 3000.
// A partir daí, as rotas acima ficam acessíveis em http://localhost:3000/...
app.listen(3000, () => {
    // Callback opcional: roda quando o servidor sobe com sucesso.
    console.log('servidor rodando na porta 3000');
});

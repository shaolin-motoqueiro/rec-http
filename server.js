import express from 'express';

const app = express();

app.use(express.json());

let livros = [
    {id: 1, nome: 'livro 1', autor: 'autor 1'},
    {id: 2, nome: 'livro 2', autor: 'autor 2'},
    {id: 3, nome: 'livro 3', autor: 'autor 3'},
]

app.get('/livros', (req, res) => {
    res.json(livros);
});

app.get('/livros/:id', (req, res) => {
    const idDaUrl = req.params.id;
    const id = Number(idDaUrl);
    const livro = livros.find(function (livro) {
        return livro.id === id;
    });
    res.json(livro);
});


app.post('/livros', (req, res) => {
    const livro = {
        id: livros.length + 1, 
        nome: req.body.nome, 
        autor: req.body.autor
    };

    livros.push(livro);

    res.status(201).send("livro criado com sucesso");
});


app.delete('/livros/:id', (req, res) => {
    const idDaUrl = req.params.id;
    const id = Number(idDaUrl);
    livros = livros.filter(function (livro) {
        return livro.id !== id;
    });
    res.status(204).send(`livro ${id} deletado com sucesso`);
});

app.listen(3000, () => {
    console.log('servidor rodando na porta 3000');
});
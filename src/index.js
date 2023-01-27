const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 8080;
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

app.use(express.json())
app.use(cors({
    origin: "*",
}))

//Usuario

app.get('/usuarios', async (req, res) => {
    try{
        const {rows} = await pool.query('SELECT * FROM usuario')
        return res.status(200).send(rows)
    } catch(err){
        return res.status(400).send(err)
    }
})

//get usuario logins
app.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;
    try{
        const usuario = await pool.query('SELECT * FROM usuario WHERE email = ($1) AND senha = ($2)', [email, senha]);
        if(usuario.rowCount > 0)
            return res.status(200).send("Usuário válido!")
        else
            return res.status(400).send("Usuário inválido!")
    } catch(err){
        return res.status(400).send(err);
    }
})

//criar usuario
app.post('/usuarios/cadastrar', async (req, res) => {
    const { email, senha } = req.body
    try {
        let usuario = await pool.query('SELECT * FROM usuario WHERE email = ($1)', [email]);
        if(!usuario.rows[0]){
            usuario = await pool.query('INSERT INTO usuario(email, senha) VALUES ($1, $2)', [email, senha]);
            return res.status(200).send("Usuário criado");
        }else{
            return res.status(200).send("Usuário já existente");
        };
    } catch(err){
        return res.status(400).send(err);
    }
})

//buscar todos Cliente
app.get('/clientes', async (req, res) => {
    try{
        const cliente = await pool.query('SELECT * FROM cliente');
        return res.status(200).send(cliente.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//buscar por id cliente
app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try{
        let cliente = await pool.query('SELECT * FROM cliente WHERE id = ($1)', [id]);
        return res.status(200).send(cliente.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//criar cliente
app.post('/clientes/cadastrar', async (req, res) => {
    const { nome_cliente, email_cliente, contato_cliente, cpf_cliente } = req.body;
    try{
        let cliente = await pool.query('INSERT INTO cliente(nome_cliente, email_cliente, contato_cliente, cpf_cliente) VALUES ($1, $2, $3, $4)', [nome_cliente, email_cliente, contato_cliente, cpf_cliente])
        return res.status(200).send(cliente.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//update cliente
app.post('/clientes/update/:id', async (req, res) => {
    const { nome_cliente, email_cliente, contato_cliente, cpf_cliente } = req.body;
    const { id } = req.params;
    try{
        let cliente = await pool.query('UPDATE cliente SET nome_cliente = ($1), email_cliente = ($2), contato_cliente = ($3), cpf_cliente = ($4) WHERE id = ($5)', [nome_cliente, email_cliente, contato_cliente, cpf_cliente, id])
        return res.status(200).send(cliente.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//buscar todos Produtos
app.get('/produtos', async (req, res) => {
    try{
        const produto = await pool.query('SELECT * FROM produto');
        return res.status(200).send(produto.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//criar Produto
app.post('/produtos/cadastrar', async (req, res) => {
    const { nome_produto, preco_produto } = req.body;
    try{
        let produto = await pool.query('INSERT INTO produto(nome_produto, preco_produto) VALUES ($1, $2)', [nome_produto, preco_produto])
        return res.status(200).send(produto.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//buscar por id produto
app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try{
        let produto = await pool.query('SELECT * FROM produto WHERE id = ($1)', [id]);
        return res.status(200).send(produto.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//update produto
app.post('/produtos/update/:id', async (req, res) => {
    const { nome_produto, preco_produto } = req.body;
    const { id } = req.params;
    try{
        let produto = await pool.query('UPDATE produto SET nome_produto = ($1), preco_produto = ($2) WHERE id = ($3)', [nome_produto, preco_produto, id])
        return res.status(200).send(produto.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//buscar todos Pedidos
app.get('/pedidos', async (req, res) => {
    try{
        const pedido = await pool.query('SELECT * FROM pedido');
        return res.status(200).send(pedido.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})

//criar Pedido
app.post('/pedidos/cadastrar', async (req, res) => {
    const { preco_total, nome_vendedor, preco_cliente } = req.body;
    try{
        let pedido = await pool.query('INSERT INTO pedido(preco_total, nome_vendedor, nome_cliente) VALUES ($1, $2, $3)', [preco_total, nome_vendedor, preco_cliente])
        return res.status(200).send(pedido.rows)
    } catch(err){
        return res.status(400).send(err);
    }
})


app.listen(PORT, () => console.log(` server rodando na porta ${PORT}`))
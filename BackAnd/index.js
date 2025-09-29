const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Configuração do Sequelize para conectar ao banco de dados MySQL
const sequelize = new Sequelize('db_aula', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    });

// Definição da tabela de Usuário.
const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: { 
        type: DataTypes.STRING,
        allowNull: false
    }
})

//Configuração do servidor Express
const app = express();//Criação da aplicação Express
app.use(cors());//habilita CORS para permitir requisições do frontend
app.use(express.json());//Middleware para parsear JSON no corpo das requisições
const port = 3000;//Porta onde o servidor irá executar

//Criando rotas de API
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios =  await Usuario.findAll();
        res.json(usuarios);
    }  catch (erro){
        res.status(500).json({ message: 'Erro ao buscar usuários'})
    }
}
)


//Rota para adicionar um novo usuário.
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const novoUsuario = await Usuario.create({ nome, email, telefone });
        res.status(201).json(novoUsuario);
    }  catch (error) {
        res.status(400).json({ message: 'verifique se o e-mail já existe.' });
    }
});
//Inicia o servidor após sincronizar criar tabela no banco de dados
sequelize.sync().then(() => {
    // Cria a tabela no bando de dados e inicia o servidor.
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`); // Crase.
        console.log('Banco de dados sincronizado');
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
});


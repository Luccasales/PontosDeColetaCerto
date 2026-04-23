const express = require('express')
const {criarBanco} = require('./database')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())


//  rota principal (listar endpoints)
app.get('/', async (req, res) => {
    res.send(`
        <body>
            <h1> Vamos nos ajudar </h1>
            <p> Endpoints </p>
            <p> Para ver estoque total /estoque </p>
            <p> Para ver estoque por abrigo /estoque/:abrigo </p>
            <p>para fazer doação /doacoes </p>
        `)
})


//  listar abrigos
app.get('/abrigos', async (req, res) => {
    const db = await criarBanco()

    const abrigos = await db.all(`SELECT * FROM abrigos`)

    res.json(abrigos)
})


//  estoque TOTAL
app.get('/estoque', async (req, res) => {
    const db = await criarBanco()

    const estoque = await db.all(`
        SELECT nome_item, SUM(estoque) as total
        FROM itens
        GROUP BY nome_item
    `)

    res.json(estoque)
})


//  estoque por abrigo
app.get('/estoque/:abrigo_id', async (req, res) => {
    const db = await criarBanco()
    const { abrigo_id } = req.params

    const estoque = await db.all(`
        SELECT nome_item, estoque
        FROM itens
        WHERE abrigo_id = ?
    `, [abrigo_id])

    res.json(estoque)
})

app.post('/doacoes', async (req, res) => {
    const db = await criarBanco()

    const { abrigo_id, nome_item, nome_doador, quantidade } = req.body

    if (!abrigo_id || !nome_item || !quantidade) {
        return res.status(400).json({ erro: 'Dados incompletos' })
    }

    //  Tratamenti para por exemplo nao ter Arroz ARROZ arroz e etc
    const nomeItemFormatado = nome_item.trim().toLowerCase()

    // verifica se item existe
    let item = await db.get(`
        SELECT * FROM itens 
        WHERE abrigo_id = ? AND nome_item = ?
    `, [abrigo_id, nomeItemFormatado])

    let item_id

    if (!item) {
       //Criando item
        const result = await db.run(`
            INSERT INTO itens (abrigo_id, nome_item, estoque)
            VALUES (?, ?, 0)
        `, [abrigo_id, nomeItemFormatado])

        item_id = result.lastID
    } else {
        item_id = item.id
    }

    // salvando doação
    await db.run(`
        INSERT INTO doacoes (abrigo_id, item_id, nome_doador, quantidade)
        VALUES (?, ?, ?, ?)
    `, [abrigo_id, item_id, nome_doador, quantidade])

    // atualiza estoque
    await db.run(`
        UPDATE itens
        SET estoque = estoque + ?
        WHERE id = ?
    `, [quantidade, item_id])

    res.json({ message: 'Doação registrada com sucesso!' })
})


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 ')
})
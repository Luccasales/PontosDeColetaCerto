const express = require('express')
const {criarBanco} = require('./database')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

//Função para definir limite de cada categoria
const limites ={
    alimento: 10,
    roupa: 50,
    higiene: 20,
    medicamento: 20
}


//Função para calcular a % que está o estoque
 function calcularPorcentagem(total, limite){
    const porcentagem = (total / limite) * 100

    if(porcentagem <= 20) return "critico"
    if(porcentagem >= 21 && porcentagem <= 40) return "Estável"
    if(porcentagem >= 41 && porcentagem <= 60) return "Bom"
    if(porcentagem >= 61 && porcentagem <= 99) return "muito bom"
    if(porcentagem >= 100) return "cheio"
}

//  rota principal (listar endpoints)
app.get('/', async (req, res) => {
    res.send(`
        <body>
            <h1> Vamos nos ajudar </h1>
            <p> Endpoints </p>
            <p> Para ver estoque total /estoque </p>
            <p> Para ver estoque por abrigo /estoque/:abrigo </p>
            <p>para fazer doação /doacoes </p>
            <p> Para realizar retiradas de itens /retiradas </p>
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
        SELECT abrigos.nome_abrigo,
            itens.nome_item,
            itens.categoria,
            SUM(itens.estoque) as total
        FROM itens
            JOIN abrigos ON itens.abrigo_id = abrigos.id
            GROUP BY abrigos.id, itens.nome_item, itens.categoria
    `)

    //status
    const resultado = estoque.map(item => {
        const limite = limites[item.categoria] || 10
        const status = calcularPorcentagem(item.total, limite)

        return{
            abrigo_id: item.abrigo_id,
            nome_abrigo: item.nome_abrigo,
            nome_item: item.nome_item,
            categoria: item.categoria,
            total: item.total,
            status
        }
    })

    res.json(resultado)
})


//  estoque por abrigo
app.get('/estoque/:abrigo_id', async (req, res) => {
    const db = await criarBanco()
    const { abrigo_id } = req.params

    const estoque = await db.all(`
        SELECT nome_item, categoria, estoque
        FROM itens
        WHERE abrigo_id = ?
    `, [abrigo_id])

    //status
    const resultado = estoque.map(item =>{
        const limite = limites[item.categoria] || 10
        const status = calcularPorcentagem(item.estoque, limite)

        return {
            nome_item: item.nome_item,
            categoria: item.categoria,
            estoque: item.estoque,
            status
        }
    })

    res.json(resultado)
})

app.post('/doacoes', async (req, res) => {
  try {
      const db = await criarBanco()

    const { abrigo_id, nome_item, categoria, nome_doador, quantidade } = req.body

    if (!abrigo_id || !nome_item ||!categoria ||!quantidade) {
        return res.status(400).json({ erro: 'Dados incompletos' })
    }

    if(quantidade <= 0){
        return res.status(400).json({erro: "Quantidade invalida! Impossivel menor ou igual a 0"})
    }
    //  Tratamenti para por exemplo nao ter Arroz ARROZ arroz e etc
    const nomeItemFormatado = nome_item.trim().toLowerCase()
    const categoriaFormatada = categoria.trim().toLowerCase()

    // verifica se item existe
    let item = await db.get(`
        SELECT * FROM itens 
        WHERE abrigo_id = ? AND nome_item = ?
    `, [abrigo_id, nomeItemFormatado])

    let item_id

    if (!item) {
       //Criando item
        const result = await db.run(`
            INSERT INTO itens (abrigo_id, nome_item,categoria, estoque)
            VALUES (?, ?, ?, 0)
        `, [abrigo_id, nomeItemFormatado, categoriaFormatada])

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
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.put('/retirada' , async (req, res) => {
    try {
        const db = await criarBanco()

        const  {abrigo_id, nome_item, quantidade } = req.body

        if(!abrigo_id || !nome_item || !quantidade){
            return res.status(400).json({erro: "Preencha todos os dados"})
        }

        if (quantidade < 0){
            res.status(400).json({erro: "Impossivel retirar menos que 0"})
        }

        //Tratamento para o nome sempre ser igual
        const nomeItemFormatado = nome_item.trim().toLowerCase()

        //Busca no banco de dados
        const item = await db.get(`
            SELECT * FROM itens
            WHERE abrigo_id = ? AND nome_item = ?`,
            [abrigo_id, nomeItemFormatado])

            if(!item){
                return res.status(404).json({erro: 'Item não foi encontrado'})
            }

            if (item.estoque < quantidade){
                return res.status(400).json({erro: "Estoque insuficiente"})
            }

            await db.run(`
                UPDATE itens
                SET estoque = estoque - ?
                WHERE id = ?
                `, [quantidade, item.id])

                res.json({message: 'Item retirado do estoque com sucesso'})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 ')
})
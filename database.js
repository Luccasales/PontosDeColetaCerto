const sqlite3 = require('sqlite3')
const {open} = require("sqlite")


const criarBanco = async() => {

    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })


    await db.exec(`
        -- Tabela de cadastro de pontos de abrigos para coleta
        CREATE TABLE IF NOT EXISTS abrigos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_abrigo TEXT NOT NULL,
            localizacao TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            abrigo_id INTEGER,
            nome_item TEXT,
            estoque INTEGER DEFAULT 0,
            FOREIGN KEY (abrigo_id) REFERENCES abrigos(id)
);

        CREATE TABLE IF NOT EXISTS doacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            abrigo_id INTEGER,
            item_id INTEGER,
            nome_doador TEXT,
            quantidade INTEGER,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (abrigo_id) REFERENCES abrigos(id),
            FOREIGN KEY (item_id) REFERENCES itens(id)
);
        
        `)

        const checagem = await db.get(`SELECT COUNT(*) AS total FROM abrigos`)

        if(checagem.total === 0){
            console.log("Banco vazio! Inserindo dados iniciais...")
            await db.exec(`
                INSERT INTO abrigos
                (id, nome_abrigo, localizacao) VALUES
                (1, 'Abrigo Esperança', 'Rua das Flores, 123 - Centro'),
                (2, 'Mãos unidas', 'Rua da Paz, 456 - Norte'),
                (3, 'Todos juntos', 'Rua alegria, 789 - Leste');
                `)
        }
        console.log("Tabelas configuradas com sucesso!")

        return db

}

module.exports = {criarBanco}
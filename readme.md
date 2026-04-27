# 🌊 Sistema de Organização de Doações em Situações de Enchentes

---

## 📌 1. Apresentação da Ideia

Este projeto foi desenvolvido a partir do desafio sobre enchentes no Brasil, que propõe a criação de uma solução tecnológica para organizar informações em cenários de crise.

Ao analisar o cenário, foi identificada a dificuldade na **organização e distribuição de doações**, onde muitas vezes há excesso de determinados itens em alguns locais, enquanto outros enfrentam escassez.

Com base nisso, surgiu a ideia de criar uma API capaz de centralizar e organizar as informações sobre doações e necessidades dos abrigos, tornando o apoio mais eficiente e direcionado.

---

## ⚠️ 2. Problema Escolhido

O problema abordado neste projeto foi a **Organização de Doações**.

Durante situações de enchente:

* Doadores não sabem o que realmente é necessário
* Alguns abrigos ficam com excesso de itens (ex: roupas)
* Outros sofrem com falta de itens essenciais (ex: alimentos, medicamentos)
* Há desperdício e má distribuição de recursos

### 👥 Impactados:

* Pessoas afetadas pelas enchentes
* Doadores e voluntários
* Equipes de apoio e logística

Esse problema é relevante porque afeta diretamente a eficiência da ajuda humanitária.

---

## 💡 3. Solução Proposta

A solução consiste em um sistema que permite:

* Registrar doações em diferentes abrigos
* Controlar o estoque por abrigo
* Classificar itens por categoria
* Calcular automaticamente o nível de necessidade

### 🔄 Funcionamento:

1. O usuário registra uma doação
2. O sistema armazena os dados no banco
3. O estoque é atualizado automaticamente
4. Um status é calculado com base no nível de estoque

### 🚀 Diferencial

O sistema fornece uma visão clara e atualizada das necessidades de cada abrigo, permitindo decisões mais rápidas e eficientes na distribuição de recursos.

---

## 🏗️ 4. Estrutura do Sistema

### 🔹 Back-end

Desenvolvido com **Node.js e Express**, responsável por:

* Receber requisições (doações e retiradas)
* Processar dados
* Aplicar regras de negócio
* Retornar informações organizadas

---

### 🔹 Banco de Dados

Utilizado **SQLite**, com as tabelas:

* **abrigos** → locais de apoio
* **itens** → estoque por abrigo
* **doacoes** → histórico de doações

---

### 🔹 Front-end (planejado)

Permitirá:

* Visualização dos abrigos
* Consulta de necessidades
* Registro de doações
* Interface simples e acessível

---

## ⚙️ Tecnologias utilizadas

* Node.js
* Express
* SQLite
* JavaScript

---

## 🧠 Funcionalidades

* Cadastro automático de abrigos
* Registro de doações
* Controle de estoque por abrigo
* Controle de estoque total
* Sistema de categorias:

  * Alimento
  * Roupa
  * Higiene
  * Medicamento
* Cálculo automático de status:

  * Crítico
  * Estável
  * Bom
  * Muito bom
  * Cheio
* Sistema de retirada de itens (baixa no estoque)

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/Luccasales/PontosDeColetaCerto
```

---

### 2. Entrar na pasta

```bash
cd PontosDeColetaCerto
```

---

### 3. Instalar dependências

```bash
npm install
```

---

### 4. Rodar o servidor

```bash
node server.js
```

---

### 5. Acessar no navegador

```bash
http://localhost:3000
```

---

## 📡 Endpoints

### 🔹 Listar abrigos

GET `/abrigos`

---

### 🔹 Ver estoque total (com status)

GET `/estoque`

---

### 🔹 Ver estoque por abrigo

GET `/estoque/:abrigo_id`

---

### 🔹 Registrar doação

POST `/doacoes`

#### Exemplo:

```json
{
  "abrigo_id": 1,
  "nome_item": "Arroz",
  "categoria": "alimento",
  "nome_doador": "Lucca",
  "quantidade": 2
}
```

---

### 🔹 Retirar item (baixa no estoque)

PUT `/retirada`

#### Exemplo:

```json
{
  "abrigo_id": 1,
  "nome_item": "arroz",
  "quantidade": 1
}
```

---

## 📊 Regras de negócio

* Itens são normalizados (ex: "Arroz" = "arroz")
* Estoque nunca pode ficar negativo
* Itens iguais no mesmo abrigo não são duplicados
* O status é calculado com base no limite por categoria
* Cada abrigo possui controle independente de estoque


---

## 👨‍💻 Autor

Projeto desenvolvido por **Lucca Sales**

---

## 📌 Considerações finais

Este projeto demonstra como a tecnologia pode ser aplicada para resolver problemas reais em cenários de crise, organizando informações e tornando a ajuda humanitária mais eficiente.

Mais do que o código, o foco foi entender o problema e propor uma solução prática e aplicável.

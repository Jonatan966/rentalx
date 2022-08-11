<div align="center">
  <h1>Rentalx</h1>
</div>

Uma API de um serviço de aluguel de carros

## 👽 Tecnologias

- NodeJS
- Express
- Nodemon
- Eslint
- Prettier
- Multer
- Typescript
- Swagger
- Jest

## Funcionalidades

### Cadastro de Carros

- **Requisitos Funcionais**
- [x] Deve ser possível cadastrar um novo carro

- **Regras de Negócio**
- [x] Não deve ser possível cadastrar um carro com uma placa já existente
- [x] O carro deve ser cadastrado com disponibilidade por padrão
- [x] O usuário responsável pelo cadastro deve ser um usuário administrador

### Listagem de Carros

- **Requisitos Funcionais**
- [ ] Deve ser possível listar todos os carros disponíveis
- [ ] Deve ser possível listar todos os carros disponíveis pelo nome da categoria
- [ ] Deve ser possível listar todos os carros disponíveis pelo nome da marca
- [ ] Deve ser possível listar todos os carros disponíveis pelo nome do carro
- [x] Deve ser possível listar todas as categorias

- **Regras de Negócio**
- [ ] O usuário não precisa estar logado no sistema

### Cadastro de especificação no carro

- **Requisitos Funcionais**
- [x] Deve ser possível cadastrar uma especificação para um carro
- [ ] Deve ser possível listar todas as especificações

- **Regras de Negócio**
- [ ] Não deve ser possível cadastrar uma especificação para um carro não cadastrado
- [x] Não deve ser possível cadastrar uma especificação já existente para o mesmo carro
- [ ] O usuário responsável pelo cadastro deve ser um usuário administrador

### Cadastro de imagens do carro

- **Requisitos Funcionais**
- [ ] Deve ser possível cadastrar a imagem do carro
- [ ] Deve ser possível listar todos os carros

- **Requisitos não funcionais**
- [ ] Utilizar o multer para upload dos arquivos

- **Regras de Negócio**
- [ ] O usuário deve poder cadastrar mais de uma imagem para o mesmo carro
- [ ] O usuário responsável pelo cadastro deve ser um usuário administrador

### Aluguel de carro

- **Requisitos Funcionais**
- [ ] Deve ser possível cadastrar um aluguel

- **Regras de Negócio**
- [ ] O aluguel deve ter duração mínima de 24 horas
- [ ] Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário
- [ ] Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro

### Categorias

- **Requisitos Funcionais**
- [x] Deve ser possível cadastrar uma categoria
- [x] Deve ser possível importar uma categoria, por meio de um arquivo CSV

- **Regras de Negócio**
- [x] Não deve ser possível cadastrar uma categoria já existente

## 🧰 Como iniciar

### ‼️ Requerimentos

Esse projeto usa o Yarn como gerenciador de dependências

```
npm install --global yarn
```

### ⚙️ Instalação local

Clone o projeto

```
git clone https://github.com/Jonatan966/rentalx.git
```

Vá até o diretório do projeto

```
cd rentalx
```

Instale as dependências

```
yarn install
```

Inicie o servidor

```
yarn start
```

## 📃 Documentação

Este projeto utiliza o `Swagger`, e é possível acessar por meio da rota `/api-docs`

-- =========================================
-- BANCO DE DADOS LADYCAR
-- PostgreSQL
-- =========================================

DROP TABLE IF EXISTS agendamento CASCADE;
DROP TABLE IF EXISTS prestador_servico CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;

-- =========================================
-- CLIENTES
-- =========================================

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,

    documento VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20),

    cep VARCHAR(10),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    complemento VARCHAR(100),
    cidade_estado VARCHAR(100),

    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PRESTADORES
-- =========================================

CREATE TABLE prestador_servico (
    id_prestador SERIAL PRIMARY KEY,

    nome VARCHAR(200) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(30),

    email VARCHAR(200) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,

    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,

    cidade VARCHAR(100),
    estado VARCHAR(100),

    avaliacao NUMERIC(2,1) DEFAULT 0,

    ativo BOOLEAN DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- SERVIÇOS
-- =========================================

CREATE TABLE servicos (
    id_servico SERIAL PRIMARY KEY,

    nome_servico VARCHAR(100) UNIQUE NOT NULL,

    descricao_servico TEXT,

    preco DECIMAL(10,2) DEFAULT 0.00
);

-- =========================================
-- AGENDAMENTOS
-- =========================================

CREATE TABLE agendamento (

    id_agendamento SERIAL PRIMARY KEY,

    id_cliente INTEGER NOT NULL,
    id_prestador INTEGER,
    id_servico INTEGER,

    data DATE NOT NULL,
    hora TIME NOT NULL,

    descricao VARCHAR(255),

    status VARCHAR(50) DEFAULT 'Pendente',

    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_prestador
        FOREIGN KEY (id_prestador)
        REFERENCES prestador_servico(id_prestador),

    CONSTRAINT fk_servico
        FOREIGN KEY (id_servico)
        REFERENCES servicos(id_servico)
);

-- =========================================
-- SERVIÇOS PADRÃO
-- =========================================

INSERT INTO servicos
(nome_servico, descricao_servico)
VALUES

('Troca de Fusíveis',
 'Serviço rápido para substituição de fusíveis queimados'),

('Calibragem de Pneus',
 'Verificação e ajuste da pressão dos pneus'),

('Recarga e Troca de Bateria',
 'Teste e substituição de bateria'),

('Troca de Óleo',
 'Troca de óleo e filtro'),

('Instalação de Acessórios',
 'Instalação de alarmes, som e acessórios'),

('Limpeza de Ar-Condicionado',
 'Higienização do sistema'),

('Verificação de Fluídos',
 'Checagem dos níveis dos fluídos'),

('Reparo de Pneus',
 'Conserto de pneus'),

('Lavagem a Seco',
 'Lavagem ecológica do veículo');
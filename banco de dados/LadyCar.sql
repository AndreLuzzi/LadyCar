CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    documento VARCHAR(14) UNIQUE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE cliente ADD COLUMN telefone VARCHAR(20);
ALTER TABLE cliente ADD COLUMN cep VARCHAR(10);
ALTER TABLE cliente ADD COLUMN numero VARCHAR(10);
ALTER TABLE cliente ADD COLUMN bairro VARCHAR(100);
ALTER TABLE cliente ADD COLUMN complemento VARCHAR(100);
ALTER TABLE cliente ADD COLUMN cidade_estado VARCHAR(100);
ALTER TABLE cliente ADD COLUMN endereco VARCHAR(100);


select * from cliente

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'cliente';

CREATE TABLE servicos (
    id_servico SERIAL PRIMARY KEY,
    nome_servico VARCHAR(100) UNIQUE NOT NULL,
    descricao_servico TEXT,
    preco DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE agendamento (
    id_agendamento SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id_cliente) NOT NULL,
    id_servico INT REFERENCES servicos(id_servico), 
    data DATE NOT NULL,
    hora TIME NOT NULL,
    descricao VARCHAR(255) NOT NULL, 
    status VARCHAR(50) DEFAULT 'Pendente', 
    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prestador_servico (
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
  criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE agendamento
ADD COLUMN IF NOT EXISTS id_prestador INTEGER;

ALTER TABLE agendamento
ADD COLUMN status_solicitacao VARCHAR(30) DEFAULT 'pendente';

ALTER TABLE agendamento
ADD CONSTRAINT fk_agendamento_prestador
FOREIGN KEY (id_prestador)
REFERENCES prestador_servico(id_prestador);

INSERT INTO servicos (nome_servico, descricao_servico) VALUES
('Troca de Fusíveis', 'Serviço rápido para substituição de fusíveis queimados.'),
('Calibragem de Pneus', 'Verificação e ajuste da pressão dos pneus.'),
('Recarga e Troca de Bateria', 'Teste de bateria e serviço de recarga ou substituição.'),
('Troca de Óleo', 'Substituição do óleo do motor e filtro.'),
('Instalação de Acessórios', 'Instalação de som, alarmes e outros acessórios.'),
('Limpeza de Ar-Condicionado', 'Higienização completa do sistema de ar-condicionado.'),
('Verificação de Nível de Fluídos', 'Checagem e reposição de fluídos essenciais (freio, radiador, etc.).'),
('Reparo de Pneus', 'Conserto de furos e pequenos danos nos pneus.'),
('Lavagem a Seco', 'Limpeza externa e interna do veículo sem uso excessivo de água.');

SELECT * FROM prestador_servico;
SELECT * FROM agendamento;
SELECT * FROM cliente;
SELECT id_prestador, nome, email
FROM prestador_servico
ORDER BY id_prestador;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;


SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';


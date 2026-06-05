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

select * from servicos
	

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
-- Table: prestador_servico

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

-- Caso exista tabela agendamento, adiciona foreign key opcional (não falha se a tabela não existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agendamento') THEN
    BEGIN
      ALTER TABLE agendamento
      ADD COLUMN IF NOT EXISTS id_prestador INTEGER;
      ALTER TABLE agendamento
      ADD CONSTRAINT IF NOT EXISTS fk_agendamento_prestador FOREIGN KEY (id_prestador) REFERENCES prestador_servico(id_prestador);
    EXCEPTION WHEN duplicate_column THEN
      -- ignore
    END;
  END IF;
END$$;

-- Categorias sugeridas:
-- Mecânico, Eletricista, Borracheiro, Guincho, Funilaria, Pintura, Troca de Óleo, Lavagem

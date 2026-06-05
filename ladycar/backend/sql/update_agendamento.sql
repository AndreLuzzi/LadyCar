-- Atualizar tabela agendamento para suportar roteamento de prestador

ALTER TABLE agendamento
ADD COLUMN IF NOT EXISTS id_prestador INTEGER,
ADD COLUMN IF NOT EXISTS status_solicitacao VARCHAR(50) DEFAULT 'pendente',
ADD CONSTRAINT fk_agendamento_prestador FOREIGN KEY (id_prestador) REFERENCES prestador_servico(id_prestador);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_agendamento_prestador ON agendamento(id_prestador);
CREATE INDEX IF NOT EXISTS idx_agendamento_status ON agendamento(status_solicitacao);

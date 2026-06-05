-- Adicionar categoria na tabela servicos para mapear com prestador_servico

ALTER TABLE servicos
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);

-- Exemplos de mapping (ajuste conforme sua tabela)
UPDATE servicos SET categoria = 'Mecânico' WHERE nome_servico LIKE '%Óleo%' OR nome_servico LIKE '%Mecân%';
UPDATE servicos SET categoria = 'Borracheiro' WHERE nome_servico LIKE '%Pneu%' OR nome_servico LIKE '%Bor%';
UPDATE servicos SET categoria = 'Eletricista' WHERE nome_servico LIKE '%Bateria%' OR nome_servico LIKE '%Elétric%' OR nome_servico LIKE '%Fusív%';
UPDATE servicos SET categoria = 'Limpeza' WHERE nome_servico LIKE '%Lavag%' OR nome_servico LIKE '%Limpez%';
UPDATE servicos SET categoria = 'Reparo' WHERE nome_servico LIKE '%Reparo%';
UPDATE servicos SET categoria = 'Verificação' WHERE nome_servico LIKE '%Verific%' OR nome_servico LIKE '%Nível%';

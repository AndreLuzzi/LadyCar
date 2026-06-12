--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2026-06-12 17:27:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 25397)
-- Name: agendamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agendamento (
    id_agendamento integer NOT NULL,
    id_cliente integer NOT NULL,
    id_servico integer,
    data date NOT NULL,
    hora time without time zone NOT NULL,
    descricao character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'Pendente'::character varying,
    data_agendamento timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_prestador integer,
    status_solicitacao character varying(30) DEFAULT 'pendente'::character varying
);


ALTER TABLE public.agendamento OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25396)
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamento_id_agendamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agendamento_id_agendamento_seq OWNER TO postgres;

--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 219
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamento_id_agendamento_seq OWNED BY public.agendamento.id_agendamento;


--
-- TOC entry 224 (class 1259 OID 25511)
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avaliacao (
    id_avaliacao integer NOT NULL,
    id_agendamento integer NOT NULL,
    id_cliente integer NOT NULL,
    id_prestador integer NOT NULL,
    nota integer NOT NULL,
    comentario text,
    data_avaliacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT avaliacao_nota_check CHECK (((nota >= 1) AND (nota <= 5)))
);


ALTER TABLE public.avaliacao OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25510)
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avaliacao_id_avaliacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avaliacao_id_avaliacao_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 223
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avaliacao_id_avaliacao_seq OWNED BY public.avaliacao.id_avaliacao;


--
-- TOC entry 216 (class 1259 OID 25371)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha text NOT NULL,
    documento character varying(14) NOT NULL,
    data_cadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telefone character varying(20),
    cep character varying(10),
    numero character varying(10),
    bairro character varying(100),
    complemento character varying(100),
    cidade_estado character varying(100),
    endereco character varying(100)
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25370)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 215
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- TOC entry 222 (class 1259 OID 25416)
-- Name: prestador_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestador_servico (
    id_prestador integer NOT NULL,
    nome character varying(200) NOT NULL,
    cpf character varying(20) NOT NULL,
    telefone character varying(30),
    email character varying(200) NOT NULL,
    senha character varying(200) NOT NULL,
    categoria character varying(100) NOT NULL,
    descricao text,
    cidade character varying(100),
    estado character varying(100),
    avaliacao numeric(2,1) DEFAULT 0,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT now(),
    cep character varying(20),
    endereco character varying(255),
    numero character varying(20),
    bairro character varying(100),
    complemento character varying(255)
);


ALTER TABLE public.prestador_servico OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25415)
-- Name: prestador_servico_id_prestador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestador_servico_id_prestador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestador_servico_id_prestador_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 221
-- Name: prestador_servico_id_prestador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestador_servico_id_prestador_seq OWNED BY public.prestador_servico.id_prestador;


--
-- TOC entry 218 (class 1259 OID 25385)
-- Name: servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos (
    id_servico integer NOT NULL,
    nome_servico character varying(100) NOT NULL,
    descricao_servico text,
    preco numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.servicos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25384)
-- Name: servicos_id_servico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicos_id_servico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicos_id_servico_seq OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 217
-- Name: servicos_id_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_id_servico_seq OWNED BY public.servicos.id_servico;


--
-- TOC entry 4759 (class 2604 OID 25400)
-- Name: agendamento id_agendamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento ALTER COLUMN id_agendamento SET DEFAULT nextval('public.agendamento_id_agendamento_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 25514)
-- Name: avaliacao id_avaliacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao ALTER COLUMN id_avaliacao SET DEFAULT nextval('public.avaliacao_id_avaliacao_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 25374)
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 25419)
-- Name: prestador_servico id_prestador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico ALTER COLUMN id_prestador SET DEFAULT nextval('public.prestador_servico_id_prestador_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 25388)
-- Name: servicos id_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos ALTER COLUMN id_servico SET DEFAULT nextval('public.servicos_id_servico_seq'::regclass);


--
-- TOC entry 4946 (class 0 OID 25397)
-- Dependencies: 220
-- Data for Name: agendamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agendamento (id_agendamento, id_cliente, id_servico, data, hora, descricao, status, data_agendamento, id_prestador, status_solicitacao) FROM stdin;
6	9	\N	2026-06-12	15:36:00	Calibragem de Pneus	Pendente	2026-06-11 15:35:31.275451	\N	sem_prestador
7	9	\N	2026-06-13	15:41:00	Instalação de Acessórios	Pendente	2026-06-11 15:39:04.523887	\N	sem_prestador
8	9	\N	2026-06-13	15:41:00	Lavagem a Seco	Pendente	2026-06-11 15:39:13.635601	\N	sem_prestador
9	9	\N	2026-06-13	15:41:00	Limpeza de Ar-Condicionado	Pendente	2026-06-11 15:39:22.250983	\N	sem_prestador
10	9	\N	2026-06-13	15:41:00	Recarga e Troca de Bateria	Pendente	2026-06-11 15:39:30.590227	\N	sem_prestador
12	9	\N	2026-06-13	15:41:00	Troca de Fusíveis	Pendente	2026-06-11 15:39:54.247945	\N	sem_prestador
13	9	\N	2026-06-13	15:41:00	Troca de Óleo	Pendente	2026-06-11 15:40:00.813735	\N	sem_prestador
14	9	\N	2026-06-13	15:41:00	Verificação de Nível de Fluídos	Pendente	2026-06-11 15:40:08.461838	\N	sem_prestador
11	9	\N	2026-06-24	15:46:00	Reparo de Pneus	Pendente	2026-06-11 15:39:41.12396	12	concluido
19	10	\N	2026-06-27	16:41:00	Recarga e Troca de Bateria	Pendente	2026-06-11 16:38:31.957245	\N	sem_prestador
21	10	\N	2026-06-27	16:41:00	Troca de Fusíveis	Pendente	2026-06-11 16:38:47.12112	\N	sem_prestador
23	10	\N	2026-06-27	16:41:00	Verificação de Nível de Fluídos	Pendente	2026-06-11 16:39:03.787063	16	recusado
22	10	\N	2026-06-27	16:41:00	Troca de Óleo	Pendente	2026-06-11 16:38:54.803199	16	concluido
20	10	\N	2026-06-27	16:41:00	Reparo de Pneus	Pendente	2026-06-11 16:38:40.116865	12	recusado
18	10	\N	2026-06-27	16:41:00	Limpeza de Ar-Condicionado	Pendente	2026-06-11 16:38:25.692013	16	recusado
17	10	\N	2026-06-27	16:41:00	Lavagem a Seco	Pendente	2026-06-11 16:38:18.759376	14	recusado
16	10	\N	2026-06-27	16:41:00	Instalação de Acessórios	Pendente	2026-06-11 16:38:13.852636	16	aceito
15	10	\N	2026-06-27	16:41:00	Calibragem de Pneus	Pendente	2026-06-11 16:38:07.843171	12	concluido
25	9	\N	2026-07-01	14:50:00	Calibragem de Pneus	Pendente	2026-06-12 14:46:24.399067	\N	sem_prestador
24	9	\N	2026-06-17	12:05:00	Calibragem de Pneus	Pendente	2026-06-12 12:04:52.317232	12	concluido
27	9	\N	2026-06-27	16:39:00	Limpeza de Ar-Condicionado	Pendente	2026-06-12 16:35:56.954057	16	concluido
26	9	\N	2026-06-27	16:39:00	Lavagem a Seco	Pendente	2026-06-12 16:35:48.383045	14	concluido
28	9	\N	2026-06-12	17:10:00	Limpeza de Ar-Condicionado	Pendente	2026-06-12 17:06:39.781499	16	concluido
\.


--
-- TOC entry 4950 (class 0 OID 25511)
-- Dependencies: 224
-- Data for Name: avaliacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avaliacao (id_avaliacao, id_agendamento, id_cliente, id_prestador, nota, comentario, data_avaliacao) FROM stdin;
2	11	9	12	4	abacate	2026-06-11 18:31:05.573287
5	26	9	14	5	legal demaisss	2026-06-12 16:44:06.978685
6	27	9	16	2	ruim	2026-06-12 16:44:17.139124
7	28	9	16	5	melhor do mundo	2026-06-12 17:07:59.861348
\.


--
-- TOC entry 4942 (class 0 OID 25371)
-- Dependencies: 216
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id_cliente, nome, email, senha, documento, data_cadastro, telefone, cep, numero, bairro, complemento, cidade_estado, endereco) FROM stdin;
9	test	test@gmail.com	$2b$10$rOjyr6mbPKzVGHc9fVI9..X3S8eRU7MsCr7DnQFzzbruwgEOnIiWK	12345678912	2026-06-11 15:34:05.510775	9909-0340	85.819.040	167	aaaaaaaaaaaa	residencial west park	cascavel	aaaaaaaaaaaaaa
10	test3	test3@gmail.com	$2b$10$esjw7u8LPYYHREta8VHzfO1zqZ1vE99JHjAov/nb1BpUsIC/og8G2	123.456.789-22	2026-06-11 16:36:01.948093	9909-0340	85.819.040	167	universitario	residencial west park	cascavel	aaaaaaaaaaaaaa
11	test4	test4@gmail.com	$2b$10$sLCEFtPCgL/0RvijIXhHq.BH1F5qXFQW1jsMvlojWuie48ZvZCx7q	123.444.789-44	2026-06-12 12:05:41.768002	9909-0340	85.819.040	167	aaaaaaaaaaaa	residencial west park	cascavel	aaaaaaaaaaaaaa
12	test5	test5@gmail.com	$2b$10$6iAHizKXLqWu0GkKfBL5.eqn0D5TOCcn2HjzusLAPR8wUS7BWGIF2	123123	2026-06-12 14:48:50.765585	123123	123123	167	aaaaaaaaaaaa	residencial west park	cascavel	aaaaaaaaaaaaaa
\.


--
-- TOC entry 4948 (class 0 OID 25416)
-- Dependencies: 222
-- Data for Name: prestador_servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestador_servico (id_prestador, nome, cpf, telefone, email, senha, categoria, descricao, cidade, estado, avaliacao, ativo, criado_em, cep, endereco, numero, bairro, complemento) FROM stdin;
21	josney	111.111.111-11	(11) 11111-1111	test9@gmail.com	$2b$10$IZxXbKdYto1oCOaPfiB6leCQ8fxBP338W.rcCmpQgDXDkiG3cFUHe	a vaca come mato	josney	josney	josney	0.0	t	2026-06-12 12:06:48.328512	11111-111	josney	9999	josney	josney
17	testcompleto	603.604.709-22	999090340	test4@gmail.com	$2b$10$ZlQ.X3nh4wCfLjEve0Uy6.j1fE7q19viOY3gSzS.Yp0vryAIvzlfa	Mecânico	a	cascavel	parana	0.0	t	2026-06-12 11:19:41.068608	85819-040	aaa	1438	Universitário	a
18	test5	103.404.709-66	999090340	test5@gmail.com	$2b$10$My1irJpSJ5KsgDpg6bKKDOPwl8cj/9x/yMVuN/G/UJhA9dbo6PP32	Mecânico	a	cascavel	parana	0.0	t	2026-06-12 11:33:53.966477	86819-44	aaa	1438	Universitário	a
19	test6	101.604.709-21	999090340	test6@gmail.com	$2b$10$uPLiuk3mABXrKE7MhV5gh.zKi63vqZtl31THxaNYOpJq31Opu0ePa	Lavagem	a	cascavel	parana	0.0	t	2026-06-12 11:38:15.328471	86819-44	aaa	1438	Universitário	a
22	teste máscara	222.222.222-22	(22) 22222-2222	test10@gmail.com	$2b$10$RhfB9FnhMrU54MDqMxSbVux5LcVPxX/lBl4k2FJNuSxkSvgdQWLOO	Mecânico	aaa	cascavel	parana	0.0	t	2026-06-12 14:25:33.804151	22222-222	joaaa	2221	Universitário	a
23	test11	103.604.709-21	(22) 22222-2222	test11@gmail.com	$2b$10$JDUtp9O2nwEADYvQZqF2Fus48xZemTmh9tjugFeVYwR6pMD6b6m66	Borracheiro	a	cascavel	parana	0.0	t	2026-06-12 14:49:55.453333	12111-133	joaaa	1111	Universitário	a
20	test8	103.614.709-66	999090340	test8@gmail.com	$2b$10$SDXduff9nOs7pxS5PBXa6uUx1o8wTpxigCU/jRtjHxMUB/mWd8jkq	Guincho	a	cascavel	parana	0.0	f	2026-06-12 11:57:04.798955	85819-139	aaa	1438	Universitário	a
12	test	a vaca da leite	a vaca da leite	test@gmail.com	$2b$10$84UA.gMTsOhazkOLZ/4Ocui/ohoXeEVNPMQ1wzEXtK69TK8cB/9c2	a vaca da leite	a vaca da leite	a vaca da leite	a vaca da leite	4.0	t	2026-06-11 15:36:52.492506	a vaca da leite	a vaca da leite	\N	a vaca da leite	a vaca da leite
14	test2	103.604.709-00	999090340	test2@gmail.com	$2b$10$Q1xqXAKtGK06MonBDre2Iu5Rx194CUU22lAZFXoE92S.KrUzcq6TO	Lavagem	a	cascavel	parana	3.5	t	2026-06-11 16:25:27.690528	\N	\N	\N	\N	\N
16	test3	103.604.709-29	999090340	test3@gmail.com	$2b$10$CYK8v6ZHbvL47ZM5ZvT7UegDZsPw6hKcL0.UgdvnmVX1HJuSTBo5e	Mecânico	a	cascavel	parana	3.5	t	2026-06-11 16:37:20.599166	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4944 (class 0 OID 25385)
-- Dependencies: 218
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos (id_servico, nome_servico, descricao_servico, preco) FROM stdin;
1	Troca de Fusíveis	Serviço rápido para substituição de fusíveis queimados.	0.00
2	Calibragem de Pneus	Verificação e ajuste da pressão dos pneus.	0.00
3	Recarga e Troca de Bateria	Teste de bateria e serviço de recarga ou substituição.	0.00
4	Troca de Óleo	Substituição do óleo do motor e filtro.	0.00
5	Instalação de Acessórios	Instalação de som, alarmes e outros acessórios.	0.00
6	Limpeza de Ar-Condicionado	Higienização completa do sistema de ar-condicionado.	0.00
7	Verificação de Nível de Fluídos	Checagem e reposição de fluídos essenciais (freio, radiador, etc.).	0.00
8	Reparo de Pneus	Conserto de furos e pequenos danos nos pneus.	0.00
9	Lavagem a Seco	Limpeza externa e interna do veículo sem uso excessivo de água.	0.00
\.


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 219
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agendamento_id_agendamento_seq', 28, true);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 223
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avaliacao_id_avaliacao_seq', 7, true);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 215
-- Name: cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 12, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 221
-- Name: prestador_servico_id_prestador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestador_servico_id_prestador_seq', 23, true);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 217
-- Name: servicos_id_servico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_id_servico_seq', 9, true);


--
-- TOC entry 4781 (class 2606 OID 25404)
-- Name: agendamento agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_pkey PRIMARY KEY (id_agendamento);


--
-- TOC entry 4789 (class 2606 OID 25520)
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id_avaliacao);


--
-- TOC entry 4771 (class 2606 OID 25383)
-- Name: cliente cliente_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_documento_key UNIQUE (documento);


--
-- TOC entry 4773 (class 2606 OID 25381)
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- TOC entry 4775 (class 2606 OID 25379)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 4783 (class 2606 OID 25428)
-- Name: prestador_servico prestador_servico_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_cpf_key UNIQUE (cpf);


--
-- TOC entry 4785 (class 2606 OID 25430)
-- Name: prestador_servico prestador_servico_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_email_key UNIQUE (email);


--
-- TOC entry 4787 (class 2606 OID 25426)
-- Name: prestador_servico prestador_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_pkey PRIMARY KEY (id_prestador);


--
-- TOC entry 4777 (class 2606 OID 25395)
-- Name: servicos servicos_nome_servico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_nome_servico_key UNIQUE (nome_servico);


--
-- TOC entry 4779 (class 2606 OID 25393)
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id_servico);


--
-- TOC entry 4791 (class 2606 OID 25677)
-- Name: avaliacao unique_agendamento; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT unique_agendamento UNIQUE (id_agendamento);


--
-- TOC entry 4792 (class 2606 OID 25405)
-- Name: agendamento agendamento_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4793 (class 2606 OID 25410)
-- Name: agendamento agendamento_id_servico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico);


--
-- TOC entry 4794 (class 2606 OID 25431)
-- Name: agendamento fk_agendamento_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT fk_agendamento_prestador FOREIGN KEY (id_prestador) REFERENCES public.prestador_servico(id_prestador);


--
-- TOC entry 4795 (class 2606 OID 25521)
-- Name: avaliacao fk_avaliacao_agendamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_agendamento FOREIGN KEY (id_agendamento) REFERENCES public.agendamento(id_agendamento);


--
-- TOC entry 4796 (class 2606 OID 25526)
-- Name: avaliacao fk_avaliacao_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4797 (class 2606 OID 25531)
-- Name: avaliacao fk_avaliacao_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_prestador FOREIGN KEY (id_prestador) REFERENCES public.prestador_servico(id_prestador);


-- Completed on 2026-06-12 17:27:40

--
-- PostgreSQL database dump complete
--


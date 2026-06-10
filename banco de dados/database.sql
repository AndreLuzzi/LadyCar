--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2026-06-10 16:26:51

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
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 219
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamento_id_agendamento_seq OWNED BY public.agendamento.id_agendamento;


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
-- TOC entry 4940 (class 0 OID 0)
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
    criado_em timestamp without time zone DEFAULT now()
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
-- TOC entry 4941 (class 0 OID 0)
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
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 217
-- Name: servicos_id_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_id_servico_seq OWNED BY public.servicos.id_servico;


--
-- TOC entry 4754 (class 2604 OID 25400)
-- Name: agendamento id_agendamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento ALTER COLUMN id_agendamento SET DEFAULT nextval('public.agendamento_id_agendamento_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 25374)
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 25419)
-- Name: prestador_servico id_prestador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico ALTER COLUMN id_prestador SET DEFAULT nextval('public.prestador_servico_id_prestador_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 25388)
-- Name: servicos id_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos ALTER COLUMN id_servico SET DEFAULT nextval('public.servicos_id_servico_seq'::regclass);


--
-- TOC entry 4931 (class 0 OID 25397)
-- Dependencies: 220
-- Data for Name: agendamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agendamento (id_agendamento, id_cliente, id_servico, data, hora, descricao, status, data_agendamento, id_prestador, status_solicitacao) FROM stdin;
\.


--
-- TOC entry 4927 (class 0 OID 25371)
-- Dependencies: 216
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id_cliente, nome, email, senha, documento, data_cadastro, telefone, cep, numero, bairro, complemento, cidade_estado, endereco) FROM stdin;
\.


--
-- TOC entry 4933 (class 0 OID 25416)
-- Dependencies: 222
-- Data for Name: prestador_servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestador_servico (id_prestador, nome, cpf, telefone, email, senha, categoria, descricao, cidade, estado, avaliacao, ativo, criado_em) FROM stdin;
\.


--
-- TOC entry 4929 (class 0 OID 25385)
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
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 219
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agendamento_id_agendamento_seq', 5, true);


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 215
-- Name: cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 8, true);


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 221
-- Name: prestador_servico_id_prestador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestador_servico_id_prestador_seq', 10, true);


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 217
-- Name: servicos_id_servico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_id_servico_seq', 9, true);


--
-- TOC entry 4773 (class 2606 OID 25404)
-- Name: agendamento agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_pkey PRIMARY KEY (id_agendamento);


--
-- TOC entry 4763 (class 2606 OID 25383)
-- Name: cliente cliente_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_documento_key UNIQUE (documento);


--
-- TOC entry 4765 (class 2606 OID 25381)
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- TOC entry 4767 (class 2606 OID 25379)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 4775 (class 2606 OID 25428)
-- Name: prestador_servico prestador_servico_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_cpf_key UNIQUE (cpf);


--
-- TOC entry 4777 (class 2606 OID 25430)
-- Name: prestador_servico prestador_servico_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_email_key UNIQUE (email);


--
-- TOC entry 4779 (class 2606 OID 25426)
-- Name: prestador_servico prestador_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servico
    ADD CONSTRAINT prestador_servico_pkey PRIMARY KEY (id_prestador);


--
-- TOC entry 4769 (class 2606 OID 25395)
-- Name: servicos servicos_nome_servico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_nome_servico_key UNIQUE (nome_servico);


--
-- TOC entry 4771 (class 2606 OID 25393)
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id_servico);


--
-- TOC entry 4780 (class 2606 OID 25405)
-- Name: agendamento agendamento_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4781 (class 2606 OID 25410)
-- Name: agendamento agendamento_id_servico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico);


--
-- TOC entry 4782 (class 2606 OID 25431)
-- Name: agendamento fk_agendamento_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT fk_agendamento_prestador FOREIGN KEY (id_prestador) REFERENCES public.prestador_servico(id_prestador);


-- Completed on 2026-06-10 16:26:51

--
-- PostgreSQL database dump complete
--


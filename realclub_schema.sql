-- ============================================================
--  RealClub · Plataforma de Gestão para Clubes
--  Banco de dados do monitoramento do serviço "API Horse"
--  SGBD: PostgreSQL 14+
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- Tipos enumerados ----------
create type papel_usuario     as enum ('suporte', 'admin', 'gestor');
create type status_servico    as enum ('ativo', 'parado');
create type ambiente_servico  as enum ('producao', 'homologacao');

-- ============================================================
--  usuarios — equipe que acessa o painel (tela de login)
-- ============================================================
create table usuarios (
  id            uuid           primary key default uuid_generate_v4(),
  nome          varchar(120)   not null,
  email         varchar(160)   not null unique,
  senha_hash    varchar(255)   not null,
  papel         papel_usuario  not null default 'suporte',
  ativo         boolean        not null default true,
  ultimo_login  timestamptz,
  criado_em     timestamptz    not null default now()
);

-- ============================================================
--  clubes — clubes cadastrados e monitorados
-- ============================================================
create table clubes (
  id                 uuid          primary key default uuid_generate_v4(),
  nome               varchar(160)  not null,
  cnpj               varchar(18)   unique,
  cidade             varchar(120),
  uf                 char(2),
  responsavel_nome   varchar(120),
  responsavel_email  varchar(160),
  criado_por         uuid          references usuarios(id) on delete set null,
  criado_em          timestamptz   not null default now(),
  atualizado_em      timestamptz   not null default now()
);

-- ============================================================
--  servicos_apihorse — configuração do serviço (1:1 com clube)
-- ============================================================
create table servicos_apihorse (
  id             uuid              primary key default uuid_generate_v4(),
  clube_id       uuid              not null unique references clubes(id) on delete cascade,
  url_health     varchar(300)      not null,
  versao         varchar(20),
  intervalo_min  smallint          not null default 5,
  ambiente       ambiente_servico  not null default 'producao',
  status_atual   status_servico    not null default 'ativo',
  verificado_em  timestamptz,
  criado_em      timestamptz       not null default now()
);

-- ============================================================
--  verificacoes — histórico de health-checks (cada consulta)
-- ============================================================
create table verificacoes (
  id                 bigserial       primary key,
  servico_id         uuid            not null references servicos_apihorse(id) on delete cascade,
  status             status_servico  not null,
  http_code          smallint,
  tempo_resposta_ms  integer,
  mensagem           text,
  verificado_em      timestamptz     not null default now()
);
create index idx_verif_servico_data on verificacoes (servico_id, verificado_em desc);

-- ============================================================
--  incidentes — períodos em que o serviço ficou parado
-- ============================================================
create table incidentes (
  id           bigserial    primary key,
  clube_id     uuid         not null references clubes(id) on delete cascade,
  servico_id   uuid         not null references servicos_apihorse(id) on delete cascade,
  causa        varchar(200),
  inicio       timestamptz  not null,
  fim          timestamptz,
  duracao_seg  integer,
  resolvido    boolean      not null default false,
  criado_em    timestamptz  not null default now()
);
create index idx_incid_clube_data on incidentes (clube_id, inicio desc);

-- ============================================================
--  alertas — notificações enviadas ao responsável do clube
-- ============================================================
create table alertas (
  id            bigserial     primary key,
  incidente_id  bigint        not null references incidentes(id) on delete cascade,
  canal         varchar(20)   not null default 'email',
  destinatario  varchar(160)  not null,
  enviado_em    timestamptz   not null default now()
);

-- ============================================================
--  Visão consolidada para o painel (status atual por clube)
-- ============================================================
create view vw_status_clubes as
select c.id              as clube_id,
       c.nome,
       c.cidade,
       c.uf,
       s.versao,
       s.status_atual,
       s.verificado_em
from clubes c
join servicos_apihorse s on s.clube_id = c.id;

-- ============================================================
--  Dados de exemplo (seed)
-- ============================================================
insert into usuarios (id, nome, email, senha_hash, papel) values
  ('11111111-1111-1111-1111-111111111111', 'Guilherme S.', 'guilherme@realclub.com.br', '$2a$10$exemplo_de_hash_bcrypt', 'suporte');

insert into clubes (id, nome, cnpj, cidade, uf, responsavel_email, criado_por) values
  ('22222222-2222-2222-2222-222222222221', 'Clube Atlético Veranópolis', '12.345.678/0001-90', 'Veranópolis', 'RS', 'ti@cav.com.br', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', 'Clube de Campo Itanhangá',  '23.456.789/0001-01', 'Rio de Janeiro', 'RJ', 'ti@itanhanga.com.br', '11111111-1111-1111-1111-111111111111');

insert into servicos_apihorse (clube_id, url_health, versao, intervalo_min, status_atual, verificado_em) values
  ('22222222-2222-2222-2222-222222222221', 'https://api.cav.com.br/horse/health', 'v2.4.1', 5, 'ativo',  now()),
  ('22222222-2222-2222-2222-222222222222', 'https://api.itanhanga.com.br/horse/health', 'v2.3.8', 5, 'parado', now());

insert into incidentes (clube_id, servico_id, causa, inicio, fim, duracao_seg, resolvido)
select c.id, s.id, 'Timeout no endpoint /horse/health', now() - interval '2 hours', null, null, false
from clubes c
join servicos_apihorse s on s.clube_id = c.id
where c.id = '22222222-2222-2222-2222-222222222222';

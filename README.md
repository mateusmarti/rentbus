# RentBus
Esse é um teste do RentBus.
:oncoming_bus: RentBus — Marketplace de Fretamento de Ônibus e Vans

Sistema web para contratação e oferta de fretamento de transporte (ônibus e vans), conectando contratantes e empresas de transporte em uma plataforma de orçamento e gestão de viagens.

O projeto foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC), com foco em arquitetura moderna, logística de transporte e experiência do usuário.

---

:pushpin: Visão Geral

O RentBus funciona como um marketplace de fretamento onde:

- Contratantes criam solicitações de viagem
- Empresas analisam a rota e enviam orçamentos
- O contratante aceita um orçamento
- O pagamento é realizado
- A empresa aloca veículo e motorista
- A viagem é executada

Todo o fluxo é controlado por dashboards separados por nível de usuário.

---

:busts_in_silhouette: Tipos de Usuário

:bust_in_silhouette: Contratante

Pessoa física ou jurídica que deseja contratar transporte.

Pode:

- Criar solicitação de viagem
- Definir origem, destino e paradas
- Visualizar rotas no mapa
- Receber orçamentos
- Aceitar orçamento
- Realizar pagamento
- Cadastrar passageiros
- Acompanhar status da viagem

---

:office: Empresa de Transporte

Empresas que possuem frota e oferecem o serviço.

Pode:

- Visualizar solicitações
- Visualizar rotas completas
- Enviar orçamentos
- Gerenciar veículos
- Gerenciar motoristas
- Alocar veículo e motorista após pagamento
- Acompanhar viagens

---

:hammer_and_wrench: Administrador

Controle completo do sistema.

Pode:

- Gerenciar usuários
- Gerenciar empresas
- Gerenciar viagens
- Gerenciar pagamentos
- Validar pagamentos
- Alterar status de viagens
- Auditar todo o sistema

---

:compass: Fluxo de Funcionamento

:one: Solicitação de Viagem

Contratante informa:

- origem
- destino
- paradas
- data
- capacidade de passageiros

O sistema:

- geocodifica endereços
- exibe rota no mapa
- salva a viagem

---

:two: Orçamento

Empresas visualizam:

- mapa da rota
- distância
- paradas

E enviam proposta contendo:

- preço
- veículo

---

:three: Aceite

Contratante escolhe uma proposta.

---

:four: Pagamento

Sistema abre tela de pagamento (provisória).

Após pagamento:

- viagem muda para Pago
- passageiros podem ser cadastrados

---

:five: Preparação da Viagem

Empresa pode:

- alocar veículo
- alocar motorista

---

:six: Execução

Viagem ocorre.

---

:world_map: Integração com Mapas

O sistema utiliza:

- OpenStreetMap
- Leaflet
- OSRM Routing API

Para:

- geocodificação de endereço
- visualização de mapa
- traçar rota real da estrada
- incluir paradas no trajeto
- calcular caminho completo

Também existe opção de:

:heavy_check_mark: abrir rota no Google Maps

---

:hammer_and_wrench: Tecnologias Utilizadas

Frontend

- Vue 3
- Vite
- TypeScript
- Bootstrap
- Leaflet
- FontAwesome

---

Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

---

APIs Externas

API| Uso
ViaCEP| Autocomplete de endereço
Nominatim| Geocodificação
OpenStreetMap| Mapas
OSRM| Cálculo de rota
Google Maps| Abertura de rota externa

---

:open_file_folder: Estrutura do Projeto

rentbus/
│
├── backend/
│
│   ├── src/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   │
│   ├── server.js
│
│
├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── views/
│   ├── services/
│   ├── utils/
│   │
│   ├── main.ts
│
│
└── README.md

---

:gear: Instalação

:one: Clonar repositório

git clone https://github.com/seuusuario/rentbus.git

---

:two: Instalar backend

cd backend
npm install

Criar arquivo ".env":

PORT=3000
MONGO_URI=sua_connection_string
JWT_SECRET=rentbus_secret

Rodar servidor:

npm run dev

---

:three: Instalar frontend

cd frontend
npm install
npm run dev

---

:crown: Criar usuário administrador

Via script:

node scripts/createAdmin.js

ou via terminal:

curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
"name":"Administrador",
"email":"admin@rentbus.com.br",
"password":"admin123",
"role":"admin"
}'

---

:bar_chart: Status de Viagem

Status| Significado
requested| Solicitação criada
quoted| Recebeu orçamento
accepted| Orçamento aceito
paid| Pagamento realizado
preparing| Preparando viagem
in_progress| Em andamento
completed| Finalizada
cancelled| Cancelada

---

:credit_card: Sistema de Pagamento

Atualmente:

- formulário de pagamento simulado

Futuro:

- Stripe
- Mercado Pago
- PagSeguro

---

:iphone: Responsividade

Sistema adaptado para:

- desktop
- tablet
- celular

Com:

- sidebar responsiva
- hamburger menu
- tabelas adaptáveis

---

:lock: Segurança

Implementado:

- JWT Authentication
- Validação de dados
- Controle de acesso por nível de usuário

Planejado:

- criptografia de documentos
- logs de auditoria
- antifraude

---

:rocket: Melhorias Futuras

Planejado para próximas versões:

- pagamentos reais
- rastreamento GPS
- previsão do tempo
- cálculo automático de preço
- disponibilidade de frota
- sistema de avaliações
- notificações em tempo real
- aplicativo mobile

---

:mortar_board: Objetivo Acadêmico

O projeto foi desenvolvido com objetivo de:

- aplicar arquitetura Full Stack moderna
- resolver problemas reais de logística
- integrar APIs externas
- construir um sistema escalável

---

:mortar_board: Contexto do Projeto

O RentBus surgiu no contexto acadêmico como parte de um trabalho de conclusão de curso, mas foi concebido desde o início com foco em aplicação real de mercado.

A proposta do sistema é resolver uma necessidade prática no setor de fretamento, conectando contratantes e empresas de transporte em uma plataforma moderna, com potencial de evolução para uso comercial, escalabilidade e futuras integrações financeiras e operacionais.

---

:rocket: Potencial de Negócio

O projeto está em desenvolvimento contínuo e possui potencial para expansão em áreas como:

- marketplace de fretamento sob demanda
- gestão de rotas e logística
- administração de frota
- intermediação de pagamentos
- conformidade documental de passageiros
- integração com empresas de transporte urbano, executivo e turístico

O RentBus pode evoluir para uma solução real de mercado, aberta a melhorias, parcerias e oportunidades de investimento.

---

:handshake: Parcerias e Investimento

O projeto está aberto a:

- feedback técnico
- colaborações
- parcerias estratégicas
- oportunidades de investimento
- desenvolvimento comercial futuro

Caso haja interesse no projeto, arquitetura, evolução do produto ou potencial de negócio, contatos e conexões serão bem-vindos.

---

:male-technologist: Autor

Mateus Martins

GitHub:

https://github.com/mateusmarti

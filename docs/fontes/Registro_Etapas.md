# Registro das Etapas de Implementação

Log interno usado como base para o documento final (`Documentacao_Melhorias.pdf`).

## Opção 1 – Peças usadas no serviço

### Etapa 1.1 – Banco de dados (20/11/2026) – concluída
- Migração `backend/migrations/001_pecas_servico.sql` aplicada no banco `inovatec`.
- `tb_item.preco_custo DECIMAL(18,2) NULL` + CHECK >= 0.
- Nova tabela `tb_servico_item` (serviço x peça, quantidade, custo_unitario congelado),
  FK serviço ON DELETE CASCADE, FK peça ON DELETE RESTRICT, UNIQUE (serviço, peça).
- Documentado em `docs/Documentacao_Alteracoes_Banco_de_Dados.pdf` (v1.0).

### Etapa 1.2 – Preço de custo das peças (20/11/2026) – concluída
Backend:
- `backend/item.js`: POST/PUT aceitam `preco_custo` (aceita vírgula ou ponto; vazio = sem preço;
  negativo/inválido = HTTP 400). PUT sem o campo mantém o preço atual.
- `backend/item.js`: corrigido PUT `/item/:id`, que não enviava resposta (agora 204).
- `backend/item.js`: DELETE de peça já usada em serviço retorna HTTP 409 com mensagem clara.
- `backend/database_itens.js`: INSERT/UPDATE com `preco_custo`.
Frontend:
- `ItemModal.jsx`: campo "Preço de custo (R$) - opcional".
- `ItemAction.jsx`: exibição e edição do preço de custo.
- `Item.jsx`: coluna "Preço de custo" formatada em R$.
- `utils/formatters.js`: função `formatBRL` (reutilizada nas próximas etapas).
- `useItemStore.js` / `useEntityActions.js`: mensagens de erro do servidor passam a ser exibidas
  (antes o cadastro mostrava "sucesso" mesmo quando falhava).
- Ajuste pedido na validação: removido o "ID do Registro" das telas de detalhes
  (`ItemAction.jsx`, `EstoqueAction.jsx`, `ServicoAction.jsx`) — informação interna, sem utilidade para o técnico.
Benefício: o técnico registra quanto pagou em cada peça — base para calcular o lucro real dos serviços.

### Etapa 1.3 – Backend das peças no serviço (20/11/2026) – concluída
- Novo `backend/database_servico_item.js`: regras de estoque em transação (FOR UPDATE):
  adicionar peça (soma se já existe; custo congelado no 1º registro), alterar quantidade (ajusta pela
  diferença), remover (devolve), devolver todas (ao excluir serviço). Estoque disponível = soma dos
  registros da peça; baixa do mais antigo; devolução cria registro se não existir.
- Novo `backend/servico_item.js`: rotas GET/POST `/servico/:id/pecas`, PUT/DELETE `/servico/:id/pecas/:idItem`.
- `backend/servico.js` + `database_servico.js`: POST `/servico` aceita `pecas: [{id_item, quantidade}]`
  (tudo ou nada) e retorna `{ id_registro_servico }`; DELETE devolve peças ao estoque.
- `backend/server.js`: registro das novas rotas.
- Erros: 409 estoque insuficiente (mensagem com disponível/necessário), 400 quantidade inválida, 404 inexistente.
- 14 cenários testados contra o banco real; dados de teste removidos.
- Doc. do banco v1.1: nova seção 5 (regras de movimentação de estoque).
Benefício: o estoque passa a refletir sozinho o que foi usado nos consertos; impossível "usar" peça que não tem.

### Etapa 1.4 – Tela de peças no serviço (20/11/2026) – concluída
- Novo componente `pages/Servico/PecasServico.jsx` (+ `.module.css`): seção "Peças usadas" com lista
  (nome, custo unitário, subtotal, botões −/+, remover), seletor só com peças que têm estoque
  ("— disp. N"), aviso quando a quantidade excede o disponível e "Custo total das peças".
- `ServicoModal.jsx` (cadastro): peças escolhidas ficam numa lista local e são enviadas junto com o
  serviço (uma única transação no backend). Mensagem do servidor exibida em caso de erro.
- `ServicoAction.jsx` (detalhes via "⋯"): cada ação grava na hora (adicionar/alterar/remover) e recarrega
  lista e estoque. Valor exibido em R$.
- Novo `services/servicoPecasService.js`: chamadas às rotas de peças, com mensagens de erro do backend.
- Corrigido: `TableActions.jsx` não tinha o caso de Serviços ("Conteúdo não mapeado") — detalhes do
  serviço nunca abriam.
- Corrigido: título "Editando: undefined" no serviço (usava nome_item).
- Corrigido: editar serviço/item sem alterar a data falhava no MySQL (data ISO com "T...Z");
  data agora é normalizada para AAAA-MM-DD ao abrir a edição (`ServicoAction.jsx`, `ItemAction.jsx`).
- Stores: `addServico` devolve o id e repassa erros; `fetchItems`/`fetchEstoque` aceitam `{ silent: true }`
  (atualizam sem piscar "Carregando..."); excluir serviço atualiza também o estoque.
Benefício: o técnico registra as peças no momento em que lança o serviço, vendo o custo na hora.

### Etapa 1.5 – Lucro por serviço (20/11/2026) – concluída
- `backend/database_servico.js`: `list()` devolve `custo_pecas` e `lucro` (LEFT JOIN + SUM sobre
  quantidade × custo_unitario congelado); busca por contratante/tipo mantida.
- `Servico.jsx`: colunas em ordem fixa (Contratante, Data, Tipo, Valor cobrado, Custo peças, Lucro),
  valores em R$, lucro verde (positivo) / vermelho (prejuízo); ordenação por data, valor, custo e lucro.
- `Table.jsx`: ordenação numérica genérica por campo (permite ordenar por lucro/custo).
- `PecasServico.jsx`: linha "Lucro do serviço (valor cobrado − peças)" — no cadastro é calculada ao
  vivo conforme o valor e as peças; nos detalhes, reflete as alterações de peças.
- `ServicoAction.jsx`: após cada ação de peça, a tabela de serviços é atualizada (custo/lucro).
- Testado no banco: lucro positivo, prejuízo (lucro negativo) e serviço sem peças.
- Doc. do banco v1.2: seção 6 descreve o cálculo usado pela rota.
Benefício: o técnico enxerga quanto realmente ganhou em cada serviço e identifica serviços com prejuízo.
**Opção 1 concluída.**

## Opção 2 – Contas a receber

### Etapa 2.1 – Banco de dados (20/11/2026) – concluída
- Migração `backend/migrations/002_contas_receber.sql` aplicada no banco `inovatec`.
- `tb_registro_servico.status VARCHAR(10) NOT NULL DEFAULT 'Pendente'` (CHECK: 'Pago'/'Pendente').
- `tb_registro_servico.data_pagamento DATE NULL`; CHECK `chk_servico_pagamento`: Pago ⇔ tem data.
- Serviço existente ("a") ficou como Pendente. Restrições testadas em transação desfeita (2 aceitas, 3 bloqueadas).
- Doc. do banco v1.3: DER atualizado, nova seção 7, script 002 e rollback.

### Etapa 2.2 – Backend do pagamento (20/11/2026) – concluída
- Novo `backend/pagamento.js`: validações (status Pago/Pendente sem diferenciar maiúsculas, data
  AAAA-MM-DD real, pagamento não futuro e não anterior à data do serviço; Pago sem data = hoje).
- `backend/servico.js`: POST aceita `status`/`data_pagamento` (padrão Pendente); nova rota
  PUT `/servico/:id/pagamento` (marcar pago / desfazer) responde com o que foi gravado;
  PUT `/servico/:id` não mexe no status, valida a data, 404 se não existe e bloqueia data do serviço
  posterior ao pagamento. Data do serviço passa a ser validada (aceita também o formato ISO do banco).
- `backend/database_servico.js`: INSERT com status/data_pagamento; `getPagamento()`; `registrarPagamento()`.
- 18 cenários testados no banco; dados de teste removidos. Doc. do banco v1.4 (regras na seção 7).

### Etapa 2.3 – Tela de Serviços (20/11/2026) – concluída
- `Servico.jsx`: colunas "Status" (etiqueta verde "Pago" / laranja "Pendente · N dias") e "Pago em";
  filtro "Todos os status / Pendentes / Pagos" na barra da tabela.
- Novo `StatusBadge.jsx` (etiqueta reutilizada na tabela e nos detalhes).
- `ServicoAction.jsx`: bloco "Pagamento" com status, data do recebimento, botão "Marcar como pago"
  (data padrão hoje; limitada entre a data do serviço e hoje) e "Desfazer pagamento" (com confirmação).
- `ServicoModal.jsx`: opção "Já recebido em [data]" no cadastro (serviço já nasce como Pago).
- `Table.jsx`: prop opcional `statusOptions` (filtro por status; outras telas não mudam).
- Novos `services/api.js` (requisição com mensagem de erro do backend, reaproveitada) e
  `services/pagamentoService.js`; `utils/formatters.js` ganhou funções de data (hoje, dd/mm/aaaa, dias desde).
Benefício: o técnico vê de relance quais serviços ainda não foram pagos e há quanto tempo.

### Etapa 2.4 – Home (20/11/2026) – concluída
- Novo `components/RecebimentosWidget/` (jsx + css): cards "A receber" (total + nº de serviços
  pendentes) e "Recebido no mês" (total pago no mês atual + nº de serviços), e lista
  "Quem está devendo" (por academia: total, nº de serviços, dias do pendente mais antigo; top 5,
  do mais antigo para o mais recente; "Ver serviços").
- Novo `utils/recebimentos.js`: cálculo do resumo (agrupa a mesma academia mesmo com
  maiúsculas/espaços diferentes). Testado com 6 serviços fictícios (pendentes, pago no mês, pago no mês anterior).
- `Home.jsx`: nova seção entre "Desempenho" e as listas; serviços sempre recarregados ao abrir a Home.
Benefício: ao abrir o sistema, o técnico sabe quanto tem para receber, quanto já entrou no mês e quem cobrar primeiro.
**Opção 2 concluída.**

## Opção 5 – Recibo/Orçamento
Plano revisado a pedido do usuário: os dados do prestador não ficam fixos no código; o técnico os
cadastra numa tela própria, todos opcionais, e pode escolher não exibi-los. Etapas: 5.1 Dados do
prestador (nova) · 5.2 Layout do documento · 5.3 Botão para gerar PDF · 5.4 Documento final.

### Etapa 5.1 – Dados do prestador (20/11/2026) – concluída
- Migração `backend/migrations/003_prestador.sql`: tabela `tb_prestador` (linha única, id = 1):
  nome, documento (CPF/CNPJ só dígitos, CHECK 11 ou 14), telefone, email, cidade, chave_pix,
  exibir_nos_documentos (padrão 1), atualizado_em. Separada de `tb_usuario` (credenciais de login).
  Restrições testadas em transação desfeita.
- Backend: `database_prestador.js` (get com padrão vazio; save com INSERT ... ON DUPLICATE KEY UPDATE)
  e `prestador.js` (GET/PUT `/prestador`; vazio = nulo; CPF/CNPJ com ou sem máscara; valida e-mail
  e tamanhos). 8 cenários testados; tabela deixada vazia.
- Frontend: item "Meus dados" no menu (`/meus-dados`); página `pages/Prestador/Prestador.jsx` com
  formulário (todos opcionais), opção "Mostrar meus dados nos recibos e orçamentos", "Limpar campos",
  e prévia ao vivo "Como vai aparecer"; componente reutilizável `DadosPrestador.jsx` (usado no recibo);
  `utils/prestador.js`, `services/prestadorService.js`, `formatDocumento` em `utils/formatters.js`.
- Doc. do banco v1.5: seção 8, DER, script 003 e rollback.
Benefício: o técnico controla o que aparece nos documentos enviados às academias, sem depender de programador.

### Etapa 5.2 – Layout do recibo/orçamento (20/11/2026) – concluída
- Backend: nova rota GET `/servico/:id` (mesmos campos da listagem; 404/400), consulta compartilhada
  em `database_servico.js` (`getById`).
- Nova página `pages/DocumentoServico/` em `/documento/servico/:id`, fora do layout do sistema (sem
  menu), aberta em outra aba. Folha A4: cabeçalho com dados do prestador (se cadastrados e "mostrar"
  ligado) + título automático **RECIBO** (pago) / **ORÇAMENTO** (pendente), nº 000018, data de emissão;
  cliente; serviço (descrição, data, valor); peças utilizadas só com nome/modelo e quantidade
  (custo NÃO aparece — é informação interna); total com valor por extenso.
  Recibo: declaração de recebimento + local/data por extenso + linha de assinatura.
  Orçamento: situação pendente + chave PIX (se houver).
- Novo `utils/extenso.js`: valor por extenso (22 casos testados, até milhões) e data por extenso.
- `formatTelefone` (11932395655 -> (11) 93239-5655) usado no bloco do prestador.
- `ServicoAction.jsx`: botão "Ver recibo"/"Ver orçamento" (abre em nova aba).
- Conferido visualmente com servidores temporários (portas 3334/4174) e dados TESTE_5_2, removidos depois.
Benefício: o técnico entrega à academia um documento com aparência profissional, sem montar nada à mão.

### Etapa 5.3 – Imprimir / Salvar PDF (20/11/2026) – concluída
- `DocumentoServico.jsx`: barra de ações (só na tela) com "Imprimir / Salvar PDF" (`window.print()`),
  "Fechar" e instrução "escolha Salvar como PDF no destino". O título da aba
  ("Recibo 000018 - Academia X") vira o nome sugerido do arquivo PDF.
- `DocumentoServico.module.css`: regras de impressão — A4 com margens de 15 mm; some barra, fundo
  cinza e sombra; libera o `overflow: hidden` global (senão documentos longos seriam cortados);
  mantém cores das tabelas; não quebra linhas de tabela, o total nem o bloco declaração + assinatura.
- `Table.jsx`: prop opcional `extraActions` (ícones extras na coluna "Ações");
  `Servico.jsx`: ícone de documento em cada linha abre recibo/orçamento em nova aba.
- Testado gerando PDF pelo Edge: documento curto (1 página) e longo com 30 peças (3 páginas, cabeçalho
  da tabela repetido, declaração e assinatura juntas). Dados TESTE_5_3 e servidores temporários removidos.
Benefício: em dois cliques o técnico tem um PDF pronto para mandar no WhatsApp ou imprimir.
- Correção pós-validação: o documento abria em branco no servidor de desenvolvimento (Vite) —
  "No routes matched location /documento/servico/21". O código em disco estava correto, mas o
  observador de arquivos do Vite no Windows perdeu a última de três edições rápidas no `App.jsx`
  (a rota), servindo uma versão antiga. Resolvido forçando a releitura do arquivo; conferido gerando
  o PDF pelo próprio servidor de desenvolvimento (serviço 21). Se algo assim voltar a acontecer,
  reiniciar o `npm run dev` resolve.

### Etapa 5.4 – Documentação final (20/11/2026) – concluída
A pedido do usuário, além do documento geral, foram criados documentos separados de frontend e backend
para compartilhar com o grupo. Todos no mesmo padrão visual do PDF do banco (estilo em `fontes/estilo-docs.css`):
- `docs/Documentacao_Melhorias.pdf` – visão geral: público-alvo e problema, tabela das melhorias e benefícios,
  seção por funcionalidade (problema / o que foi feito / como usar / benefício), fluxo de trabalho do técnico,
  correções, banco e como executar, pontos de atenção, etapas e documentos.
- `docs/Documentacao_Frontend.pdf` – pastas, rotas, telas, componentes (props), serviços de API, stores,
  utilitários, fluxos, impressão/PDF, convenções e lista completa de arquivos.
- `docs/Documentacao_Backend.pdf` – arquivos, registro no servidor, migrações, padrão de erros, referência da
  API com exemplos JSON, transações de estoque, regras de pagamento, prestador, testes e pontos de atenção.
**Opção 5 concluída. Todas as etapas planejadas (1.1–1.5, 2.1–2.4, 5.1–5.4) concluídas.**

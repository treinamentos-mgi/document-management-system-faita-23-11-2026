# Especificação - Document Management System

## 1. Objetivo

Entregar uma aplicação web simples para usuários enviarem, listarem e baixarem documentos armazenados localmente, com metadados mantidos em memória durante a execução do backend.

## 2. Escopo

### Dentro do escopo

- Upload de documentos.
- Listagem dos documentos enviados.
- Download de documentos pelo identificador.
- Identificação simples do usuário proprietário dos documentos.
- Interface web em React para upload, listagem e download.
- Armazenamento dos arquivos no filesystem local da aplicação.

### Fora do escopo

- Autenticação e autorização avançadas.
- Persistência permanente dos metadados em banco de dados.
- Armazenamento externo ou em nuvem.
- Versionamento de documentos.
- Exclusão ou edição de documentos.
- Compartilhamento, busca avançada e auditoria.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O usuário pode selecionar e enviar um documento por formulário multipart. |
| RF-02 | O sistema deve rejeitar uma requisição de upload que não contenha arquivo. |
| RF-03 | O sistema deve gravar o arquivo enviado no diretório `backend/storage`. |
| RF-04 | O sistema deve criar metadados do documento após um upload bem-sucedido. |
| RF-05 | O usuário pode listar os documentos enviados. |
| RF-06 | O usuário pode baixar um documento existente pelo identificador. |
| RF-07 | O sistema deve informar erro quando um documento não existir. |
| RF-08 | O sistema deve associar o documento ao identificador do usuário dono. |
| RF-09 | O frontend deve permitir enviar, listar e baixar documentos pela API. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados localmente com `multer` e `diskStorage`. |
| RNF-02 | Os metadados devem ser mantidos em memória nesta fase inicial. |
| RNF-03 | A configuração do backend deve usar variáveis de ambiente, incluindo `PORT`. |
| RNF-04 | O backend deve seguir a Clean Architecture simples: routes, controllers, services e repositories. |
| RNF-05 | O backend deve usar Node.js, Express e CommonJS. |
| RNF-06 | O frontend deve usar React, Vite e ESM. |
| RNF-07 | O frontend deve consumir o backend por `fetch` através do prefixo `/api`. |
| RNF-08 | As operações locais devem manter nomes de arquivos únicos no filesystem. |

## 5. Modelo de dados

Os metadados dos documentos são armazenados em memória nesta fase.

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | Sim | Identificador único do documento. |
| `originalName` | string | Sim | Nome original enviado pelo usuário. |
| `storedName` | string | Sim | Nome único usado internamente no filesystem. |
| `size` | number | Sim | Tamanho do arquivo em bytes. |
| `uploadedAt` | string | Sim | Data e hora do upload em formato ISO 8601. |
| `owner` | string | Sim | Identificador do usuário dono do documento. |

A API pública deve retornar `id`, `originalName`, `size`, `uploadedAt` e `owner`. O campo `storedName` deve permanecer interno ao backend.

## 6. Contratos de API

### POST /upload

- Entrada: `multipart/form-data`, com o campo `file`.
- Respostas:
  - `201 Created`: metadados públicos do documento criado.
  - `400 Bad Request`: quando o campo `file` não estiver presente.
  - `500 Internal Server Error`: quando houver falha no armazenamento.

Exemplo de resposta de sucesso:

```json
{
  "id": "uuid-do-documento",
  "originalName": "proposta.pdf",
  "size": 102400,
  "uploadedAt": "2026-11-23T12:00:00.000Z",
  "owner": "local-user"
}
```

### GET /documents

- Entrada: nenhuma.
- Respostas:
  - `200 OK`: lista de metadados públicos dos documentos.
  - `200 OK`: lista vazia `[]` quando não houver documentos.
  - `500 Internal Server Error`: quando houver falha na consulta.

### GET /documents/:id/download

- Entrada: identificador do documento na URL.
- Respostas:
  - `200 OK`: conteúdo binário do arquivo com nome original.
  - `404 Not Found`: quando o documento ou o arquivo correspondente não existir.
  - `500 Internal Server Error`: quando houver falha no download.

Durante o desenvolvimento, o frontend usa `/api/upload`, `/api/documents` e `/api/documents/:id/download`. O proxy do Vite remove o prefixo `/api` antes de encaminhar as requisições ao backend.

## 7. Decisões arquiteturais

- Backend organizado em quatro camadas:
  - `routes`: definição dos endpoints e configuração do multer.
  - `controllers`: entrada HTTP, validação básica e respostas.
  - `services`: regras de negócio e criação dos metadados.
  - `repositories`: persistência em memória e localização dos arquivos locais.
- Dependência permitida: `routes -> controllers -> services -> repositories`.
- Arquivos armazenados exclusivamente em `backend/storage`.
- Metadados mantidos em uma coleção em memória no processo backend.
- Frontend organizado em componentes funcionais e um serviço de API.
- Arquitetura local simples, sem integrações externas de armazenamento.

## 8. Plano de execução

1. **Criar a estrutura backend**
   - Criar `routes/documents.routes.js`, `controllers/documents.controller.js`, `services/documents.service.js` e `repositories/documents.repository.js`.
   - Registrar o roteador em `backend/src/app.js`.
   - Critério de aceite: o backend inicializa e as camadas estão separadas conforme o fluxo previsto.

2. **Implementar upload local**
   - Configurar `multer.diskStorage` apontando para `backend/storage`.
   - Gerar nome interno único e metadados em memória.
   - Implementar `POST /upload` com validação de arquivo ausente.
   - Critério de aceite: o arquivo é salvo em disco e o endpoint retorna metadados com status `201`.

3. **Implementar listagem**
   - Implementar `GET /documents` no serviço e no repository.
   - Retornar uma lista vazia quando não houver metadados.
   - Critério de aceite: a API lista somente metadados públicos e retorna `[]` no estado vazio.

4. **Implementar download**
   - Implementar `GET /documents/:id/download`.
   - Resolver o arquivo pelo metadado armazenado.
   - Retornar `404` quando o documento ou o arquivo não existir.
   - Critério de aceite: o download entrega o conteúdo com o nome original do arquivo.

5. **Criar componentes frontend**
   - Criar `UploadComponent`, `DocumentList` e `DownloadButton`.
   - Criar o cliente de API em `frontend/src/services` usando `/api`.
   - Atualizar `App.jsx` para montar o fluxo completo.
   - Critério de aceite: o usuário consegue enviar, listar e baixar documentos pela interface.

6. **Validar o sistema**
   - Executar os testes backend com `npm test`.
   - Executar a compilação frontend com `npm run build`.
   - Validar upload, listagem e download em execução local.
   - Critério de aceite: os três fluxos funcionam sem erros de integração.

## 9. Riscos e mitigação

- Os metadados são perdidos ao reiniciar o backend: esta perda é esperada nesta fase e deverá ser tratada por persistência futura.
- Um arquivo armazenado pode ficar sem metadados: o download deve validar a existência da entrada em memória e no filesystem.
- A remoção manual de arquivos pode gerar inconsistência: o download deve retornar `404` quando o arquivo não existir.
- Nomes originais podem conter caracteres especiais: o nome armazenado internamente deve ser gerado separadamente e com UUID.

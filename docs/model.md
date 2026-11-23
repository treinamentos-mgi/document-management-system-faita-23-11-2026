# Modelo de dados do DMS

## Visão geral

Nesta fase, o DMS possui uma entidade principal: `Documento`. Os metadados são mantidos em memória em um `Map` no repository do backend. O conteúdo binário é armazenado no filesystem local, no diretório `backend/storage`.

Não há banco de dados externo, nuvem ou relações persistidas entre tabelas.

## Entidade: Documento

### Metadados internos

| Campo | Tipo | Obrigatório | Origem | Uso |
| --- | --- | --- | --- | --- |
| `id` | string | Sim | Gerado pelo backend com `crypto.randomUUID()` | Identificador único usado em listagem e download. |
| `originalName` | string | Sim | `file.originalname` do Multer | Nome original exibido e usado no download. |
| `storedName` | string | Sim | `file.filename` gerado pelo Multer | Nome interno do arquivo em `backend/storage`. |
| `size` | number | Sim | `file.size` do Multer | Tamanho do arquivo em bytes. |
| `uploadedAt` | string | Sim | Gerado pelo backend em ISO 8601 | Data e hora do upload. |
| `owner` | string | Sim | Campo opcional `req.body.owner` ou padrão `local-user` | Identificador simples do usuário proprietário. |

### Metadados públicos da API

Os seguintes campos são expostos pelas operações de upload e listagem:

| Campo | Tipo |
| --- | --- |
| `id` | string |
| `originalName` | string |
| `size` | number |
| `uploadedAt` | string |
| `owner` | string |

O campo interno `storedName` não é retornado pela API.

## Armazenamento físico

| Elemento | Local | Responsável |
| --- | --- | --- |
| Conteúdo do documento | Arquivo em `backend/storage` | Multer com `diskStorage` |
| Nome interno do arquivo | Campo `storedName` | Repository e service |
| Metadados do documento | `Map` em memória no repository | Documents repository |

Ao reiniciar o processo backend, os metadados em memória são perdidos. Os arquivos podem permanecer em `backend/storage`, mas deixam de ter referência por meio da entidade `Documento` até que exista uma nova carga ou persistência.

## Estrutura em memória

```text
Documento
├── id
├── originalName
├── storedName
├── size
├── uploadedAt
└── owner
```

Os documentos são associados ao identificador `id` dentro do `Map` do repository. Não existe entidade adicional para usuário ou arquivo nesta fase.

## Relações

- Um `Documento` pertence a um `owner`, representado por uma string, sem entidade persistida de usuário.
- Um `Documento` referencia um arquivo local por meio de `storedName`.
- A API não expõe `storedName`, mas usa o campo para localizar o arquivo durante o download.

## Contratos com frontend

O frontend recebe ou envia os seguintes dados:

| Operação | Dados envolvidos |
| --- | --- |
| Upload | Campo multipart `file`; resposta com metadados públicos. |
| Listagem | Lista de objetos com metadados públicos. |
| Download | `id` do documento na URL e nome original sugerido pelo servidor. |

O frontend não possui um modelo próprio separado dos metadados públicos retornados pelo backend.

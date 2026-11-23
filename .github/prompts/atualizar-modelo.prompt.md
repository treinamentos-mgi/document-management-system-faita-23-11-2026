---
description: Mantém atualizado o modelo de dados em docs/model.md.
name: atualizar-modelo
agent: agent
---

# Atualizar modelo de dados

Analise o codebase atual do Document Management System e mantenha o documento `docs/model.md` sincronizado com o modelo de dados efetivamente utilizado pela aplicação.

Consulte primeiro:

- `docs/specs/dms-spec.md`, quando existir.
- `backend/src/repositories`.
- `backend/src/services`.
- `backend/src/controllers`.
- `backend/src/routes`.
- `frontend/src/services` e `frontend/src/components`, quando houver campos retornados pela API.

Requisitos:

- Crie `docs/model.md` caso ele ainda não exista.
- Atualize somente `docs/model.md`; não altere código-fonte, testes ou outros documentos.
- Documente as entidades, campos, tipos, obrigatoriedade e relações.
- Inclua os metadados públicos e os campos internos usados pelo backend.
- Identifique claramente os dados armazenados em memória nesta fase.
- Informe quais dados correspondem aos arquivos mantidos no filesystem local.
- Preserve as restrições do projeto: sem banco de dados externo e sem armazenamento em nuvem.
- Remova do documento campos obsoletos ou campos que já não existam na implementação.
- Não invente entidades, campos ou relações que não estejam presentes no código ou na especificação.
- Use nomes de campos exatamente como aparecem no código.
- Escreva o documento em português e mantenha tabelas Markdown fáceis de consultar.
- Ao terminar, informe resumidamente o que foi criado ou alterado em `docs/model.md`.

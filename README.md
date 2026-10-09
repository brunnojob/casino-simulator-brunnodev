# NOVA Play

Aplicativo de entretenimento com regras distintas para roletas, dados e slots, amostragem aleatória sem viés modular e histórico exportável.

## Executar

Requisitos: JavaScript ESM.

```sh
node --test tests/*.test.mjs
python -m http.server 8080
```

## Funcionamento

As rodadas usam somente créditos virtuais. Resultados podem ser recalculados a partir dos sorteios registrados. O histórico local exporta JSON para o arquivo de operações. O projeto não oferece pagamentos, saques nem prêmios financeiros.

## Persistência de resultados

O arquivo de operações está em [vercel-home-telemetry-api.vercel.app](https://vercel-home-telemetry-api.vercel.app/laboratory.html?project=casino-simulator-brunnodev). As migrações Supabase estão no [repositório da API](https://github.com/brunnojob/vercel-home-telemetry-api/tree/main/supabase/migrations).

```sh
python cloud/sync.py enqueue resultado.json --project casino-simulator-brunnodev
python cloud/sync.py sync
```

Defina `BRUNNODEV_ACCESS_TOKEN` com sua sessão. A fila SQLite conserva os relatórios até confirmação do servidor; o mesmo conteúdo não gera registros duplicados. Tokens não são gravados no código.

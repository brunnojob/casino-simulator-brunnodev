# NOVA Play

An entertainment application with separate roulette, dice, and slot rules, random sampling without modulo bias, and exportable history.

## Run

Requirements: JavaScript ESM.

```sh
node --test tests/*.test.mjs
python -m http.server 8080
```

## Behavior

Rounds use virtual credits only. Results can be recomputed from recorded draws. Local history exports JSON for the operations archive. The project does not offer payments, withdrawals, or financial prizes.

## Result synchronization

The [operations archive](https://vercel-home-telemetry-api.vercel.app/laboratory.html?project=casino-simulator-brunnodev) stores execution results. Supabase migrations are in the [API repository](https://github.com/brunnojob/vercel-home-telemetry-api/tree/main/supabase/migrations).

```sh
python cloud/sync.py enqueue result.json --project casino-simulator-brunnodev
python cloud/sync.py sync
```

Set `BRUNNODEV_ACCESS_TOKEN` to your session token. The SQLite outbox retains reports until the server confirms persistence; identical content does not create duplicate records. Tokens are not stored in source code. To run the synchronization tests:

```sh
python -m unittest discover -s cloud
```

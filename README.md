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

## Optional report archive

Export a JSON report, then run `python cloud/sync.py enqueue result.json --project casino-simulator-brunnodev` and `python cloud/sync.py sync`. Synchronization requires `BRUNNODEV_ACCESS_TOKEN` and the external operations API; the local outbox retains unacknowledged reports.

## License

Original source and documentation are MIT licensed; see [LICENSE](LICENSE). Third-party dependencies and media retain their respective terms. Maintained by [Brunno Dev](https://brunnodev.store).

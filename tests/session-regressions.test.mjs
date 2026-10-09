import test from "node:test";
import assert from "node:assert/strict";
import { GameSession, settle } from "../engine.mjs";

test("invalid rounds do not consume randomness or mutate balances", () => {
  let calls = 0;
  const session = new GameSession(100, () => { calls++; return 0; });
  for (const [game, stake] of [["slots", NaN], ["other", 10], ["slots", 0]])
    assert.throws(() => session.play(game, stake));
  assert.equal(calls, 0);
  assert.equal(session.balance, 100);
  assert.throws(() => settle("slots", 1, null), /invalid_draws/);
});

test("returned rounds cannot rewrite the stored history", () => {
  const session = new GameSession(100, () => 0);
  const round = session.play("slots", 10);
  round.balance = 0;
  round.draws[0] = 5;
  const stored = session.export().rounds[0];
  assert.equal(stored.balance, 290);
  assert.deepEqual(stored.draws, [0, 0, 0]);
});

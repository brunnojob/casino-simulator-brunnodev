import { test } from "node:test";
import assert from "node:assert/strict";
import { GameSession, secureInteger, settle } from "../engine.mjs";

test("roulette zero loses and even pockets pay exactly twice the stake", () => {
  assert.equal(settle("roulette", 50, [0]).net, -50);
  assert.equal(settle("roulette", 50, [2]).net, 50);
});
test("all slot combinations have defined integer payouts", () => {
  let sum = 0;
  for (let a = 0; a < 6; a++)
    for (let b = 0; b < 6; b++)
      for (let c = 0; c < 6; c++) sum += settle("slots", 1, [a, b, c]).payout;
  assert.equal(sum, 300);
});
test("rejection sampling discards biased random values", () => {
  let call = 0;
  assert.equal(
    secureInteger(37, {
      getRandomValues: (array) => {
        array[0] = call++ === 0 ? 4294967295 : 36;
      },
    }),
    36,
  );
  assert.equal(call, 2);
});
test("insufficient balance never creates a round", () => {
  const session = new GameSession(20, () => 0);
  assert.throws(() => session.play("slots", 21));
  assert.equal(session.rounds.length, 0);
  assert.equal(session.play("slots", 10).balance, 210);
});

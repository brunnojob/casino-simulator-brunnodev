export function secureInteger(maximum, cryptoProvider = globalThis.crypto) {
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > 65536)
    throw new Error("invalid_random_bound");
  const cutoff = Math.floor(4294967296 / maximum) * maximum;
  const buffer = new Uint32Array(1);
  do {
    cryptoProvider.getRandomValues(buffer);
  } while (buffer[0] >= cutoff);
  return buffer[0] % maximum;
}

export function settle(game, stake, draws) {
  if (!Array.isArray(draws)) throw new Error("invalid_draws");
  if (!Number.isSafeInteger(stake) || stake < 1 || stake > 1000000)
    throw new Error("invalid_stake");
  let multiplier;
  if (game === "slots") {
    if (
      draws.length !== 3 ||
      draws.some((value) => !Number.isInteger(value) || value < 0 || value > 5)
    )
      throw new Error("invalid_reels");
    multiplier = draws.every((value) => value === draws[0])
      ? 20
      : new Set(draws).size === 2
        ? 2
        : 0;
  } else if (game === "roulette") {
    if (
      draws.length !== 1 ||
      !Number.isInteger(draws[0]) ||
      draws[0] < 0 ||
      draws[0] > 36
    )
      throw new Error("invalid_pocket");
    multiplier = draws[0] > 0 && draws[0] % 2 === 0 ? 2 : 0;
  } else if (game === "dice") {
    if (
      draws.length !== 2 ||
      draws.some((value) => !Number.isInteger(value) || value < 1 || value > 6)
    )
      throw new Error("invalid_dice");
    const total = draws[0] + draws[1];
    multiplier = total === 7 || total === 11 ? 4 : 0;
  } else throw new Error("unknown_game");
  return {
    game,
    stake,
    draws: [...draws],
    payout: stake * multiplier,
    net: stake * (multiplier - 1),
  };
}

export class GameSession {
  constructor(balance = 10000, random = secureInteger) {
    if (!Number.isSafeInteger(balance) || balance < 0 || balance > 100000000)
      throw new Error("invalid_balance");
    this.balance = balance;
    this.random = random;
    this.rounds = [];
  }
  play(game, stake) {
    if (!["slots", "roulette", "dice"].includes(game)) throw new Error("unknown_game");
    if (!Number.isSafeInteger(stake) || stake < 1 || stake > 1000000)
      throw new Error("invalid_stake");
    if (stake > this.balance || this.rounds.length >= 10000)
      throw new Error("session_limit");
    const draws =
      game === "slots"
        ? [this.random(6), this.random(6), this.random(6)]
        : game === "roulette"
          ? [this.random(37)]
          : [this.random(6) + 1, this.random(6) + 1];
    const result = settle(game, stake, draws);
    const balance = this.balance + result.net;
    if (!Number.isSafeInteger(balance) || balance > 100000000)
      throw new Error("balance_limit");
    this.balance = balance;
    const round = {
      sequence: this.rounds.length + 1,
      at: new Date().toISOString(),
      ...result,
      balance,
    };
    this.rounds.push(round);
    return { ...round, draws: [...round.draws] };
  }
  export() {
    return {
      currency: "virtual_credits",
      balance: this.balance,
      rounds: this.rounds.map((row) => ({ ...row, draws: [...row.draws] })),
    };
  }
}

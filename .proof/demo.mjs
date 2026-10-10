import assert from 'node:assert/strict';
import {GameSession,settle} from '../engine.mjs';
const session=new GameSession(20,()=>0);
const result=session.play('slots',10);
assert.equal(session.balance,210);
assert.throws(()=>session.play('slots',211));
assert.equal(settle('roulette',50,[0]).net,-50);
assert.equal(settle('roulette',50,[2]).net,50);
console.log(JSON.stringify({virtual_credit_only:true,round:result,balance:session.balance,overdraft_rejected:true}));

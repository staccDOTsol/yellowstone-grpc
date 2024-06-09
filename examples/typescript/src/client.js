"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const yellowstone_grpc_1 = __importStar(require("@triton-one/yellowstone-grpc"));
const web3_js_1 = require("@solana/web3.js");
// Define or import these variables
const B = 9; // Example value, replace with actual value
const L = 6; // Example value, replace with actual value
const R = 1000; // Example value, replace with actual value
const P = 1000; // Example value, replace with actual value
const O = 1000; // Example value, replace with actual value
const q = 1000; // Example value, replace with actual value
const Y = 1000; // Example value, replace with actual value
// Assuming these are imported from other modules
const M = new web3_js_1.PublicKey("Czbmb7osZxLaX5vGHuXMS2mkdtZEXyTNKwsAUUpLGhkG"); // Admin PublicKey
const D = new web3_js_1.PublicKey("7JQsiDDqQ8urfhBNx16DEMexS8mxVpjr5dbvMcbYUwnL"); // PublicKey for mint account
const some_module_1 = require("some-module"); // Replace 'some-module' with actual module name
// Define or import these variables
const B = 9; // Example value, replace with actual value
const L = 6; // Example value, replace with actual value
const R = 1000; // Example value, replace with actual value
const P = 1000; // Example value, replace with actual value
const O = 1000; // Example value, replace with actual value
const q = 1000; // Example value, replace with actual value
const Y = 1000; // Example value, replace with actual value
const M = new web3_js_1.PublicKey("Czbmb7osZxLaX5vGHuXMS2mkdtZEXyTNKwsAUUpLGhkG"); // Admin PublicKey
const D = new web3_js_1.PublicKey("7JQsiDDqQ8urfhBNx16DEMexS8mxVpjr5dbvMcbYUwnL"); // PublicKey for mint account
// Define or import these functions
function n(id) {
    // Implement the function or import it from the correct module
}
function h(value) {
    // Implement the function or import it from the correct module
}
function nZ(n, t) {
    // Implement the function or import it from the correct module
}
var e5 = n(81276), e8 = n(35719), e7 = e5.MAINNET_PROGRAM_ID, e9 = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), te = e5.TxVersion.LEGACY, tt = e5.LOOKUP_TABLE_CACHE;
n(35719);
var tn = n(81276), tr = n(35719), ti = h(n(44431)), to = n(35719);
async function fromBoundPoolId({ client: t, poolAccountAddressId: n }) {
    let r = await some_module_1.e.fetch2(t.connection, n);
    return new some_module_1.e(n, t, r.memeReserve.vault, r.quoteReserve.vault, r.memeReserve.mint, r.quoteReserve.mint, new some_module_1.J.Token(ee.TOKEN_PROGRAM_ID, r.memeReserve.mint, B));
}
async function fromPoolCreationTransaction({ client: t, poolCreationSignature: n }) {
    let r = await nZ(n, t);
    if (console.debug("parsedData: ", r), !r)
        throw Error(`No such pool found for such signature ${n}`);
    let i = r.find(e => "new_pool" === e.type);
    if (!i)
        throw Error(`No such pool found in instruction data for signature ${n}`);
    let o = await some_module_1.e.fetch2(t.connection, i.poolAddr);
    return new some_module_1.e(i.poolAddr, t, o.memeReserve.vault, o.quoteReserve.vault, o.memeReserve.mint, o.quoteReserve.mint, new some_module_1.J.Token(ee.TOKEN_PROGRAM_ID, o.memeReserve.mint, B));
}
function findSignerPda(e, t) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("signer"), e.toBytes()], t)[0];
}
function findBoundPoolPda(e, t, n) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("bound_pool"), e.toBytes(), t.toBytes()], n)[0];
}
function findStakingPda(e, t) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("staking_pool"), e.toBytes()], t)[0];
}
function findMemeTicketPda(e, t) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("admin_ticket"), e.toBytes()], t)[0];
}
async function swapY(t) {
    let n = t.user, r = t.payer, i = t.memeTicketNumber, o = t.pool ?? this.id, a = some_module_1.e.findSignerPda(o, this.client.memechanProgram.programId), s = t.quoteAmountIn, u = t.memeTokensOut, c = some_module_1.e4.getMemeTicketPDA({
        ticketNumber: i,
        poolId: o,
        userId: n.publicKey
    }), l = t.userSolAcc ?? (await (0,
        ee.getOrCreateAssociatedTokenAccount)(this.client.connection, r, t.quoteMint, n.publicKey, !0, "confirmed", {
        skipPreflight: !0
    })).address;
    return console.log("solIn: ", s),
        console.log("memeOut: ", u),
        await this.client.memechanProgram.methods.swapY(new some_module_1.eY.BN(s), new some_module_1.eY.BN(u), new some_module_1.eY.BN(i)).accounts({
            memeTicket: c,
            owner: n.publicKey,
            pool: o,
            poolSignerPda: a,
            quoteVault: this.quoteVault,
            userSol: l,
            systemProgram: et.SystemProgram.programId,
            tokenProgram: ee.TOKEN_PROGRAM_ID
        }).signers([n]).rpc({
            skipPreflight: !0,
            commitment: "confirmed",
            preflightCommitment: "confirmed"
        }),
        new some_module_1.e4(c, this.client);
}
async function buyMeme(e) {
    let { tx: t } = await this.getBuyMemeTransaction(e), n = (0, some_module_1.tJ)({
        connection: this.client.connection,
        transaction: t,
        signers: [e.signer]
    });
    return await n();
}
async function getBuyMemeTransaction(e) {
    let { inputAmount: t, minOutputAmount: n, slippagePercentage: r, user: i, transaction: o = new et.Transaction, memeTicketNumber: a } = e, { inputTokenAccount: s } = e, u = this.id, c = this.findSignerPda(), l = new some_module_1.eY.BN(a), d = some_module_1.e4.getMemeTicketPDA({
        ticketNumber: a,
        poolId: u,
        userId: i
    }), f = this.client.connection, h = (0, some_module_1.n1)(t, L), p = new some_module_1.eY.BN(h.toString()), m = (0, some_module_1.n1)((0, some_module_1.n$)(new en.default(n), r).toString(), B), g = new some_module_1.eY.BN(m.toString());
    if (!s) {
        let e = (0,
            ee.getAssociatedTokenAddressSync)(this.quoteTokenMint, i, !0, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
        if (!(s = (await (0,
            ee.getAccount)(f, e)).address)) {
            let t = (0,
                ee.createAssociatedTokenAccountInstruction)(i, e, i, this.quoteTokenMint, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
            o.add(t),
                s = e;
        }
    }
    let y = await this.client.memechanProgram.methods.swapY(p, g, l).accounts({
        owner: i,
        pool: u,
        poolSignerPda: c,
        quoteVault: this.quoteVault,
        userSol: s,
        systemProgram: et.SystemProgram.programId,
        tokenProgram: ee.TOKEN_PROGRAM_ID,
        memeTicket: d
    }).instruction(), b = et.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: R
    });
    return o.add(b),
        o.add(y),
        {
            tx: o,
            memeTicketPublicKey: d,
            inputTokenAccount: s
        };
}
async function getBuyMemeTransaction(e) {
    let { inputAmount: t, minOutputAmount: n, slippagePercentage: r, user: i, transaction: o = new et.Transaction, boundPoolId: a, poolSignerPda: s, quoteVault: u, client: c, memeTicketNumber: l } = e, { inputTokenAccount: d } = e, f = a, h = new some_module_1.eY.BN(l), p = some_module_1.e4.getMemeTicketPDA({
        ticketNumber: l,
        poolId: f,
        userId: i
    }), m = (0, some_module_1.n1)(t, L), g = new some_module_1.eY.BN(m.toString()), y = (0, some_module_1.n1)((0, some_module_1.n$)(new en.default(n), r).toString(), B), b = new some_module_1.eY.BN(y.toString());
    if (!d) {
        let e = (0,
            ee.getAssociatedTokenAddressSync)(D, i, !0, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
        if (!(d = (await (0,
            ee.getAccount)(c.connection, e)).address)) {
            let t = (0,
                ee.createAssociatedTokenAccountInstruction)(i, e, i, D, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
            o.add(t),
                d = e;
        }
    }
    let v = await c.memechanProgram.methods.swapY(g, b, h).accounts({
        memeTicket: p,
        owner: i,
        pool: f,
        poolSignerPda: s,
        quoteVault: u,
        userSol: d,
        systemProgram: et.SystemProgram.programId,
        tokenProgram: ee.TOKEN_PROGRAM_ID
    }).instruction();
    return o.add(v),
        {
            tx: o,
            memeTicketPublicKey: p,
            inputTokenAccount: d
        };
}
async function getOutputAmountForBuyMeme(e) {
    let { inputAmount: t, slippagePercentage: n, transaction: r = new et.Transaction } = e, i = this.id, o = (0, some_module_1.n1)(t, L), a = new some_module_1.eY.BN(o.toString()), s = new some_module_1.eY.BN(0), u = await this.client.memechanProgram.methods.getSwapYAmt(a, s).accounts({
        pool: i,
        quoteVault: this.quoteVault
    }).instruction();
    r.add(u);
    let c = await this.client.connection.simulateTransaction(r, [this.client.simulationKeypair], !0);
    if (c.value.err)
        throw console.debug("[getOutputAmountForBuyMeme] error on simulation ", JSON.stringify(c.value)),
            Error("Simulation results for getOutputAmountForBuyMeme returned error");
    let { swapOutAmount: l } = (0, some_module_1.nX)(c);
    return (0, some_module_1.n$)(new en.default(l).div(10 ** B), n).toString();
}
async function sellMeme(e) {
    let { txs: t } = await this.getSellMemeTransaction(e), n = [];
    for (let r of t) {
        let t = await this.client.connection.getLatestBlockhash("confirmed");
        r.recentBlockhash = t.blockhash,
            r.lastValidBlockHeight = t.lastValidBlockHeight;
        let i = await (0,
            et.sendAndConfirmTransaction)(this.client.connection, r, [e.signer], {
            commitment: "confirmed",
            skipPreflight: !0,
            preflightCommitment: "confirmed"
        });
        n.push(i),
            console.log("tx signature:", i);
    }
    return n;
}
async function getSellMemeTransaction(e) {
    let t;
    let { inputAmount: n, minOutputAmount: r, slippagePercentage: i, user: o, transaction: a = new et.Transaction } = e, { outputTokenAccount: s } = e, u = this.id, c = this.findSignerPda(), l = this.client.connection, { availableAmountWithDecimals: d, tickets: f } = await some_module_1.e4.fetchAvailableTicketsByUser2(u, this.client, o);
    if (new en.default(n).isGreaterThan(new en.default(d)))
        throw Error(`Provided inputTicketAmount is larger than available ticket amount for sell. Available ticket amount: ${d}`);
    let h = (0, some_module_1.n1)(n, B), p = new some_module_1.eY.BN(h.toString()), m = new en.default(h.toString()), g = (0, some_module_1.n1)((0, some_module_1.n$)(new en.default(r), i).toString(), L), y = new some_module_1.eY.BN(g.toString());
    if (!s) {
        let e = (0,
            ee.getAssociatedTokenAddressSync)(this.quoteTokenMint, o, !0, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
        if (!(s = (await (0,
            ee.getAccount)(l, e)).address)) {
            let t = (0,
                ee.createAssociatedTokenAccountInstruction)(o, e, o, this.quoteTokenMint, ee.TOKEN_PROGRAM_ID, ee.ASSOCIATED_TOKEN_PROGRAM_ID);
            a.add(t),
                s = e;
        }
    }
    let { ticketsRequiredToSell: b, isMoreThanOneTicket: v } = await some_module_1.e4.getRequiredTicketsToSell({
        amount: m,
        availableTickets: f
    });
    if (v) {
        let [e, ...n] = b;
        t = e;
        let r = new some_module_1.e4(e.id, this.client), i = await r.getBoundMergeTransaction({
            pool: u,
            ticketsToMerge: n,
            user: o
        });
        a.add(...i.instructions);
    }
    else
        t = b[0];
    let _ = await this.client.memechanProgram.methods.swapX(new some_module_1.eY.BN(p), new some_module_1.eY.BN(y)).accounts({
        memeTicket: t.id,
        owner: o,
        pool: u,
        poolSigner: c,
        quoteVault: this.quoteVault,
        userSol: s,
        tokenProgram: ee.TOKEN_PROGRAM_ID
    }).instruction();
    a.add(_);
    let w = e3(a.instructions, e.user);
    return {
        txs: w,
        isMoreThanOneTransaction: w.length > 1
    };
}
async function getOutputAmountForSellMeme(e) {
    let { inputAmount: t, slippagePercentage: n, transaction: r = new et.Transaction } = e, i = this.id, o = (0, some_module_1.n1)(t, B), a = new some_module_1.eY.BN(o.toString()), s = new some_module_1.eY.BN(0), u = await this.client.memechanProgram.methods.getSwapXAmt(a, s).accounts({
        pool: i,
        quoteVault: this.quoteVault
    }).instruction();
    r.add(u);
    let c = await this.client.connection.simulateTransaction(r, [this.client.simulationKeypair], !0);
    if (c.value.err)
        throw console.debug("[getOutputAmountForBuyMeme] error on simulation ", JSON.stringify(c.value)),
            Error("Simulation results for getOutputAmountForBuyMeme returned error");
    let { swapOutAmount: l } = (0, some_module_1.nX)(c);
    return (0, some_module_1.n$)(new en.default(l).div(10 ** L), n).toString();
}
async function isMemeCoinReadyToLivePhase() {
    return (await some_module_1.e.fetch2(this.client.connection, this.id)).locked;
}
async function swapX(e) {
    let t = await this.getSellMemeTransactionLegacy(e);
    return await (0,
        et.sendAndConfirmTransaction)(this.client.connection, t, [e.user], {
        skipPreflight: !0,
        commitment: "confirmed",
        preflightCommitment: "confirmed"
    });
}
async function getSellMemeTransactionLegacy(e) {
    let t = e.transaction ?? new et.Transaction, n = e.user, r = this.id, i = this.findSignerPda(), o = e.memeAmountIn, a = e.minQuoteAmountOut, s = e.userMemeTicket, u = e.userQuoteAcc, c = await this.client.memechanProgram.methods.swapX(new some_module_1.eY.BN(o), new some_module_1.eY.BN(a)).accounts({
        memeTicket: s.id,
        owner: n.publicKey,
        pool: r,
        poolSigner: i,
        quoteVault: this.quoteVault,
        userSol: u,
        tokenProgram: ee.TOKEN_PROGRAM_ID
    }).instruction();
    return t.add(c),
        t;
}
async function getInitStakingPoolTransaction(t) {
    let { user: n, payer: r, pool: i = this.id, boundPoolInfo: o } = t, a = t.transaction ?? new et.Transaction, s = some_module_1.e.findStakingPda(o.memeReserve.mint, this.client.memechanProgram.programId), u = some_module_1.t1.findSignerPda(s, this.client.memechanProgram.programId), c = some_module_1.e.findMemeTicketPda(s, this.client.memechanProgram.programId), l = await (0, some_module_1.tX)({
        connection: this.client.connection,
        payer: r.publicKey,
        mint: o.quoteReserve.mint,
        owner: u,
        transaction: a
    }), d = await (0, some_module_1.tX)({
        connection: this.client.connection,
        payer: r.publicKey,
        mint: o.memeReserve.mint,
        owner: u,
        transaction: a
    }), f = {
        pool: i,
        signer: n,
        boundPoolSignerPda: this.findSignerPda(),
        memeTicket: c,
        poolMemeVault: o.memeReserve.vault,
        poolQuoteVault: o.quoteReserve.vault,
        stakingMemeVault: d,
        stakingQuoteVault: l,
        quoteMint: this.quoteTokenMint,
        staking: s,
        stakingPoolSignerPda: u,
        feeVaultQuote: o.feeVaultQuote,
        marketProgramId: e7.OPENBOOK_MARKET,
        systemProgram: et.SystemProgram.programId,
        tokenProgram: ee.TOKEN_PROGRAM_ID,
        clock: et.SYSVAR_CLOCK_PUBKEY,
        rent: et.SYSVAR_RENT_PUBKEY,
        memeMint: o.memeReserve.mint,
        ataProgram: e9,
        user: n
    }, h = await this.client.memechanProgram.methods.initStakingPool().accounts(f).instruction();
    return a.add(h),
        {
            transaction: a,
            stakingMemeVault: d,
            stakingQuoteVault: l
        };
}
async function initStakingPool(e) {
    let { transaction: t, stakingMemeVault: n, stakingQuoteVault: r } = await this.getInitStakingPoolTransaction({
        ...e,
        user: e.user.publicKey
    }), i = (0, some_module_1.tJ)({
        connection: this.client.connection,
        transaction: t,
        signers: [e.user]
    });
    return await (0, some_module_1.t0)({
        fn: i,
        functionName: "initStakingPool"
    }),
        {
            stakingMemeVault: n,
            stakingQuoteVault: r
        };
}
async function getGoLiveTransaction(t) {
    return await some_module_1.e.getGoLiveTransaction({
        ...t,
        client: this.client,
        memeMint: t.boundPoolInfo.memeReserve.mint,
        transaction: new et.Transaction,
        payer: t.user
    });
}
async function getGoLiveTransaction(t) {
    let { client: n, memeMint: r, user: i, feeDestinationWalletAddress: o, memeVault: a, quoteVault: s, transaction: u = new et.Transaction } = t, c = some_module_1.e.findStakingPda(r, n.memechanProgram.programId), l = some_module_1.t1.findSignerPda(c, n.memechanProgram.programId), d = new some_module_1.J.Token(ee.TOKEN_PROGRAM_ID, r, B), f = some_module_1.z, { marketId: h, transactions: p } = await (0, some_module_1.tW)({
        baseToken: d,
        quoteToken: f,
        marketIdSeed: c,
        wallet: i.publicKey,
        signer: i,
        connection: n.connection
    });
    console.log("stakingId: ", c.toBase58()),
        console.log("createMarketTransaction marketId 0: ", h),
        u.add(et.SystemProgram.transfer({
            fromPubkey: i.publicKey,
            toPubkey: l,
            lamports: P + O
        })),
        console.log("setComputeUnitLimit");
    let m = et.ComputeBudgetProgram.setComputeUnitLimit({
        units: 25e4
    });
    u.add(m),
        console.log("setComputeUnitPrice");
    let g = et.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100 * R
    });
    u.add(g);
    let y = new web3_js_1.PublicKey(o);
    console.log("feeDestination: ", y.toBase58());
    let b = some_module_1.e.getAssociatedId({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("ammId: ", b.toBase58());
    let v = some_module_1.e.getAssociatedAuthority({
        programId: e7.AmmV4
    });
    console.log("raydiumAmmAuthority: ", v.publicKey.toBase58());
    let _ = some_module_1.e.getAssociatedOpenOrders({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("openOrders: ", _.toBase58());
    let w = some_module_1.e.getAssociatedTargetOrders({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("targetOrders: ", w.toBase58());
    let A = some_module_1.e.getAssociatedConfigId({
        programId: e7.AmmV4
    });
    console.log("ammConfig: ", A.toBase58());
    let S = some_module_1.e.getAssociatedLpMint({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("raydiumLpMint: ", S.toBase58());
    let T = some_module_1.e.getAssociatedBaseVault({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("raydiumMemeVault: ", T.toBase58());
    let I = some_module_1.e.getAssociatedQuoteVault({
        programId: e7.AmmV4,
        marketId: h
    });
    console.log("raydiumWsolVault: ", I.toBase58());
    let E = some_module_1.e.getATAAddress(l, S, ee.TOKEN_PROGRAM_ID).publicKey;
    console.log("userDestinationLpTokenAta. : " + E.toBase58());
    let k = await n.memechanProgram.methods.goLive(v.nonce).accounts({
        signer: i.publicKey,
        poolMemeVault: a,
        poolQuoteVault: s,
        quoteMint: D,
        staking: c,
        stakingPoolSignerPda: l,
        raydiumLpMint: S,
        raydiumAmm: b,
        raydiumAmmAuthority: v.publicKey,
        raydiumMemeVault: T,
        raydiumQuoteVault: I,
        marketProgramId: e7.OPENBOOK_MARKET,
        systemProgram: et.SystemProgram.programId,
        tokenProgram: ee.TOKEN_PROGRAM_ID,
        marketAccount: h,
        clock: et.SYSVAR_CLOCK_PUBKEY,
        rent: et.SYSVAR_RENT_PUBKEY,
        openOrders: _,
        targetOrders: w,
        memeMint: r,
        ammConfig: A,
        ataProgram: e9,
        feeDestinationInfo: y,
        userDestinationLpTokenAta: E,
        raydiumProgram: e7.AmmV4
    }).instruction();
    return console.log("goLiveInstruction: ", k),
        u.add(k),
        {
            createMarketTransactions: p,
            goLiveTransaction: u,
            stakingId: c,
            ammId: b,
            marketId: h
        };
}
async function goLive(t) {
    return await some_module_1.e.goLive({
        ...t,
        client: this.client,
        memeMint: this.memeTokenMint
    });
}
async function goLive(t) {
    return await (0, some_module_1.t0)({
        fn: () => some_module_1.e.goLiveInternal(t),
        functionName: "goLivefunction",
        retries: 3
    });
}
async function goLiveInternal(t) {
    let n = t.client, { createMarketTransactions: r, goLiveTransaction: i, stakingId: o, ammId: a, marketId: s } = await some_module_1.e.getGoLiveTransaction(t);
    let u = await n.connection.getAccountInfo(s, {
        commitment: "confirmed",
        dataSlice: {
            length: 0,
            offset: 0
        }
    });
    if (console.log("marketAccount: ", u), !u) {
        console.log("no market account exists yet, creating sending create market transactions");
        let e = await (0, some_module_1.td)(n.connection, t.user, r, {
            skipPreflight: !0,
            preflightCommitment: "confirmed"
        });
        console.log("create market signatures:", JSON.stringify(e));
        let { blockhash: i, lastValidBlockHeight: o } = await n.connection.getLatestBlockhash("confirmed"), a = await n.connection.confirmTransaction({
            signature: e[2],
            blockhash: i,
            lastValidBlockHeight: o
        }, "confirmed");
        if (a.value.err)
            throw console.error("createMarketTxResult:", a),
                Error("createMarketTxResult failed");
    }
    console.log("send go live transaction");
    let c = await (0,
        et.sendAndConfirmTransaction)(n.connection, i, [t.user], {
        skipPreflight: !0,
        preflightCommitment: "confirmed",
        commitment: "confirmed"
    });
    console.log("go live signature:", c);
    let { blockhash: l, lastValidBlockHeight: d } = await n.connection.getLatestBlockhash("confirmed"), f = await n.connection.confirmTransaction({
        signature: c,
        blockhash: l,
        lastValidBlockHeight: d
    }, "confirmed");
    if (f.value.err)
        throw console.error("goLiveTxResult:", f),
            Error("goLiveTxResult failed");
    return [await some_module_1.t1.fromStakingPoolId({
            client: n,
            poolAccountAddressId: o
        }), await t9.fromAmmId(a, n)];
}
async function fetchRelatedTickets() {
    return some_module_1.e4.fetchRelatedTickets(this.id, this.client);
}
async function getHoldersCount() {
    return some_module_1.e.getHoldersCount(this.id, this.client);
}
async function getHoldersMap() {
    return some_module_1.e.getHoldersMap(this.id, this.client);
}
async function getHoldersList() {
    return some_module_1.e.getHoldersList(this.id, this.client);
}
async function getHoldersCount(t, n) {
    return (await some_module_1.e.getHoldersList(t, n)).length;
}
async function getHoldersMap(e, t) {
    let n = await some_module_1.e4.fetchRelatedTickets(e, t), r = new Map;
    n.forEach(e => {
        let t = e.owner.toBase58();
        r.has(t) || r.set(t, []),
            r.get(t)?.push(e);
    });
    let i = await some_module_1.ex.fetch(t.connection, e);
    if (i && !r.has(M)) {
        let t = {
            amount: i.adminFeesMeme,
            owner: new web3_js_1.PublicKey(M),
            pool: e
        };
        r.set(M, [t]);
    }
    return r;
}
async function getHoldersList(t, n) {
    return Array.from((await some_module_1.e.getHoldersMap(t, n)).keys());
}
async function getMemePrice({ boundPoolInfo: e, quotePriceInUsd: t }) {
    let n = new en.default(e.memeReserve.tokens.toString()), r = new en.default(e.quoteReserve.tokens.toString()).div(10 ** L), i = new en.default(q).minus(n).div(10 ** B);
    if (i.eq(0)) {
        let e = new en.default(329053e-10), n = e.multipliedBy(t).toString();
        return {
            priceInQuote: e.toString(),
            priceInUsd: n
        };
    }
    let o = r.div(i), a = o.multipliedBy(t).toString();
    return {
        priceInQuote: o.toString(),
        priceInUsd: a
    };
}
async function getInitialMemePrice({ boundPoolInfo: e, quotePriceInUsd: t }) {
    let n = new en.default(329053e-10), r = n.multipliedBy(t).toString();
    return {
        priceInQuote: n.toString(),
        priceInUsd: r
    };
}
function getMemeMarketCap({ memePriceInUsd: e }) {
    return new en.default(Y).multipliedBy(e).toString();
}
function getATAAddress(e, t, n) {
    return web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), n.toBuffer(), t.toBuffer()], new web3_js_1.PublicKey(e9));
}
function getAssociatedId({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("amm_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedAuthority({ programId: e }) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from([97, 109, 109, 32, 97, 117, 116, 104, 111, 114, 105, 116, 121])], e);
}
function getAssociatedBaseVault({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("coin_vault_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedQuoteVault({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("pc_vault_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedLpMint({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("lp_mint_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedLpVault({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("temp_lp_token_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedTargetOrders({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("target_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedWithdrawQueue({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("withdraw_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedOpenOrders({ programId: e, marketId: t }) {
    let [publicKey, n] = web3_js_1.PublicKey.findProgramAddressSync([e.toBuffer(), t.toBuffer(), Buffer.from("open_order_associated_seed", "utf-8")], e);
    return n;
}
function getAssociatedConfigId({ programId: e }) {
    let [publicKey, t] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("amm_config_account_seed", "utf-8")], e);
    return t;
}
async function airdrop(e, t, n = 5e9) {
    await e.confirmTransaction(await e.requestAirdrop(t, n), "confirmed");
}
async function main() {
    const args = parseCommandLineArgs();
    // Open connection.
    const client = new yellowstone_grpc_1.default(args.endpoint, args.xToken, {
        "grpc.max_receive_message_length": 64 * 1024 * 1024, // 64MiB
    });
    const commitment = parseCommitmentLevel(args.commitment);
    // Execute a requested command
    switch (args["_"][0]) {
        case "ping":
            console.log("response: " + (await client.ping(1)));
            break;
        case "get-version":
            console.log("response: " + (await client.getVersion()));
            break;
        case "get-slot":
            console.log("response: " + (await client.getSlot(commitment)));
            break;
        case "get-block-height":
            console.log("response: " + (await client.getBlockHeight(commitment)));
            break;
        case "get-latest-blockhash":
            console.log("response: ", await client.getLatestBlockhash(commitment));
            break;
        case "is-blockhash-valid":
            console.log("response: ", await client.isBlockhashValid(args.blockhash));
            break;
        case "subscribe":
            await subscribeCommand(client, args);
            break;
        default:
            console.error(`Unknown command: ${args["_"]}. Use "--help" for a list of supported commands.`);
            break;
    }
}
function parseCommitmentLevel(commitment) {
    if (!commitment) {
        return;
    }
    const typedCommitment = commitment.toUpperCase();
    return yellowstone_grpc_1.CommitmentLevel[typedCommitment];
}
async function subscribeCommand(client, args) {
    // Subscribe for events
    const stream = await client.subscribe();
    // Create `error` / `end` handler
    const streamClosed = new Promise((resolve, reject) => {
        stream.on("error", (error) => {
            reject(error);
            stream.end();
        });
        stream.on("end", () => {
            resolve();
        });
        stream.on("close", () => {
            resolve();
        });
    });
    // Handle updates
    stream.on("data", (data) => {
        if (data.transaction != undefined) {
            const preTokenBalances = data.transaction.transaction.meta.preTokenBalances;
            const postTokenBalances = data.transaction.transaction.meta.postTokenBalances;
            const logs = data.transaction.transaction.meta.logMessages;
            const filteredLogs = logs.filter(log => log.includes("Program log: Instruction: NewPool"));
            if (filteredLogs.length > 0) {
                console.log("Filtered Logs: ", filteredLogs);
            }
        }
    });
    // Create subscribe request based on provided arguments.
    const request = {
        accounts: {},
        slots: {},
        transactions: {},
        entry: {},
        blocks: {},
        blocksMeta: {},
        accountsDataSlice: [],
        ping: undefined,
    };
    if (args.accounts) {
        const filters = [];
        if (args.accounts.memcmp) {
            for (let filter in args.accounts.memcmp) {
                const filterSpec = filter.split(",", 1);
                if (filterSpec.length != 2) {
                    throw new Error("invalid memcmp");
                }
                const [offset, data] = filterSpec;
                filters.push({
                    memcmp: { offset, base58: data.trim() },
                });
            }
        }
        if (args.accounts.tokenaccountstate) {
            filters.push({
                tokenAccountState: args.accounts.tokenaccountstate,
            });
        }
        if (args.accounts.datasize) {
            filters.push({ datasize: args.accounts.datasize });
        }
        request.accounts.client = {
            account: args.accountsAccount,
            owner: args.accountsOwner,
            filters,
        };
    }
    if (args.slots) {
        request.slots.client = {
            filterByCommitment: args.slotsFilterByCommitment,
        };
    }
    if (args.transactions) {
        request.transactions.client = {
            vote: args.transactionsVote,
            failed: args.transactionsFailed,
            signature: args.transactionsSignature,
            accountInclude: args.transactionsAccountInclude,
            accountExclude: args.transactionsAccountExclude,
            accountRequired: args.transactionsAccountRequired,
        };
    }
    if (args.entry) {
        request.entry.client = {};
    }
    if (args.blocks) {
        request.blocks.client = {
            accountInclude: args.blocksAccountInclude,
            includeTransactions: args.blocksIncludeTransactions,
            includeAccounts: args.blocksIncludeAccounts,
            includeEntries: args.blocksIncludeEntries,
        };
    }
    if (args.blocksMeta) {
        request.blocksMeta.client = {
            account_include: args.blocksAccountInclude,
        };
    }
    if (args.accounts.dataslice) {
        for (let filter in args.accounts.dataslice) {
            const filterSpec = filter.split(",", 1);
            if (filterSpec.length != 2) {
                throw new Error("invalid data slice");
            }
            const [offset, length] = filterSpec;
            request.accountsDataSlice.push({
                offset,
                length,
            });
        }
    }
    if (args.ping) {
        request.ping = { id: args.ping };
    }
    // Send subscribe request
    await new Promise((resolve, reject) => {
        stream.write(request, (err) => {
            if (err === null || err === undefined) {
                resolve();
            }
            else {
                reject(err);
            }
        });
    }).catch((reason) => {
        console.error(reason);
        throw reason;
    });
    await streamClosed;
}
function parseCommandLineArgs() {
    return (0, yargs_1.default)(process.argv.slice(2))
        .options({
        endpoint: {
            alias: "e",
            default: "http://localhost:10000",
            describe: "gRPC endpoint",
            type: "string",
        },
        "x-token": {
            describe: "token for auth, can be used only with ssl",
            type: "string",
        },
        commitment: {
            describe: "commitment level",
            choices: ["processed", "confirmed", "finalized"],
        },
    })
        .command("ping", "single ping of the RPC server")
        .command("get-version", "get the server version")
        .command("get-latest-blockhash", "get the latest block hash")
        .command("get-block-height", "get the current block height")
        .command("get-slot", "get the current slot")
        .command("is-blockhash-valid", "check the validity of a given block hash", (yargs) => {
        return yargs.options({
            blockhash: {
                type: "string",
                demandOption: true,
            },
        });
    })
        .command("subscribe", "subscribe to events", (yargs) => {
        return yargs.options({
            accounts: {
                default: false,
                describe: "subscribe on accounts updates",
                type: "boolean",
            },
            "accounts-account": {
                default: [],
                describe: "filter by account pubkey",
                type: "array",
            },
            "accounts-owner": {
                default: [],
                describe: "filter by owner pubkey",
                type: "array",
            },
            "accounts-memcmp": {
                default: [],
                describe: "filter by offset and data, format: `offset,data in base58`",
                type: "array",
            },
            "accounts-datasize": {
                default: 0,
                describe: "filter by data size",
                type: "number",
            },
            "accounts-tokenaccountstate": {
                default: false,
                describe: "filter valid token accounts",
                type: "boolean",
            },
            "accounts-dataslice": {
                default: [],
                describe: "receive only part of updated data account, format: `offset,size`",
                type: "string",
            },
            slots: {
                default: false,
                describe: "subscribe on slots updates",
                type: "boolean",
            },
            "slots-filter-by-commitment": {
                default: false,
                describe: "filter slot messages by commitment",
                type: "boolean",
            },
            transactions: {
                default: false,
                describe: "subscribe on transactions updates",
                type: "boolean",
            },
            "transactions-vote": {
                description: "filter vote transactions",
                type: "boolean",
            },
            "transactions-failed": {
                description: "filter failed transactions",
                type: "boolean",
            },
            "transactions-signature": {
                description: "filter by transaction signature",
                type: "string",
            },
            "transactions-account-include": {
                default: [],
                description: "filter included account in transactions",
                type: "array",
            },
            "transactions-account-exclude": {
                default: [],
                description: "filter excluded account in transactions",
                type: "array",
            },
            "transactions-account-required": {
                default: [],
                description: "filter required account in transactions",
                type: "array",
            },
            "transactions-status": {
                default: false,
                describe: "subscribe on transactionsStatus updates",
                type: "boolean",
            },
            "transactions-status-vote": {
                description: "filter vote transactions",
                type: "boolean",
            },
            "transactions-status-failed": {
                description: "filter failed transactions",
                type: "boolean",
            },
            "transactions-status-signature": {
                description: "filter by transaction signature",
                type: "string",
            },
            "transactions-status-account-include": {
                default: [],
                description: "filter included account in transactions",
                type: "array",
            },
            "transactions-status-account-exclude": {
                default: [],
                description: "filter excluded account in transactions",
                type: "array",
            },
            "transactions-status-account-required": {
                default: [],
                description: "filter required account in transactions",
                type: "array",
            },
            entry: {
                default: false,
                description: "subscribe on entry updates",
                type: "boolean",
            },
            blocks: {
                default: false,
                description: "subscribe on block updates",
                type: "boolean",
            },
            "blocks-account-include": {
                default: [],
                description: "filter included account in transactions",
                type: "array",
            },
            "blocks-include-transactions": {
                default: false,
                description: "include transactions to block messsage",
                type: "boolean",
            },
            "blocks-include-accounts": {
                default: false,
                description: "include accounts to block message",
                type: "boolean",
            },
            "blocks-include-entries": {
                default: false,
                description: "include entries to block message",
                type: "boolean",
            },
            "blocks-meta": {
                default: false,
                description: "subscribe on block meta updates (without transactions)",
                type: "boolean",
            },
            ping: {
                default: undefined,
                description: "send ping request in subscribe",
                type: "number",
            },
        });
    })
        .demandCommand(1)
        .help().argv;
}
main();

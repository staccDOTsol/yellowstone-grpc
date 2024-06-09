import { PublicKey, Transaction, SystemProgram, Keypair, Connection } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createInitializeMintInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";
import {  DataV2 } from "@metaplex-foundation/mpl-token-metadata";
import BN from "bn.js";
import * as fs from "fs";

import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  MEMO_PROGRAM_ID,
  Token,
} from "@raydium-io/raydium-sdk";
import * as ee from "@solana/spl-token";
import {
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as et from "@solana/web3.js";
import {
  TransactionMessage,
} from "@solana/web3.js";
import Client, {
  CommitmentLevel,
  SubscribeRequest,
  SubscribeRequestFilterAccountsFilter,
} from "@triton-one/yellowstone-grpc";

// Alias `en` to `BigNumber`
const en = BN;

let id = PublicKey.default;
const e9 = ASSOCIATED_TOKEN_PROGRAM_ID;
let quoteVault = PublicKey.default;
let quoteTokenMint = PublicKey.default;
const idl = {
  version: "0.1.0",
  name: "memechan_sol",
  instructions: [
    {
      name: "newPool",
      accounts: [
        {
          name: "sender",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "pool",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeMint",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "quoteMint",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "feeQuoteVault",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "memeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "targetConfig",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "poolSigner",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: "createMetadata",
      accounts: [
        {
          name: "sender",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "pool",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "memeMint",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeMplMetadata",
          isMut: !0,
          isSigner: !1,
          docs: ["To store metaplex metadata. Created in the function scope"],
        },
        {
          name: "poolSigner",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "metadataProgram",
          isMut: !1,
          isSigner: !1,
          docs: ["Program to create NFT metadata"],
        },
        {
          name: "rent",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
      ],
    },
    {
      name: "getSwapXAmt",
      accounts: [
        {
          name: "pool",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "coinInAmount",
          type: "u64",
        },
        {
          name: "coinYMinValue",
          type: "u64",
        },
      ],
    },
    {
      name: "swapX",
      accounts: [
        {
          name: "pool",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeTicket",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userSol",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "owner",
          isMut: !1,
          isSigner: !0,
        },
        {
          name: "poolSigner",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "coinInAmount",
          type: "u64",
        },
        {
          name: "coinYMinValue",
          type: "u64",
        },
      ],
    },
    {
      name: "getSwapYAmt",
      accounts: [
        {
          name: "pool",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "coinInAmount",
          type: "u64",
        },
        {
          name: "coinXMinValue",
          type: "u64",
        },
      ],
    },
    {
      name: "swapY",
      accounts: [
        {
          name: "pool",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userSol",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeTicket",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "owner",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "poolSignerPda",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "coinInAmount",
          type: "u64",
        },
        {
          name: "coinXMinValue",
          type: "u64",
        },
        {
          name: "ticketNumber",
          type: "u64",
        },
      ],
    },
    {
      name: "initStakingPool",
      accounts: [
        {
          name: "signer",
          isMut: !0,
          isSigner: !0,
          docs: ["Signer"],
        },
        {
          name: "pool",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool account"],
        },
        {
          name: "boundPoolSignerPda",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "poolMemeVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool Meme vault"],
        },
        {
          name: "poolQuoteVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool WSOL vault"],
        },
        {
          name: "feeVaultQuote",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool Admin Vault"],
        },
        {
          name: "memeMint",
          isMut: !1,
          isSigner: !1,
          docs: ["Mint Account for Meme"],
        },
        {
          name: "quoteMint",
          isMut: !1,
          isSigner: !1,
          docs: ["Mint Account for WSOL"],
        },
        {
          name: "staking",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Account"],
        },
        {
          name: "stakingPoolSignerPda",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Signer"],
        },
        {
          name: "stakingMemeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "stakingQuoteVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool WSOL vault"],
        },
        {
          name: "memeTicket",
          isMut: !0,
          isSigner: !1,
          docs: ["Meme Ticket Account of Admin"],
        },
        {
          name: "rent",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "clock",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "ataProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "marketProgramId",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: "newTargetConfig",
      accounts: [
        {
          name: "sender",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "targetConfig",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "mint",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "targetAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "changeTargetConfig",
      accounts: [
        {
          name: "sender",
          isMut: !1,
          isSigner: !0,
        },
        {
          name: "targetConfig",
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "targetAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "goLive",
      accounts: [
        {
          name: "signer",
          isMut: !0,
          isSigner: !0,
          docs: ["Signer"],
        },
        {
          name: "staking",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Account"],
        },
        {
          name: "stakingPoolSignerPda",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Signer"],
        },
        {
          name: "poolMemeVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Meme vault"],
        },
        {
          name: "poolQuoteVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Staking Pool Quote vault"],
        },
        {
          name: "memeMint",
          isMut: !1,
          isSigner: !1,
          docs: ["Mint Account for Meme"],
        },
        {
          name: "quoteMint",
          isMut: !1,
          isSigner: !1,
          docs: ["Mint Account for WSOL"],
        },
        {
          name: "openOrders",
          isMut: !0,
          isSigner: !1,
          docs: ["Open Orders Account"],
        },
        {
          name: "targetOrders",
          isMut: !0,
          isSigner: !1,
          docs: ["Target Orders Account"],
        },
        {
          name: "marketAccount",
          isMut: !0,
          isSigner: !1,
          docs: ["Market Orders Account"],
        },
        {
          name: "raydiumAmm",
          isMut: !0,
          isSigner: !1,
          docs: ["Raydium AMM Account"],
        },
        {
          name: "raydiumAmmAuthority",
          isMut: !0,
          isSigner: !1,
          docs: ["Raydium AMM Signer"],
        },
        {
          name: "raydiumLpMint",
          isMut: !0,
          isSigner: !1,
          docs: ["Raydium LP MinT"],
        },
        {
          name: "raydiumMemeVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Raydium LP Token Account", "Raydium Meme Token Account"],
        },
        {
          name: "raydiumQuoteVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Raydium WSOL Token Account"],
        },
        {
          name: "ammConfig",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "feeDestinationInfo",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userDestinationLpTokenAta",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "rent",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "clock",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "raydiumProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "ataProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "marketProgramId",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u8",
        },
      ],
    },
    {
      name: "addFees",
      accounts: [
        {
          name: "staking",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "stakingSignerPda",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "stakingLpWallet",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "signer",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "raydiumAmm",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "raydiumAmmAuthority",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "raydiumMemeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "raydiumQuoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "raydiumLpMint",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "openOrders",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "targetOrders",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketAccount",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketEventQueue",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketCoinVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketPcVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketVaultSigner",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "marketBids",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "marketAsks",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "raydiumProgram",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "marketProgramId",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: "unstake",
      accounts: [
        {
          name: "staking",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeTicket",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userMeme",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userQuote",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "signer",
          isMut: !1,
          isSigner: !0,
        },
        {
          name: "stakingSignerPda",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: "releaseAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawFees",
      accounts: [
        {
          name: "staking",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "memeTicket",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userMeme",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "userQuote",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "memeVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "quoteVault",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "stakingSignerPda",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "signer",
          isMut: !1,
          isSigner: !0,
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: "boundMergeTickets",
      accounts: [
        {
          name: "pool",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "ticketInto",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "ticketFrom",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "owner",
          isMut: !0,
          isSigner: !0,
        },
      ],
      args: [],
    },
    {
      name: "stakingMergeTickets",
      accounts: [
        {
          name: "staking",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "ticketInto",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "ticketFrom",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "owner",
          isMut: !0,
          isSigner: !0,
        },
      ],
      args: [],
    },
    {
      name: "closeTicket",
      accounts: [
        {
          name: "ticket",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "owner",
          isMut: !0,
          isSigner: !0,
        },
      ],
      args: [],
    },
    {
      name: "withdrawAdminFee",
      accounts: [
        {
          name: "sender",
          isMut: !0,
          isSigner: !0,
        },
        {
          name: "pool",
          isMut: !0,
          isSigner: !1,
        },
        {
          name: "boundPoolSignerPda",
          isMut: !1,
          isSigner: !1,
        },
        {
          name: "poolQuoteVault",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool Quote Vault"],
        },
        {
          name: "feeVaultQuote",
          isMut: !0,
          isSigner: !1,
          docs: ["Bonding Pool Fee Vault"],
        },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "boundPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "memeReserve",
            type: {
              defined: "Reserve",
            },
          },
          {
            name: "quoteReserve",
            type: {
              defined: "Reserve",
            },
          },
          {
            name: "adminFeesMeme",
            type: "u64",
          },
          {
            name: "adminFeesQuote",
            type: "u64",
          },
          {
            name: "feeVaultQuote",
            type: "publicKey",
          },
          {
            name: "creatorAddr",
            type: "publicKey",
          },
          {
            name: "fees",
            type: {
              defined: "Fees",
            },
          },
          {
            name: "config",
            type: {
              defined: "Config",
            },
          },
          {
            name: "locked",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "memeTicket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "pool",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "withdrawsMeme",
            type: "u64",
          },
          {
            name: "withdrawsQuote",
            type: "u64",
          },
          {
            name: "untilTimestamp",
            type: "i64",
          },
          {
            name: "vesting",
            type: {
              defined: "VestingData",
            },
          },
        ],
      },
    },
    {
      name: "stakingPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool",
            type: "publicKey",
          },
          {
            name: "memeVault",
            type: "publicKey",
          },
          {
            name: "memeMint",
            type: "publicKey",
          },
          {
            name: "lpVault",
            type: "publicKey",
          },
          {
            name: "lpMint",
            type: "publicKey",
          },
          {
            name: "quoteVault",
            type: "publicKey",
          },
          {
            name: "raydiumAmm",
            type: "publicKey",
          },
          {
            name: "vestingConfig",
            type: {
              defined: "VestingConfig",
            },
          },
          {
            name: "raydiumFees",
            type: {
              defined: "RaydiumAmmFees",
            },
          },
          {
            name: "stakesTotal",
            type: "u64",
          },
          {
            name: "feesXTotal",
            type: "u64",
          },
          {
            name: "feesYTotal",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "targetConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tokenTargetAmount",
            type: "u64",
          },
          {
            name: "tokenMint",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "ammConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pnlOwner",
            docs: ["withdraw pnl owner"],
            type: "publicKey",
          },
          {
            name: "cancelOwner",
            docs: ["admin amm order owner"],
            type: "publicKey",
          },
          {
            name: "pending1",
            docs: ["pending"],
            type: {
              array: ["u64", 28],
            },
          },
          {
            name: "pending2",
            docs: ["pending"],
            type: {
              array: ["u64", 31],
            },
          },
          {
            name: "createPoolFee",
            docs: ["init amm pool fee amount"],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "targetOrders",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "buyOrders",
            type: {
              array: [
                {
                  defined: "TargetOrder",
                },
                50,
              ],
            },
          },
          {
            name: "padding1",
            type: {
              array: ["u64", 8],
            },
          },
          {
            name: "targetX",
            type: "u128",
          },
          {
            name: "targetY",
            type: "u128",
          },
          {
            name: "planXBuy",
            type: "u128",
          },
          {
            name: "planYBuy",
            type: "u128",
          },
          {
            name: "planXSell",
            type: "u128",
          },
          {
            name: "planYSell",
            type: "u128",
          },
          {
            name: "placedX",
            type: "u128",
          },
          {
            name: "placedY",
            type: "u128",
          },
          {
            name: "calcPnlX",
            type: "u128",
          },
          {
            name: "calcPnlY",
            type: "u128",
          },
          {
            name: "sellOrders",
            type: {
              array: [
                {
                  defined: "TargetOrder",
                },
                50,
              ],
            },
          },
          {
            name: "padding2",
            type: {
              array: ["u64", 6],
            },
          },
          {
            name: "replaceBuyClientId",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "replaceSellClientId",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "lastOrderNumerator",
            type: "u64",
          },
          {
            name: "lastOrderDenominator",
            type: "u64",
          },
          {
            name: "planOrdersCur",
            type: "u64",
          },
          {
            name: "placeOrdersCur",
            type: "u64",
          },
          {
            name: "validBuyOrderNum",
            type: "u64",
          },
          {
            name: "validSellOrderNum",
            type: "u64",
          },
          {
            name: "padding3",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "freeSlotBits",
            type: "u128",
          },
        ],
      },
    },
    {
      name: "openOrders",
      type: {
        kind: "struct",
        fields: [
          {
            name: "accountFlags",
            type: "u64",
          },
          {
            name: "market",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "owner",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "nativeCoinFree",
            type: "u64",
          },
          {
            name: "nativeCoinTotal",
            type: "u64",
          },
          {
            name: "nativePcFree",
            type: "u64",
          },
          {
            name: "nativePcTotal",
            type: "u64",
          },
          {
            name: "freeSlotBits",
            type: "u128",
          },
          {
            name: "isBidBits",
            type: "u128",
          },
          {
            name: "orders",
            type: {
              array: ["u128", 128],
            },
          },
          {
            name: "clientOrderIds",
            type: {
              array: ["u64", 128],
            },
          },
          {
            name: "referrerRebatesAccrued",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "marketState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "accountFlags",
            type: "u64",
          },
          {
            name: "ownAddress",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "vaultSignerNonce",
            type: "u64",
          },
          {
            name: "coinMint",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "pcMint",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "coinVault",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "coinDepositsTotal",
            type: "u64",
          },
          {
            name: "coinFeesAccrued",
            type: "u64",
          },
          {
            name: "pcVault",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "pcDepositsTotal",
            type: "u64",
          },
          {
            name: "pcFeesAccrued",
            type: "u64",
          },
          {
            name: "pcDustThreshold",
            type: "u64",
          },
          {
            name: "reqQ",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "eventQ",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "bids",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "asks",
            type: {
              array: ["u64", 4],
            },
          },
          {
            name: "coinLotSize",
            type: "u64",
          },
          {
            name: "pcLotSize",
            type: "u64",
          },
          {
            name: "feeRateBps",
            type: "u64",
          },
          {
            name: "referrerRebatesAccrued",
            type: "u64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Decimals",
      type: {
        kind: "struct",
        fields: [
          {
            name: "alpha",
            type: "u128",
          },
          {
            name: "beta",
            type: "u128",
          },
          {
            name: "quote",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Config",
      type: {
        kind: "struct",
        fields: [
          {
            name: "alphaAbs",
            type: "u128",
          },
          {
            name: "beta",
            type: "u128",
          },
          {
            name: "priceFactor",
            type: "u64",
          },
          {
            name: "gammaS",
            type: "u64",
          },
          {
            name: "gammaM",
            type: "u64",
          },
          {
            name: "omegaM",
            type: "u64",
          },
          {
            name: "decimals",
            type: {
              defined: "Decimals",
            },
          },
        ],
      },
    },
    {
      name: "Fees",
      type: {
        kind: "struct",
        fields: [
          {
            name: "feeInPercent",
            type: "u64",
          },
          {
            name: "feeOutPercent",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "RaydiumAmmFees",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lastCumQuoteFees",
            type: "u64",
          },
          {
            name: "lastCumMemeFees",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "TokenLimit",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "tokens",
            type: {
              defined: "TokenAmount",
            },
          },
        ],
      },
    },
    {
      name: "TokenAmount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Reserve",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tokens",
            type: "u64",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "vault",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "RaydiumFees",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minSeparateNumerator",
            docs: ["numerator of the min_separate"],
            type: "u64",
          },
          {
            name: "minSeparateDenominator",
            docs: ["denominator of the min_separate"],
            type: "u64",
          },
          {
            name: "tradeFeeNumerator",
            docs: ["numerator of the fee"],
            type: "u64",
          },
          {
            name: "tradeFeeDenominator",
            docs: [
              "denominator of the fee",
              "and 'trade_fee_denominator' must be equal to 'min_separate_denominator'",
            ],
            type: "u64",
          },
          {
            name: "pnlNumerator",
            docs: ["numerator of the pnl"],
            type: "u64",
          },
          {
            name: "pnlDenominator",
            docs: ["denominator of the pnl"],
            type: "u64",
          },
          {
            name: "swapFeeNumerator",
            docs: ["numerator of the swap_fee"],
            type: "u64",
          },
          {
            name: "swapFeeDenominator",
            docs: ["denominator of the swap_fee"],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "StateData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "needTakePnlCoin",
            docs: ["delay to take pnl coin"],
            type: "u64",
          },
          {
            name: "needTakePnlPc",
            docs: ["delay to take pnl pc"],
            type: "u64",
          },
          {
            name: "totalPnlPc",
            docs: ["total pnl pc"],
            type: "u64",
          },
          {
            name: "totalPnlCoin",
            docs: ["total pnl coin"],
            type: "u64",
          },
          {
            name: "poolOpenTime",
            docs: ["ido pool open time"],
            type: "u64",
          },
          {
            name: "padding",
            docs: ["padding for future updates"],
            type: {
              array: ["u64", 2],
            },
          },
          {
            name: "orderbookToInitTime",
            docs: ["switch from orderbookonly to init"],
            type: "u64",
          },
          {
            name: "swapCoinInAmount",
            docs: ["swap coin in amount"],
            type: "u128",
          },
          {
            name: "swapPcOutAmount",
            docs: ["swap pc out amount"],
            type: "u128",
          },
          {
            name: "swapAccPcFee",
            docs: ["charge pc as swap fee while swap pc to coin"],
            type: "u64",
          },
          {
            name: "swapPcInAmount",
            docs: ["swap pc in amount"],
            type: "u128",
          },
          {
            name: "swapCoinOutAmount",
            docs: ["swap coin out amount"],
            type: "u128",
          },
          {
            name: "swapAccCoinFee",
            docs: ["charge coin as swap fee while swap coin to pc"],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "TargetOrder",
      type: {
        kind: "struct",
        fields: [
          {
            name: "price",
            type: "u64",
          },
          {
            name: "vol",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "VestingConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "startTs",
            type: "i64",
          },
          {
            name: "cliffTs",
            type: "i64",
          },
          {
            name: "endTs",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "VestingData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "released",
            type: "u64",
          },
          {
            name: "notional",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "DecimalError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MathOverflow",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6e3,
      name: "InvalidAccountInput",
      msg: "Provided account breaks some constraints, see logs for more info",
    },
    {
      code: 6001,
      name: "InvalidArg",
      msg: "One of the provided input arguments is invalid",
    },
    {
      code: 6002,
      name: "SlippageExceeded",
      msg: "Given amount of tokens to swap would result in \\\n        less than minimum requested tokens to receive",
    },
    {
      code: 6003,
      name: "InvariantViolation",
      msg: "There's a bug in the program, see logs for more info",
    },
    {
      code: 6004,
      name: "InvalidTokenMints",
      msg: "Provided mints are not available on the pool",
    },
    {
      code: 6005,
      name: "MathOverflow",
    },
    {
      code: 6006,
      name: "MulDivOverflow",
    },
    {
      code: 6007,
      name: "DivideByZero",
    },
    {
      code: 6008,
      name: "ZeroInAmt",
    },
    {
      code: 6009,
      name: "ZeroMemeVault",
    },
    {
      code: 6010,
      name: "InsufficientBalance",
    },
    {
      code: 6011,
      name: "PoolIsLocked",
      msg: "Pool can't be interacted with until going into live phase",
    },
    {
      code: 6012,
      name: "NoZeroTokens",
      msg: "Shouldn't provide zero tokens in",
    },
    {
      code: 6013,
      name: "NoTokensToWithdraw",
    },
    {
      code: 6014,
      name: "NotEnoughTicketTokens",
      msg: "Amount of tokens in ticket is lower than needed to swap",
    },
    {
      code: 6015,
      name: "TicketTokensLocked",
      msg: "Not enough time passed to unlock tokens bound to the ticket",
    },
    {
      code: 6016,
      name: "NonZeroAmountTicket",
      msg: "Can't close ticket with non-zero bound token amount",
    },
    {
      code: 6017,
      name: "NotEnoughTokensToRelease",
      msg: "Can't unstake the required amount of tokens",
    },
    {
      code: 6018,
      name: "BondingCurveMustBeNegativelySloped",
    },
    {
      code: 6019,
      name: "BondingCurveInterceptMustBePositive",
    },
    {
      code: 6020,
      name: "EGammaSAboveRelativeLimit",
    },
    {
      code: 6021,
      name: "EScaleTooLow",
    },
    {
      code: 6022,
      name: "InvalidAmmAccountOwner",
    },
    {
      code: 6023,
      name: "ExpectedAccount",
    },
    {
      code: 6024,
      name: "InvalidStatus",
    },
    {
      code: 6025,
      name: "CantUnstakeBeforeCliff",
    },
    {
      code: 6026,
      name: "NoFeesToAdd",
    },
  ],
};

// Define or import these variables
const B = 9; // Example value, replace with actual value
const L = 6; // Example value, replace with actual value
const R = 1000; // Example value, replace with actual value
const P = 1000; // Example value, replace with actual value
const O = 1000; // Example value, replace with actual value
const q = 1000; // Example value, replace with actual value
const Y = 1000; // Example value, replace with actual value
// Assuming these are imported from other modules
const M = new PublicKey("Czbmb7osZxLaX5vGHuXMS2mkdtZEXyTNKwsAUUpLGhkG"); // Admin PublicKey
let D = PublicKey.default;
const connection = new et.Connection(
  process.env.ANCHOR_PROVIDER as string,
  "confirmed"
);
function findSignerPda(e, t) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("signer"), e.toBytes()],
    t
  )[0];
}

const wallet = et.Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(require("fs").readFileSync("/home/ubuntu/mani3.json"))
  )
);
const provider = new AnchorProvider(connection, new Wallet(wallet), {});
const memechanProgram = new Program(
  idl as any,
  new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"),
  provider
);
function getMemeTicketPDA({ ticketNumber: e, poolId: t, userId: n }) {
  let r = new DataView(new ArrayBuffer(8), 0);
  r.setBigUint64(0, BigInt(e), !0);
  return PublicKey.findProgramAddressSync(
    [t.toBytes(), n.toBytes(), new Uint8Array(r.buffer)],
    new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR")
  );
}

function findBoundPoolPda(e, t, n) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("bound_pool"), e.toBytes(), t.toBytes()],
    n
  )[0];
}

function findStakingPda(e, t) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("staking_pool"), e.toBytes()],
    t
  )[0];
}

function findMemeTicketPda(e, t) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("admin_ticket"), e.toBytes()],
    t
  )[0];
}

async function fromPoolCreationTransaction({ client, poolCreationSignature }) {
  let tx = (
    await connection.getTransaction(poolCreationSignature, {
      maxSupportedTransactionVersion: 0,
    })
  ).transaction;
  const addressTableLookupsAccountKeys = tx.message.addressTableLookups.map(
    (lookup) => lookup.accountKey
  );

  const lookupTableAccounts = await Promise.all(
    addressTableLookupsAccountKeys.map(
      async (key) =>
        await connection.getAddressLookupTable(key).then((res) => res.value)
    )
  );

  const txMessageDecompiled = TransactionMessage.decompile(tx.message, {
    // @ts-ignore
    addressLookupTableAccounts: lookupTableAccounts,
  });
  const parsedData = txMessageDecompiled;
  console.log(parsedData);
  let i = -1;
  // @ts-ignore
  const keys = parsedData.instructions
    .flatMap((e) => e.keys)
    .map((e) => e.pubkey);
  for (const account of keys) {
    i++;
    console.log(i);
    try {
      const stakeingPda = await fromStakingPoolId({
        poolAccountAddressId: account,
      });
      console.log(stakeingPda);
      let poolData = await memechanProgram.account.stakingPool.fetch(
        new PublicKey("ARnfEo5BhmZ47ZyxPwXMgivEc6fe4AzBp8thCbg5331D")
      );
      console.log("gotit", i);
      return {
        // @ts-ignore
        poolAddress: newPoolInstruction.accounts.pool,
        client,
        // @ts-ignore
        memeVault: poolData.memeReserve.vault,
        // @ts-ignore
        quoteVault: poolData.quoteReserve.vault,
        // @ts-ignore
        memeMint: poolData.memeReserve.mint,
        // @ts-ignore
        quoteMint: poolData.quoteReserve.mint,
        // @ts-ignore
        token: new Token(ee.TOKEN_PROGRAM_ID, poolData.memeReserve.mint, B),
      };
    } catch (err) {
      console.log(err);
    }
  }
}
async function fromStakingPoolId({ poolAccountAddressId: n }) {
  let r = await memechanProgram.account.stakingPool.fetch(n, "confirmed");
  // @ts-ignore
  return [
    n,
    // @ts-ignore
    r.pool,
    // @ts-ignore
    r.memeVault,
    // @ts-ignore
    r.memeMint,
    // @ts-ignore
    r.lpVault,
    // @ts-ignore
    r.lpMint,
    // @ts-ignore
    r.quoteVault,
    // @ts-ignore
    r.raydiumAmm,
  ];
}
async function swapY(t, tx) {
  const {
    user: n,
    payer: r,
    memeTicketNumber: i,
    pool: o = id,
    quoteAmountIn: s,
    memeTokensOut: u,
    userSolAcc,
    quoteMint,
  } = t;

  const a = findSignerPda(
    o,
    new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR")
  );
  const c = getMemeTicketPDA({
    ticketNumber: i,
    poolId: o,
    userId: n.publicKey,
  })[0];

  const l = (
    await ee.getOrCreateAssociatedTokenAccount(
      connection,
      r,
      quoteMint,
      n.publicKey,
      true,
      "confirmed",
      {
        skipPreflight: true,
      }
    )
  ).address;

  console.log("solIn: ", s);
  console.log("memeOut: ", u);
  let hmm = await memechanProgram.methods
    .swapY(new BN(s), new BN(u), new BN(i))
    .accounts({
      memeTicket: c,
      owner: n.publicKey,
      pool: o,
      poolSignerPda: a,
      quoteVault,
      userSol: l,
      systemProgram: et.SystemProgram.programId,
      tokenProgram: ee.TOKEN_PROGRAM_ID,
    })
    .preInstructions([
      et.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 66000,
      }),
    ])
    .signers([n])
    .instruction();
  const tosend = new et.Transaction()
    .add(
      et.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 66000,
      })
    )
    .add(hmm)
    .add(
      new et.TransactionInstruction(
        new et.TransactionInstruction({
          data: Buffer.from(
            "And now; magick! I saw your presale opportunities and decided to throw some Slerf at it <3"
          ),
          keys: [],
          programId: MEMO_PROGRAM_ID,
        })
      )
    );
  tosend.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tosend.feePayer = wallet.publicKey;
  tosend.sign(wallet);
  try {
    let signature = await connection.sendRawTransaction(tosend.serialize(), {
      skipPreflight: true,
      preflightCommitment: "confirmed",
    });
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}

async function buyMeme(e) {
  let { tx: t } = await getBuyMemeTransaction(e);

  return await t;
}
async function getBuyMemeTransaction(e) {
  const {
    inputAmount: t,
    minOutputAmount: n,
    slippagePercentage: r,
    user: i,
    transaction: o = new et.Transaction(),
    memeTicketNumber: a,
    inputTokenAccount: s,
  } = e;

  const u = id;
  const l = new BN(a);
  const d = getMemeTicketPDA({
    ticketNumber: a,
    poolId: u,
    userId: i,
  });
  const f = connection;
  const h = new BN(t).div(new BN(1 + r / 100)).toString();
  const p = new BN(h.toString());
  const m = new BN(n).div(new BN(1 + r / 100)).toString();
  const g = new BN(m.toString());

  let inputTokenAcc = s;
  if (!inputTokenAcc) {
    const e = ee.getAssociatedTokenAddressSync(
      quoteTokenMint,
      i,
      true,
      ee.TOKEN_PROGRAM_ID,
      ee.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const account = await ee.getAccount(f, e);
    inputTokenAcc = account.address;

    if (!inputTokenAcc) {
      const t = ee.createAssociatedTokenAccountInstruction(
        i,
        e,
        i,
        quoteTokenMint,
        ee.TOKEN_PROGRAM_ID,
        ee.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      o.add(t);
      inputTokenAcc = e;
    }
  }
  const discriminator = Uint8Array.of(
    0x7e,
    0xd0,
    0x68,
    0xd6,
    0x65,
    0xd9,
    0x3b,
    0x41,
    0x00,
    0x50,
    0xd6,
    0xdc,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00
  );

  let ix = new et.TransactionInstruction({
    data: Buffer.from(
      Uint8Array.of(
        ...discriminator,
        ...p.toArray("le", 8),
        ...g.toArray("le", 8),
        ...l.toArray("le", 8)
      )
    ),
    keys: [
      {
        pubkey: findSignerPda(
          u,
          new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR")
        ),
        isWritable: true,
        isSigner: false,
      }, // findSignerPda() result
      { pubkey: id, isWritable: true, isSigner: false }, // getMemeTicketPDA() result
      { pubkey: inputTokenAcc, isWritable: true, isSigner: false }, // inputTokenAccount
      {
        pubkey: getAssociatedBaseVault({
          programId: new PublicKey(
            "memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"
          ),
          marketId: id,
        })[0],
        isWritable: true,
        isSigner: false,
      }, // new account created by the program using findProgramAddress
      { pubkey: wallet.publicKey, isWritable: true, isSigner: true }, // user
      {
        pubkey: getAssociatedAuthority({
          programId: new PublicKey(
            "memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"
          ),
        })[0],
        isWritable: false,
        isSigner: false,
      }, // mintauthority on the mint
      { pubkey: ee.TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
      {
        pubkey: et.SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    programId: new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"),
  });

  const b = et.ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: R,
  });

  o.add(b);
  o.add(ix);
  o.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  o.feePayer = wallet.publicKey;
  o.sign(wallet);
  let test = await connection.sendRawTransaction(o.serialize(), {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });
  console.log(test);
  return {
    tx: o,
    memeTicketPublicKey: d,
    inputTokenAccount: inputTokenAcc,
  };
}

async function sellMeme(e) {
  let { txs: t } = await getSellMemeTransaction(e),
    n = [];
  for (let r of t) {
    let t = await connection.getLatestBlockhash("confirmed");
    (r.recentBlockhash = t.blockhash),
      (r.lastValidBlockHeight = t.lastValidBlockHeight);
    let i = await (0, et.sendAndConfirmTransaction)(connection, r, [e.signer], {
      commitment: "confirmed",
      skipPreflight: !0,
      preflightCommitment: "confirmed",
    });
    n.push(i), console.log("tx signature:", i);
  }
  return n;
}

async function getSellMemeTransaction(e) {
  let t;
  let {
      inputAmount: n,
      minOutputAmount: r,
      slippagePercentage: i,
      user: o,
      transaction: a = new et.Transaction(),
    } = e,
    { outputTokenAccount: s } = e,
    u = id,
    c = findSignerPda(
      u,
      new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR")
    ),
    l = connection,
    d = 1,
    f = 1;
  if (new BN(n).gt(new BN(d)))
    throw Error(
      `Provided inputTicketAmount is larger than available ticket amount for sell. Available ticket amount: ${d}`
    );
  let h = new BN(n).div(new BN(1 + i / 100)).toString(),
    p = new BN(h.toString()),
    m = new BN(h.toString()),
    g = new BN(h.toString()),
    y = new BN(g.toString());
  if (!s) {
    let e = (0, ee.getAssociatedTokenAddressSync)(
      quoteTokenMint,
      o,
      !0,
      ee.TOKEN_PROGRAM_ID,
      ee.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    if (!(s = (await (0, ee.getAccount)(l, e)).address)) {
      let t = (0, ee.createAssociatedTokenAccountInstruction)(
        o,
        e,
        o,
        quoteTokenMint,
        ee.TOKEN_PROGRAM_ID,
        ee.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      a.add(t), (s = e);
    }
  }
  let ticketsRequiredToSell = 1;
  let isMoreThanOneTicket = false;
  t = 1;
  let _ = new et.TransactionInstruction({
    data: Buffer.from(
      Uint8Array.of(
        ...new BN(0x413f56a8).toArray("le", 4), // discriminator
        ...new BN(p).toArray("le", 8),
        ...new BN(y).toArray("le", 8)
      )
    ),
    keys: [
      { pubkey: t.id, isWritable: true, isSigner: false },
      { pubkey: o, isWritable: false, isSigner: true },
      { pubkey: u, isWritable: false, isSigner: false },
      { pubkey: c, isWritable: false, isSigner: false },
      { pubkey: quoteVault, isWritable: true, isSigner: false },
      { pubkey: s, isWritable: true, isSigner: false },
      { pubkey: ee.TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    ],
    programId: new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"),
  });
  a.add(_);
  return a;
}

async function swapX(e) {
  let t = await getSellMemeTransactionLegacy(e);
  return await (0, et.sendAndConfirmTransaction)(connection, t, [e.user], {
    skipPreflight: !0,
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}

async function getSellMemeTransactionLegacy(e) {
  const id = new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR");
  let t = e.transaction ?? new et.Transaction(),
    n = e.user,
    r = id,
    i = findSignerPda(
      id,
      new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR")
    ),
    o = e.memeAmountIn,
    a = e.minQuoteAmountOut,
    s = e.userMemeTicket,
    u = e.userQuoteAcc,
    c = new et.TransactionInstruction({
      data: Buffer.from(
        Uint8Array.of(
          ...new BN(0x413f56a8).toArray("le", 4), // discriminator
          ...new BN(o).toArray("le", 8),
          ...new BN(a).toArray("le", 8)
        )
      ),
      keys: [
        { pubkey: s.id, isWritable: true, isSigner: false },
        { pubkey: n.publicKey, isWritable: false, isSigner: true },
        { pubkey: r, isWritable: false, isSigner: false },
        { pubkey: i, isWritable: false, isSigner: false },
        { pubkey: quoteVault, isWritable: true, isSigner: false },
        { pubkey: u, isWritable: true, isSigner: false },
        { pubkey: ee.TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
      ],
      programId: new PublicKey("memeVtsr1AqAjfRzW2PuzymQdP2m7SgL6FQ1xgMc9MR"),
    });
  return t.add(c), t;
}

function getMemeMarketCap({ memePriceInUsd: e }) {
  return new BN(Y).mul(e).toString();
}

function getATAAddress(e, t, n) {
  return PublicKey.findProgramAddressSync(
    [e.toBuffer(), n.toBuffer(), t.toBuffer()],
    new PublicKey(e9)
  );
}

function getAssociatedId({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [e.toBuffer(), t.toBuffer(), Buffer.from("amm_associated_seed", "utf-8")],
    e
  );
  return n;
}

function getAssociatedAuthority({ programId: e }) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from([
        97, 109, 109, 32, 97, 117, 116, 104, 111, 114, 105, 116, 121,
      ]),
    ],
    e
  );
}

function getAssociatedBaseVault({ programId: e, marketId: t }) {
  return PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("coin_vault_associated_seed", "utf-8"),
    ],
    e
  );
}

function getAssociatedQuoteVault({ programId: e, marketId: t }) {
  return PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("pc_vault_associated_seed", "utf-8"),
    ],
    e
  );
}

function getAssociatedLpMint({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("lp_mint_associated_seed", "utf-8"),
    ],
    e
  );
  return n;
}

function getAssociatedLpVault({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("temp_lp_token_associated_seed", "utf-8"),
    ],
    e
  );
  return n;
}

function getAssociatedTargetOrders({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("target_associated_seed", "utf-8"),
    ],
    e
  );
  return n;
}

function getAssociatedWithdrawQueue({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("withdraw_associated_seed", "utf-8"),
    ],
    e
  );
  return n;
}

function getAssociatedOpenOrders({ programId: e, marketId: t }) {
  let [publicKey, n] = PublicKey.findProgramAddressSync(
    [
      e.toBuffer(),
      t.toBuffer(),
      Buffer.from("open_order_associated_seed", "utf-8"),
    ],
    e
  );
  return n;
}

function getAssociatedConfigId({ programId: e }) {
  let [publicKey, t] = PublicKey.findProgramAddressSync(
    [Buffer.from("amm_config_account_seed", "utf-8")],
    e
  );
  return t;
}

async function airdrop(e, t, n = 5e9) {
  await e.confirmTransaction(await e.requestAirdrop(t, n), "confirmed");
}

class Helper {
  static async new(t) {
    let n = this.findTargetConfigPda(t.mint, t.client.memechanProgram.programId);
    let r = await t.client.memechanProgram.methods.newTargetConfig(t.targetAmount).accounts({
      mint: t.mint,
      sender: t.payer.publicKey,
      targetConfig: n,
      systemProgram: et.SystemProgram.programId
    }).instruction();
    
    let i = new Transaction();
    i.add(r);
    i.feePayer = wallet.publicKey 
    i.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    i.sign(wallet)
    let o = await connection.sendRawTransaction(i.serialize())
    
    return {
      targetConfigPda: n
    }
  }

  static findTargetConfigPda(e, t) {
    return PublicKey.findProgramAddressSync([Buffer.from("config"), e.toBytes()], t)[0];
  }

  static findSignerPda(e, t) {
    return PublicKey.findProgramAddressSync([Buffer.from("signer"), e.toBytes()], t)[0];
  }

  static findBoundPoolPda(e, t, n) {
    return PublicKey.findProgramAddressSync([Buffer.from("bound_pool"), e.toBytes(), t.toBytes()], n)[0];
  }

  static findStakingPda(e, t) {
    return PublicKey.findProgramAddressSync([Buffer.from("staking_pool"), e.toBytes()], t)[0];
  }

  static findMemeTicketPda(e, t) {
    return PublicKey.findProgramAddressSync([Buffer.from("admin_ticket"), e.toBytes()], t)[0];
  }

  static async getCreateNewBondingPoolAndBuyAndTokenWithBuyMemeTransaction(t) {
    let n;
    let {
      payer: r,
      client: i,
      quoteToken: o,
      transaction: a = new Transaction(),
      feeQuoteVaultPk: s,
      tokenMetadata: u
    } = t;
    let {
      connection: c,
      memechanProgram: l
    } = i;
    let d = Keypair.generate();
    let f = d.publicKey;
    let h = this.findBoundPoolPda(d.publicKey, o.mint, t.client.memechanProgram.programId);
    let p = this.findSignerPda(h, t.client.memechanProgram.programId);

    let y = await ee.getOrCreateAssociatedTokenAccount(
      connection,
      r,
      o.mint,
      p
    );
    let b = await ee.getOrCreateAssociatedTokenAccount(
      connection,
      r,
      f,
      p
    );
    let m = await l.methods.newPool().accounts({
      feeQuoteVault: s,
      memeVault: b,
      quoteVault: y,
      memeMint: f,
      pool: h,
      poolSigner: p,
      sender: r,
      quoteMint: o.mint,
      tokenProgram: ee.TOKEN_PROGRAM_ID,
      systemProgram: et.SystemProgram.programId,
      targetConfig: this.findTargetConfigPda(t.mint, t.client.memechanProgram.programId)
  }).instruction();
    a.add(...m);
    let g = s;
    g || (g = await ee.getOrCreateAssociatedTokenAccount(
      connection,
      r,
      o.mint,
      new PublicKey("...") // Replace with actual public key
    ));
    let v = await l.methods.newPool().accounts({
      feeQuoteVault: g,
      memeVault: b,
      quoteVault: y,
      memeMint: f,
      pool: h,
      poolSigner: p,
      sender: r,
      quoteMint: o.mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      targetConfig: this.findTargetConfigPda(t.mint, t.client.memechanProgram.programId)
    }).instruction();
    if (a.add(v),
      t.buyMemeTransactionArgs && new BN(t.buyMemeTransactionArgs.inputAmount).gt(new BN(0))) {
      let tx = await memechanProgram.methods.swapY(
        new BN(t.buyMemeTransactionArgs.inputAmount),
        new BN(t.buyMemeTransactionArgs.minOutputAmount),
        new BN(t.buyMemeTransactionArgs.slippagePercentage)
      ).accounts({
        pool: h,
        quoteVault: y.address,
        userSol: t.buyMemeTransactionArgs.userSolAcc,
        memeTicket: this.findMemeTicketPda(t.buyMemeTransactionArgs.memeTicketNumber, h),
        owner: r.publicKey,
        poolSignerPda: p,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      }).instruction();
      n = r;
      a.add(tx);
    }
    let tx = await memechanProgram.methods
      .swapY(new BN(s), new BN(u), new BN(i))
      .accounts({
        memeTicket: this.findMemeTicketPda(t.buyMemeTransactionArgs.memeTicketNumber, h),
        owner: n.publicKey,
        pool: h,
        poolSignerPda: p,
        quoteVault,
        userSol: l,
        systemProgram: et.SystemProgram.programId,
        tokenProgram: ee.TOKEN_PROGRAM_ID,
      })
      .preInstructions([
        et.ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 66000,
        }),
      ])
      .signers([n])
      .instruction();
    a.add(tx);
      async function nx(e, t){
        let n = t.metadata;
        let r = n;
        let i = new PublicKey(t.mint);
        return e.memechanProgram.methods.createMetadata(n.name, n.symbol, r).accounts({
            pool: t.poolId,
            poolSigner: t.poolSigner,
            memeMplMetadata: i,
            sender: t.payer,
            rent: et.SYSVAR_RENT_PUBKEY,
            memeMint: t.mint,
            metadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
            systemProgram: et.SystemProgram.programId,
            tokenProgram: ee.TOKEN_PROGRAM_ID
        }).transaction();
      }
    const metadataInstructions = (await nx(t, {
      payer: r,
      mint: f,
      poolSigner: p,
      poolId: h,
      metadata: u
    })).instructions;

    a.add(...metadataInstructions);
    return {
      createPoolTransaction: a,
      memeMintKeypair: d,
      poolQuoteVault: y,
      launchVault: b,
      memeTicketPublicKey: n
    };
  }

  static async newWithBuyTx(t) {
    let {payer: n, client: r, quoteToken: i} = t,
      {memechanProgram: o} = r,
      {createPoolTransaction: a, memeMintKeypair: s, poolQuoteVault: u, launchVault: c} = await this.getCreateNewBondingPoolAndBuyAndTokenWithBuyMemeTransaction({
        ...t,
        payer: n.publicKey
      }),
      l = s.publicKey;
    console.debug("createPoolTransaction size: ", a.serialize().length);
    let d = [n, s],
      f = async () => {
        await connection.sendTransaction(a, d, {
          skipPreflight: true,
          preflightCommitment: "confirmed"
        });
      };
    await f();
    return {
      boundPoolPda: this.findBoundPoolPda(l, i.mint, o.programId),
      client: r,
      launchVault: c,
      poolQuoteVault: u,
      memeMintPublicKey: l,
      quoteMint: i.mint,
      token: new PublicKey("...") // Replace with actual public key
    };
  }
}

async function initializeNewPool() {
  const payer = wallet;
  const client = { connection, memechanProgram };
  const quoteToken = { mint: new PublicKey("HsswPz2yNQKT2b3pLr1iZx3ekhM55Z77UsRthEGChjpV") }; // Replace with actual quote mint public key
  const tokenMetadata = { uri: "https://example.com/metadata.json" }; // Replace with actual metadata URI

const targetConfig = await Helper.new({
  payer,
  client,
  mint: quoteToken.mint,
  targetAmount: new BN(1000000)
})

  const result = await Helper.newWithBuyTx({
    payer,
    client,
    quoteToken,
    tokenMetadata,
    buyMemeTransactionArgs: {
      inputAmount: new BN(1000) // Replace with actual input amount
    }
  });

  console.log("Pool created with transaction:", result);
}

initializeNewPool().catch(console.error);
async function main() {
  const args = parseCommandLineArgs();

  // Open connection.
  const client = new Client(args.endpoint, args.xToken, {
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
      console.error(
        `Unknown command: ${args["_"]}. Use "--help" for a list of supported commands.`
      );
      break;
  }
}

function parseCommitmentLevel(commitment: string | undefined) {
  if (!commitment) {
    return;
  }
  const typedCommitment =
    commitment.toUpperCase() as keyof typeof CommitmentLevel;
  return CommitmentLevel[typedCommitment];
}

async function subscribeCommand(client, args) {
  // Subscribe for events
  const stream = await client.subscribe();

  // Create `error` / `end` handler
  const streamClosed = new Promise<void>((resolve, reject) => {
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
  stream.on("data", async (data) => {
    console.log(data);
    if (data.transaction != undefined) {
      const preTokenBalances =
        data.transaction.transaction.meta.preTokenBalances;
      const postTokenBalances =
        data.transaction.transaction.meta.postTokenBalances;
      const logs = data.transaction.transaction.meta.logMessages;
      console.log(logs);
      const filteredLogs = logs.filter((log) =>
        log.includes("Program log: Instruction: SwapY")
      );
      if (filteredLogs.length > 0) {
        const txx = data.transaction.transaction;
        const signature = bs58.encode(txx.signature);
        console.log(signature);
        let tx = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });
        while (tx == null) {
          tx = await connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0,
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const addressTableLookupsAccountKeys =
          tx.transaction.message.addressTableLookups.map(
            (lookup) => lookup.accountKey
          );

        const lookupTableAccounts = await Promise.all(
          addressTableLookupsAccountKeys.map(
            async (key) =>
              await connection
                .getAddressLookupTable(key)
                .then((res) => res.value)
          )
        );
        const txMessageDecompiled = TransactionMessage.decompile(
          tx.transaction.message,
          {
            // @ts-ignore
            addressLookupTableAccounts: lookupTableAccounts,
          }
        );
        const parsedData = txMessageDecompiled;
        const accounts = parsedData.instructions
          .filter((i) => i.keys.length > 2)
          .flatMap((i) => i.keys)
          .map((k) => k.pubkey);
        console.log(accounts);
        if (
          accounts
            .flatMap((account) => account.toBase58())
            .includes(wallet.publicKey.toBase58())
        )
          return;
        quoteVault = accounts[1];
        id = accounts[0];
        await swapY(
          {
            user: wallet,
            payer: wallet,
            memeTicketNumber: Math.floor(Math.random() * 1999999999),
            pool: id,
            quoteAmountIn: 10 * 10 ** 9,
            memeTokensOut: 142066650000,
            userSolAcc: wallet,
            quoteMint: new et.PublicKey(
              "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3"
            ),
            inputTokenAccount: getAssociatedTokenAddressSync(
              new et.PublicKey("7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3"),
              wallet.publicKey,
              true,
              ee.TOKEN_PROGRAM_ID,
              ee.ASSOCIATED_TOKEN_PROGRAM_ID
            ),
          },
          undefined
        );
      }
    }
  });

  // Create subscribe request based on provided arguments.
  const request: SubscribeRequest = {
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
    const filters: SubscribeRequestFilterAccountsFilter[] = [];

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
  await new Promise<void>((resolve, reject) => {
    stream.write(request, (err) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });

  await streamClosed;
}
import yargs from 'yargs';
function parseCommandLineArgs() {
  return yargs(process.argv.slice(2))
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
    .command(
      "is-blockhash-valid",
      "check the validity of a given block hash",
      (yargs) => {
        return yargs.options({
          blockhash: {
            type: "string",
            demandOption: true,
          },
        });
      }
    )
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
          describe:
            "filter by offset and data, format: `offset,data in base58`",
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
          describe:
            "receive only part of updated data account, format: `offset,size`",
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
main();

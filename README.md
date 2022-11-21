# Public GRPC interface to Geyser

### Validator

```bash
$ solana-validator --geyser-plugin-config ./config.json
```

### Client

- Always broadcast new slots
- Accounts can be filtered by `pubkey` and `owner` fields, also all accounts can be broadcasted with `*`

```
$ cargo run --bin client -- --accounts --account SysvarC1ock11111111111111111111111111111111
    Finished dev [unoptimized + debuginfo] target(s) in 0.69s
     Running `target/debug/client --accounts --account SysvarC1ock11111111111111111111111111111111`
stream opened
new message: SubscribeUpdate { filters: ["client"], update_oneof: Some(Account(SubscribeUpdateAccount { account: Some(SubscribeUpdateAccountInfo { pubkey: [6, 167, 213, 23, 24, 199, 116, 201, 40, 86, 99, 152, 105, 29, 94, 182, 139, 94, 184, 163, 155, 75, 109, 92, 115, 85, 91, 33, 0, 0, 0, 0], lamports: 1169280, owner: [6, 167, 213, 23, 24, 117, 247, 41, 199, 61, 147, 64, 143, 33, 97, 32, 6, 126, 216, 140, 118, 224, 140, 40, 127, 193, 148, 96, 0, 0, 0, 0], executable: false, rent_epoch: 0, data: [57, 29, 0, 0, 0, 0, 0, 0, 165, 160, 80, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 221, 189, 80, 99, 0, 0, 0, 0], write_version: 53718 }), slot: 7481, is_startup: false })) }
new message: SubscribeUpdate { filters: ["client"], update_oneof: Some(Account(SubscribeUpdateAccount { account: Some(SubscribeUpdateAccountInfo { pubkey: [6, 167, 213, 23, 24, 199, 116, 201, 40, 86, 99, 152, 105, 29, 94, 182, 139, 94, 184, 163, 155, 75, 109, 92, 115, 85, 91, 33, 0, 0, 0, 0], lamports: 1169280, owner: [6, 167, 213, 23, 24, 117, 247, 41, 199, 61, 147, 64, 143, 33, 97, 32, 6, 126, 216, 140, 118, 224, 140, 40, 127, 193, 148, 96, 0, 0, 0, 0], executable: false, rent_epoch: 0, data: [58, 29, 0, 0, 0, 0, 0, 0, 165, 160, 80, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 222, 189, 80, 99, 0, 0, 0, 0], write_version: 53725 }), slot: 7482, is_startup: false })) }
^C
```

### Filters

See [proto/geyser.proto](proto/geyser.proto).

#### Slots

Currently all slots are broadcasted.

#### Account

Accounts can be filtered by:

   - `account` — acount Pubkey, match to any Pubkey from the array
   - `owner` — account owner Pubkey, match to any Pubkey from the array

If all fields are empty then all accounts are broadcasted. Otherwise fields works as logical `AND` and values in arrays as logical `OR`.

#### Transactions

   - `vote` — enable/disable broadcast `vote` transactions
   - `failed` — enable/disable broadcast `failed` transactions
   - `account_include` — filter transactions which use any account
   - `account_exclude` — filter transactions which do not use any account

If all fields are empty then all transactions are broadcasted. Otherwise fields works as logical `AND` and values in arrays as logical `OR`.

#### Blocks

Currently all blocks are broadcasted.

### Limit filters

It's possible to add limits for filters in config. If `filters` field is omitted then filters doesn't have any limits.

```json
"grpc": {
   "filters": {
      "accounts": {
         "max": 1,
         "any": false,
         "account_max": 10,
         "account_reject": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
         "owner_max": 10,
         "owner_reject": ["11111111111111111111111111111111"]
      },
      "slots": {
         "max": 1
      },
      "transactions": {
         "max": 1,
         "any": false,
         "account_include_max": 10,
         "account_include_reject": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
         "account_exclude_max": 10
      },
      "blocks": {
         "max": 1
      }
   }
}
```
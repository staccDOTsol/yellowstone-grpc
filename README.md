# Yellowstone Dragon's Mouth - a Geyser based gRPC interface for Solana

This repo contains a fully functional gRPC interface for Solana. It is built around Solana's Geyser interface. In this repo we have the plugin as well as sample clients for multiple languages.

It provides the ability to get slots, blocks, transactions, and account update notifications over a standardised path. 

For additional documentation,  please see: https://docs.triton.one/rpc-pool/grpc-subscriptions

#### Known bugs

Block reconstruction inside gRPC plugin based on information provided by BlockMeta, unfortunately number of entries for blocks generated on validators always equal to zero. These blocks always will have zero entries. See issue on GitHub: https://github.com/solana-labs/solana/issues/33823

### Validator

```bash
$ solana-validator --geyser-plugin-config yellowstone-grpc-geyser/config.json
```

### Plugin config check

```
cargo-fmt && cargo run --bin config-check -- --config yellowstone-grpc-geyser/config.json
```

### Block reconstruction

Geyser interface on block update do not provide detailed information about transactions and accounts updates. To provide this information with block message we need to collect all messages and expect specified order. By default if we failed to reconstruct full block we log error message and increase `invalid_full_blocks_total` counter in prometheus metrics. If you want to panic on invalid reconstruction you can change option `block_fail_action` in config to `panic` (default value is `log`).

### Filters for streamed data

Please check [yellowstone-grpc-proto/proto/geyser.proto](yellowstone-grpc-proto/proto/geyser.proto) for details.

   - `commitment` — commitment level: `processed` / `confirmed` / `finalized`
   - `accounts_data_slice` — array of objects `{ offset: uint64, length: uint64 }`, allow to receive only required data from accounts
   - `ping` — optional boolean field. Some cloud providers (like Cloudflare, Fly.io) close the stream if client doesn't send anything during some time. As workaroud you can send same filter every N seconds, but this would be not optimal since you need to keep this filter. Instead, you can send subscribe request with `ping` field set to `true` and ignore rest of the fields in the request. Since we sent `Ping` message every 15s from the server, you can send subscribe request with `ping` as reply and receive `Pong` message.

#### Slots

   - `filter_by_commitment` — by default slots sent for all commitment levels, but with this filter you can receive only selected commitment level

#### Account

Accounts can be filtered by:

   - `account` — acount Pubkey, match to any Pubkey from the array
   - `owner` — account owner Pubkey, match to any Pubkey from the array
   - `filters` — same as `getProgramAccounts` filters, array of `dataSize` or `Memcmp` (bytes, base58, base64 are supported)

If all fields are empty then all accounts are broadcasted. Otherwise fields works as logical `AND` and values in arrays as logical `OR` (except values in `filters` that works as logical `AND`).

#### Transactions

   - `vote` — enable/disable broadcast `vote` transactions
   - `failed` — enable/disable broadcast `failed` transactions
   - `signature` — match only specified transaction
   - `account_include` — filter transactions that use any account from the list
   - `account_exclude` — opposite to `account_include`
   - `account_required` — require all accounts from the list to be used in transaction

If all fields are empty then all transactions are broadcasted. Otherwise fields works as logical `AND` and values in arrays as logical `OR`.

#### Entries

Currently we do not have filters for the entries, all entries broadcasted.

#### Blocks

   - `account_include` — filter transactions and accounts that use any account from the list
   - `include_transactions` — include all transactions
   - `include_accounts` — include all accounts updates
   - `include_entries` — include all entries

#### Blocks meta

Same as `Blocks` but without `transactions`, `accounts` and entries. Currently we do not have filters for block meta, all messages are broadcasted.

### Limit filters

It's possible to add limits for filters in the config. If `filters` field is omitted then filters doesn't have any limits.

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
         "account_exclude_max": 10,
         "account_required_max": 10
      },
      "blocks": {
         "max": 1,
         "account_include_max": 10,
         "account_include_any": false,
         "account_include_reject": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
         "include_transactions": true,
         "include_accounts" : false,
         "include_entries" : false
      },
      "blocks_meta": {
         "max": 1
      },
      "entry": {
         "max": 1
      }
   }
}
```

### Unary gRPC methods

#### Ping

#### GetLatestBlockhash

#### GetBlockHeight

#### GetSlot

#### IsBlockhashValid

#### GetVersion

### Examples

   - [Go](examples/golang)
   - [Rust](examples/rust)
   - [TypeScript](examples/typescript)

**NOTE**: Some load balancers will terminate gRPC connections if there are no messages sent from the client for a period of time.
In order to mitigate this you need to send a message periodically. The `ping` field in the SubscribeRequest is used for this purpose.
The gRPC server already sends pings to the client, so you can simply reply with a ping and your connection will remain open.
You can see in the rust example how to reply to the ping from the server with the client.

### gRPC Tools

#### Google Pub/Sub

```bash
$ cargo run --bin grpc-google-pubsub -- --help
Yellowstone gRPC Google Pub/Sub Tool

Usage: grpc-google-pubsub [OPTIONS] --config <CONFIG> <COMMAND>

Commands:
  grpc2pubsub        Receive data from gRPC and send them to the Pub/Sub
  pubsub2stdout      Dev: subscribe to message from Pub/Sub and print them to Stdout
  pubsubTopicCreate  Dev: create Pub/Sub topic
  pubsubTopicDelete  Dev: delete Pub/Sub topic
  help               Print this message or the help of the given subcommand(s)

Options:
  -c, --config <CONFIG>          Path to config file
      --prometheus <PROMETHEUS>  Prometheus listen address
  -h, --help                     Print help
  -V, --version                  Print version
```

##### Development

```bash
# export creds
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/google/project/creds.json
# send messages from gRPC to Google Pub/Sub
cargo run --bin grpc-google-pubsub -- --config yellowstone-grpc-tools/config-google-pubsub.json grpc2pubsub
```

with emulator:

```bash
# retrive `USER_CONFIG_DIR`
$ gcloud info --format='get(config.paths.global_config_dir)'
# run emulator, data dir by default: `<USER_CONFIG_DIR>/emulators/pubsub`
$ gcloud beta emulators pubsub start
...
# send serialized gRPC messages to Google Pub/Sub with PUBSUB_EMULATOR_HOST
$ PUBSUB_EMULATOR_HOST=localhost:8085 cargo run --bin grpc-google-pubsub -- --config yellowstone-grpc-tools/config-google-pubsub.json grpc2pubsub
# print type of messages from Google Pub/Sub with PUBSUB_EMULATOR_HOST
$ PUBSUB_EMULATOR_HOST=localhost:8085 cargo run --bin grpc-google-pubsub -- --config yellowstone-grpc-tools/config-google-pubsub.json --prometheus 1 pubsub2stdout
```

#### Kafka

In addition to gRPC Geyser Plugin we provide Kafka tool. This tool can works in 3 modes:

- `grpc2kafka` — connect to gRPC with specified filter and sent all incoming messages to the Kafka
- `dedup` — consume messages from Kafka and sent deduplicated messages to another topic (right now only support `memory` as deduplication backend)
- `kafka2grpc` — provide gRPC endpoint with sending messages from Kafka

```bash
$ cargo run --bin grpc-kafka -- --help
Yellowstone gRPC Kafka Tool

Usage: grpc-kafka [OPTIONS] --config <CONFIG> <COMMAND>

Commands:
  dedup       Receive data from Kafka, deduplicate and send them back to Kafka
  grpc2kafka  Receive data from gRPC and send them to the Kafka
  kafka2grpc  Receive data from Kafka and send them over gRPC
  help        Print this message or the help of the given subcommand(s)

Options:
  -c, --config <CONFIG>          Path to config file
      --prometheus <PROMETHEUS>  Prometheus listen address
  -h, --help                     Print help
  -V, --version                  Print version
```

##### Development

```bash
# run kafka locally
docker-compose -f ./yellowstone-grpc-tools/docker-kafka.yml up
# create topic
kafka_2.13-3.5.0/bin/kafka-topics.sh --bootstrap-server localhost:29092 --create --topic grpc1
# send messages from gRPC to Kafka
cargo run --bin grpc-kafka -- --config yellowstone-grpc-tools/config-kafka.json grpc2kafka
# read messages from Kafka
kafka_2.13-3.5.0/bin/kafka-console-consumer.sh --bootstrap-server localhost:29092 --topic grpc1
```

### License

This project and all source code in this repository is licensed as follows:

   Copyright 2023 Triton One Limited
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

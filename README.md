# solana-transfer

example of transferring lamports (SOL) in solana (rust )between accounts

### Creating the example keypairs:

```shell

solana-keygen new --no-bip39-passphrase -o accounts/john.json

solana-keygen new --no-bip39-passphrase -o transfer-sol/accounts/john.json
```

### Viewing their public keys:

```shell
solana-keygen pubkey transfer-sol/accounts/{NAME}.json
```

```shell
John:       BH8inGCcofjmLrxMagvvuHtMjGgPWK54LdxMKtXvsVW6
Marry:      C3pvdsrU6YFHHDJNadWZuyDE3c6RspqedRB88LRT1NXk
Bob:        AWpuLDvrdroyM5jLEozy3zBq2mtxkPuXCNyFykhvKhHs
Alice:      4DVKqeYiGUcaQBhg11m7s2jKsbdosEapLv99Zj5yv52D
```

### Airdropping:

```shell
solana airdrop --keypair transfer-sol/accounts/john.json 2
```

### Viewing their balances:

```shell
solana account <pubkey>

solana program show --programs 
```

## Run the example:

In one terminal:

```shell
npm run reset-and-build
npm run simulation
```

In another terminal:

```shell
solana logs | grep "<program id> invoke" -A 7
```

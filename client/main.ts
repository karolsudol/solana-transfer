import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {readFileSync} from "fs";
import path from 'path';

const lo = require("buffer-layout");
// const BN = require("bn.js");



/**
 * Vars
 */

const SOLANA_NETWORK = "devnet";

let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;

let aliceKeypair: Keypair;
let bobKeypair: Keypair;
let marryKeypair: Keypair;
let johnKeypair: Keypair;



/**
 * Helper functions.
 */

function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
    )
}


/**
 * Here we are sending lamports using the Rust program we wrote.
 * So this looks familiar. We're just hitting our program with the proper instructions.
 */
async function sendLamports(from: Keypair, to: PublicKey, amount: number) {
    
    let data = Buffer.alloc(8) // 8 bytes
    // lo.ns64("value").encode(new BN(amount), data);
    lo.ns64("value").encode(amount, data);

    let ins = new TransactionInstruction({
        keys: [
            {pubkey: from.publicKey, isSigner: true, isWritable: true},
            {pubkey: to, isSigner: false, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId: programId,
        data: data,
    })

    await sendAndConfirmTransaction(
        connection, 
        new Transaction().add(ins), 
        [from]
    );
}



/**
 * Main
 */

async function main() {
    
    connection = new Connection(
        `https://api.${SOLANA_NETWORK}.solana.com`, 'confirmed'
    );

    programKeypair = createKeypairFromFile(
        path.join(
            path.resolve(__dirname, '../_dist/program'), 
            'program-keypair.json'
        )
    );
    programId = programKeypair.publicKey;

    // Our sample members are Ringo, George, Paul & John.
    bobKeypair = createKeypairFromFile(__dirname + "/../accounts/bob.json");
    marryKeypair = createKeypairFromFile(__dirname + "/../accounts/marry.json");
    aliceKeypair = createKeypairFromFile(__dirname + "/../accounts/alice.json");
    johnKeypair = createKeypairFromFile(__dirname + "/../accounts/john.json");
    
    // airdropping
    // await connection.confirmTransaction(
    //     await connection.requestAirdrop(
    //         paulKeypair.publicKey,
    //         LAMPORTS_PER_SOL,
    //     )
    // );
    // await connection.confirmTransaction(
    //     await connection.requestAirdrop(
    //         johnKeypair.publicKey,
    //         LAMPORTS_PER_SOL,
    //     )
    // );

    // John sends some SOL to Bob.
    console.log("John sends some SOL to Bob...");
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    console.log(`   Bob's public key: ${bobKeypair.publicKey}`);
    await sendLamports(johnKeypair, bobKeypair.publicKey, 5000000);

    // Marry sends some SOL to Alice.
    console.log("Marry sends some SOL to Alice...");
    console.log(`   Marry's public key: ${marryKeypair.publicKey}`);
    console.log(`   Alice's public key: ${aliceKeypair.publicKey}`);
    await sendLamports(marryKeypair, aliceKeypair.publicKey, 4000000);

    // Alice sends some SOL over to John.
    console.log("Bob sends some SOL over to John...");
    console.log(`   Alice's public key: ${aliceKeypair.publicKey}`);
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    await sendLamports(aliceKeypair, johnKeypair.publicKey, 2000000);
}


main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
  );
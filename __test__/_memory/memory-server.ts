import { MongoClient, Db } from 'mongodb';
import {DB} from "@/lib/mongoDB/const";
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet: MongoMemoryReplSet;
let client: MongoClient;
let db: Db;

export async function setupMemoryMongo() {
    replSet = await MongoMemoryReplSet.create({
        replSet: { storageEngine: 'wiredTiger' },
    });

    const uri = replSet.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(DB);
    return { db, client };
}

export async function teardownMemoryMongo() {
    await client?.close();
    await replSet?.stop();
}

export function getClient() {
    return client;
}

export function getDb() {
    return db;
}

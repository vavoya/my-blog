import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_TOKEN!;
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client = globalForMongo._mongoClient ?? await MongoClient.connect(uri);

if (process.env.NODE_ENV === "development") {
    globalForMongo._mongoClient = client;
}

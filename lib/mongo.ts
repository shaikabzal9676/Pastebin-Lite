// lib/mongo.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
const client = new MongoClient(uri);


let clientPromise: Promise<MongoClient>;

if (!globalThis.mongoClientPromise) {
  globalThis.mongoClientPromise = client.connect();
}

clientPromise = globalThis.mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("pastebin");
}

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Init cache if it doesn't exist
const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalCache.mongooseCache) {
  globalCache.mongooseCache = {
    conn: null,
    promise: null,
  };
}

const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (globalCache.mongooseCache?.conn) {
    return globalCache.mongooseCache.conn;
  }

  if (!globalCache.mongooseCache?.promise) {
    globalCache.mongooseCache!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalCache.mongooseCache!.conn = await globalCache.mongooseCache!.promise;
  return globalCache.mongooseCache!.conn;
};

export default connectToDatabase;

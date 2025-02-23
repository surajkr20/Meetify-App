import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your environment variables for database connection.");
}

// Use globalThis to store cache
let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    
    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default dbConnect;

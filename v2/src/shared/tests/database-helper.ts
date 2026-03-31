import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

export const MongoTestHelper = {
    connect: async () => {
        // Evitar que abra vários servidores se o connect for chamado várias vezes
        if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
            return;
        }

        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    },

    disconnect: async () => {
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    },

    clearDatabase: async () => {
        if (mongoose.connection.readyState !== 1) {
            return;
        }
        
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            if (collection) {
                await collection.deleteMany({});
            }
        }
    },
};

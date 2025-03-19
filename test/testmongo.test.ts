import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Create MongoDB instance
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: "jest-test-db",
    },
  });

  // Get connection string
  const mongoUri = mongoServer.getUri();

  // Connect to in-memory database
  await mongoose.connect(mongoUri, {
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 3000,
  });
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Clean up after tests
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

// Remove example test - this should be in a separate test file

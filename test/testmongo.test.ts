import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

/*
MongoMemory needs these deps:
openssl, libssl-dev
*/

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

describe("MongoDB Memory Server", () => {
  it("should connect to database and perform basic operations", async () => {
    const testCollection = mongoose.connection.collection("test");

    await testCollection.insertOne({ name: "test", value: 123 });

    const doc = await testCollection.findOne({ name: "test" });

    expect(doc).toBeDefined();
    expect(doc?.name).toBe("test");
    expect(doc?.value).toBe(123);

    const count = await testCollection.countDocuments();
    expect(count).toBe(1);

    await testCollection.deleteMany({});
    const newCount = await testCollection.countDocuments();
    expect(newCount).toBe(0);
  });
});

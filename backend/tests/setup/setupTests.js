/**
 * Test Setup File
 * 
 * Global setup for Jest tests including:
 * - MongoDB Memory Server setup
 * - Redis Mock setup
 * - Environment variables
 * - Global mocks
 * - Test utilities
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Setup MongoDB Memory Server before all tests
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB Memory Server');
});

/**
 * Cleanup after each test
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

/**
 * Cleanup after all tests
 */
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('✓ Disconnected from MongoDB Memory Server');
});

/**
 * Mock Redis Client
 */
jest.mock('../../database/redis', () => {
  const mockData = new Map();
  return {
    get: jest.fn((key) => Promise.resolve(mockData.get(key) || null)),
    set: jest.fn((key, value) => {
      mockData.set(key, value);
      return Promise.resolve('OK');
    }),
    setEx: jest.fn((key, ttl, value) => {
      mockData.set(key, value);
      return Promise.resolve('OK');
    }),
    del: jest.fn((key) => {
      mockData.delete(key);
      return Promise.resolve(1);
    }),
    connect: jest.fn(() => Promise.resolve()),
    quit: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
  };
});

/**
 * Mock S3 Client
 */
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
  DeleteObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  HeadObjectCommand: jest.fn(),
  PutObjectCommand: jest.fn(),
}));

/**
 * Mock multer-s3
 */
jest.mock('multer-s3', () => jest.fn());

/**
 * Mock Nodemailer
 */
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((mailOptions, callback) => {
      callback(null, { messageId: 'test-message-id' });
    }),
  })),
}));

/**
 * Mock ElevenLabs
 */
jest.mock('@elevenlabs/elevenlabs-js', () => ({
  ElevenLabsClient: jest.fn(() => ({
    textToSpeech: {
      convert: jest.fn(() => Promise.resolve({
        pipe: jest.fn(),
      })),
    },
    voices: {
      add: jest.fn(() => Promise.resolve({ voice_id: 'test-voice-id' })),
    },
  })),
}));

/**
 * Mock Google Generative AI
 */
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(() => Promise.resolve({
        response: {
          text: jest.fn(() => 'Mock AI response'),
        },
      })),
      generateContentStream: jest.fn(() => ({
        stream: {
          [Symbol.asyncIterator]: async function* () {
            yield { text: () => 'Mock stream chunk' };
          },
        },
      })),
      startChat: jest.fn(() => ({
        sendMessage: jest.fn(() => Promise.resolve({
          response: {
            text: jest.fn(() => 'Mock chat response'),
          },
        })),
      })),
    })),
  })),
}));

/**
 * Mock Socket.io
 */
jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({
    on: jest.fn(),
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
    emit: jest.fn(),
  })),
}));

/**
 * Global test utilities
 */
global.testUtils = {
  createObjectId: () => new mongoose.Types.ObjectId(),
  createObjectIds: (count) => Array.from({ length: count }, () => new mongoose.Types.ObjectId()),
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  randomString: (length = 10) => Math.random().toString(36).substring(2, length + 2),
  randomNumber: (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
  randomEmail: () => `test-${Math.random().toString(36).substring(7)}@example.com`,
  randomPhone: () => '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
  
  /**
   * Create test user helper
   */
  createTestUser: async (overrides = {}) => {
    const User = require('../../models/User.model');
    const defaultUser = {
      email: global.testUtils.randomEmail(),
      password: 'Test123!@#',
      name: 'Test User',
      ...overrides,
    };
    return await User.create(defaultUser);
  },

  /**
   * Create authenticated request mock
   */
  createAuthRequest: (user) => ({
    user,
    headers: {},
    body: {},
    query: {},
    params: {},
  }),

  /**
   * Create response mock
   */
  createResponse: () => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
      json: jest.fn(() => res),
      cookie: jest.fn(() => res),
      clearCookie: jest.fn(() => res),
      setHeader: jest.fn(() => res),
      write: jest.fn(() => res),
      end: jest.fn(() => res),
      redirect: jest.fn(() => res),
      headersSent: false,
    };
    return res;
  },

  /**
   * Create next function mock
   */
  createNext: () => jest.fn(),
};

/**
 * Mock environment variables
 */


/**
 * Custom matchers
 */
expect.extend({
  toBeValidObjectId(received) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to be a valid ObjectId`
        : `expected ${received} to be a valid ObjectId`
    };
  },

  toHaveBeenCalledWithError(received, errorMessage) {
    const calls = received.mock.calls;
    const pass = calls.some(call => 
      call[0] instanceof Error && call[0].message.includes(errorMessage)
    );
    return {
      pass,
      message: () => pass
        ? `expected not to have been called with error containing "${errorMessage}"`
        : `expected to have been called with error containing "${errorMessage}"`
    };
  },
});

console.log('✓ Test setup complete');
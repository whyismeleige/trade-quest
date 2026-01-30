/**
 * Jest Configuration
 * 
 * Configuration for running unit and integration tests for the Code Sprint backend
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.js'],

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'models/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/database/**',
    '!**/config/**',
    '!server.js'
  ],

  // Coverage thresholds (adjusted for hackathon context)
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 65,
      lines: 70,
      statements: 70
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Test timeout (increased for integration tests)
  testTimeout: 15000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles (async operations)
  detectOpenHandles: true,

  // Run tests in band (sequentially) to avoid conflicts
  maxWorkers: 1,

  // Mock file paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)'
  ],

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Collect coverage from all files
  collectCoverage: false, // Enable with --coverage flag

  // Bail after first test failure (useful for CI/CD)
  bail: false,

  // Error on deprecated APIs
  errorOnDeprecated: true,

  // Notify on completion
  notify: false,

  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/.next/',
    '/dist/'
  ]
};
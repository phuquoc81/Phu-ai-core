'use strict';

process.env.NODE_ENV      = 'test';
process.env.JWT_SECRET    = 'test_jwt_secret_for_ci';
process.env.MONGODB_URI   = 'mongodb://localhost:27017/phuai_test';
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';

const request = require('supertest');

// Mock mongoose so tests run without a real MongoDB
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(undefined),
  };
});

// Mock config/stripe to avoid real Stripe SDK init errors
jest.mock('../config/stripe', () => ({
  customers:      { create: jest.fn(), retrieve: jest.fn() },
  checkout:       { sessions: { create: jest.fn() } },
  billingPortal:  { sessions: { create: jest.fn() } },
  webhooks:       { constructEvent: jest.fn() },
}));

// Mock models
jest.mock('../models/User',    () => { const m = { findById: jest.fn(), findOne: jest.fn(), create: jest.fn(), countDocuments: jest.fn() }; return m; });
jest.mock('../models/Team',    () => ({ findOne: jest.fn(), findById: jest.fn(), create: jest.fn() }));
jest.mock('../models/Usage',   () => ({ create: jest.fn(), find: jest.fn(), countDocuments: jest.fn(), aggregate: jest.fn() }));
jest.mock('../models/Invoice', () => ({ find: jest.fn(), findOne: jest.fn(), aggregate: jest.fn() }));

const app = require('../server');

describe('Health check', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth endpoints', () => {
  const User = require('../models/User');

  beforeEach(() => jest.clearAllMocks());

  test('POST /api/ai/register — validates email', async () => {
    const res = await request(app)
      .post('/api/ai/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'password123' });
    expect(res.status).toBe(422);
  });

  test('POST /api/ai/register — validates password length', async () => {
    const res = await request(app)
      .post('/api/ai/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'short' });
    expect(res.status).toBe(422);
  });

  test('POST /api/ai/login — invalid credentials returns 401', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = await request(app)
      .post('/api/ai/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('Protected routes without token', () => {
  test('GET /api/usage/balance — returns 401', async () => {
    const res = await request(app).get('/api/usage/balance');
    expect(res.status).toBe(401);
  });

  test('POST /api/stripe/checkout — returns 401', async () => {
    const res = await request(app).post('/api/stripe/checkout').send({ plan: 'pro' });
    expect(res.status).toBe(401);
  });

  test('GET /api/team — returns 401', async () => {
    const res = await request(app).get('/api/team');
    expect(res.status).toBe(401);
  });
});

describe('Web3 token info', () => {
  test('GET /api/web3/token-info — returns token metadata', async () => {
    const res = await request(app).get('/api/web3/token-info');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('PHU81');
    expect(res.body.network).toBe('Polygon');
  });
});

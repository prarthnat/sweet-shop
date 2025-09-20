const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    // RED: Test should fail initially
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();

      // Verify user was saved to database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.username).toBe(userData.username);
    });

    test('should return error for duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      // Create user first
      await request(app).post('/api/auth/register').send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, username: 'differentuser' })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('email already exists');
    });

    test('should return error for duplicate username', async () => {
      const userData1 = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'Password123'
      };

      const userData2 = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'Password123'
      };

      await request(app).post('/api/auth/register').send(userData1);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('username already exists');
    });

    test('should return validation errors for invalid input', async () => {
      const invalidData = {
        username: 'ab', // Too short
        email: 'invalid-email', // Invalid email
        password: '123' // Too short and missing requirements
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toHaveLength(3);
    });

    test('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.errors).toHaveLength(3);
    });

    test('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const user = await User.findOne({ email: userData.email }).select('+password');
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;

    beforeEach(async () => {
      // Create a test user
      testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.password).toBeUndefined();
    });

    test('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should return error for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should return validation errors for invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: ''
        })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.errors).toHaveLength(2);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      authToken = response.body.token;
    });

    test('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.username).toBe(testUser.username);
      expect(response.body.user.password).toBeUndefined();
    });

    test('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('No token provided');
    });

    test('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('PUT /api/auth/me', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      authToken = response.body.token;
    });

    test('should update username successfully', async () => {
      const newUsername = 'updateduser';

      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: newUsername })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.user.username).toBe(newUsername);
    });

    test('should return error for duplicate username', async () => {
      // Create another user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'Password123'
        });

      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'existinguser' })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('already taken');
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      authToken = response.body.token;
    });

    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Logout successful');
    });
  });
});
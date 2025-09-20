const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

describe('Sweets Endpoints', () => {
  let userToken, adminToken;
  let regularUser, adminUser;

  beforeEach(async () => {
    // Create regular user
    regularUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123'
    };

    let response = await request(app)
      .post('/api/auth/register')
      .send(regularUser);
    userToken = response.body.token;

    // Create admin user
    adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'Password123'
    };

    response = await request(app)
      .post('/api/auth/register')
      .send(adminUser);
    adminToken = response.body.token;

    // Make second user admin
    await User.findOneAndUpdate(
      { email: adminUser.email },
      { isAdmin: true }
    );
  });

  describe('GET /api/sweets', () => {
    test('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
      expect(response.body.results).toBe(0);
    });

    test('should return all sweets with pagination', async () => {
      // Create test sweets
      const admin = await User.findOne({ email: adminUser.email });
      const sweetData = [
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 10, createdBy: admin._id },
        { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 15, createdBy: admin._id }
      ];

      await Sweet.insertMany(sweetData);

      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.results).toBe(2);
      expect(response.body.pagination.total).toBe(2);
    });

    test('should handle pagination correctly', async () => {
      // Create multiple sweets
      const admin = await User.findOne({ email: adminUser.email });
      const sweets = Array.from({ length: 15 }, (_, i) => ({
        name: `Sweet ${i + 1}`,
        category: 'Chocolate',
        price: 1.99,
        quantity: 5,
        createdBy: admin._id
      }));

      await Sweet.insertMany(sweets);

      const response = await request(app)
        .get('/api/sweets?page=2&limit=5')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.pagination.pages).toBe(3);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      const sweetData = [
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.50, quantity: 8, createdBy: admin._id },
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.99, quantity: 12, createdBy: admin._id },
        { name: 'Sour Gummies', category: 'Gummy', price: 1.50, quantity: 20, createdBy: admin._id },
        { name: 'Hard Candy Mix', category: 'Hard Candy', price: 4.99, quantity: 5, createdBy: admin._id }
      ];

      await Sweet.insertMany(sweetData);
    });

    test('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(sweet => 
        sweet.name.toLowerCase().includes('chocolate')
      )).toBe(true);
    });

    test('should filter by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('Gummy');
    });

    test('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.every(sweet => 
        sweet.price >= 2 && sweet.price <= 4
      )).toBe(true);
    });

    test('should combine multiple search filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate&category=Chocolate&maxPrice=3')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Milk Chocolate');
    });
  });

  describe('POST /api/sweets', () => {
    test('should create sweet with admin token', async () => {
      const sweetData = {
        name: 'New Chocolate',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10,
        description: 'Delicious chocolate bar'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(sweetData.name);
      expect(response.body.data.createdBy.username).toBe(adminUser.username);

      // Verify sweet was saved to database
      const savedSweet = await Sweet.findOne({ name: sweetData.name });
      expect(savedSweet).toBeTruthy();
    });

    test('should reject creation with regular user token', async () => {
      const sweetData = {
        name: 'New Chocolate',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Admin access required');
    });

    test('should reject creation without token', async () => {
      const sweetData = {
        name: 'New Chocolate',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.status).toBe('fail');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should validate category enum', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'InvalidCategory',
        price: 2.99,
        quantity: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.errors.some(err => 
        err.msg.includes('Invalid category')
      )).toBe(true);
    });

    test('should validate price range', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Chocolate',
        price: -1,
        quantity: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let testSweet;

    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      testSweet = new Sweet({
        name: 'Original Sweet',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10,
        createdBy: admin._id
      });
      await testSweet.save();
    });

    test('should update sweet with admin token', async () => {
      const updateData = {
        name: 'Updated Sweet',
        price: 3.99
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);

      // Verify update in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet.name).toBe(updateData.name);
    });

    test('should reject update with regular user token', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(403);

      expect(response.body.status).toBe('fail');
    });

    test('should return 404 for non-existent sweet', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/sweets/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let testSweet;

    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      testSweet = new Sweet({
        name: 'Sweet to Delete',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10,
        createdBy: admin._id
      });
      await testSweet.save();
    });

    test('should delete sweet with admin token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Sweet deleted successfully');

      // Verify deletion from database
      const deletedSweet = await Sweet.findById(testSweet._id);
      expect(deletedSweet).toBeNull();
    });

    test('should reject deletion with regular user token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.status).toBe('fail');

      // Verify sweet still exists
      const existingSweet = await Sweet.findById(testSweet._id);
      expect(existingSweet).toBeTruthy();
    });

    test('should return 404 for non-existent sweet', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/sweets/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let testSweet;

    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      testSweet = new Sweet({
        name: 'Sweet to Purchase',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10,
        createdBy: admin._id
      });
      await testSweet.save();
    });

    test('should purchase sweet successfully', async () => {
      const purchaseData = { quantity: 3 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.purchase.quantity).toBe(3);
      expect(response.body.data.remainingStock).toBe(7);

      // Verify stock reduction in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet.quantity).toBe(7);
    });

    test('should reject purchase without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .send({ quantity: 3 })
        .expect(401);

      expect(response.body.status).toBe('fail');
    });

    test('should reject purchase with insufficient stock', async () => {
      const purchaseData = { quantity: 15 }; // More than available

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('available in stock');

      // Verify stock unchanged
      const unchangedSweet = await Sweet.findById(testSweet._id);
      expect(unchangedSweet.quantity).toBe(10);
    });

    test('should reject purchase with invalid quantity', async () => {
      const purchaseData = { quantity: 0 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Validation failed');
    });

    test('should handle out of stock sweet', async () => {
      // Set stock to 0
      await Sweet.findByIdAndUpdate(testSweet._id, { quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('0 items available');
    });

    test('should return 404 for non-existent sweet', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post(`/api/sweets/${nonExistentId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(404);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let testSweet;

    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      testSweet = new Sweet({
        name: 'Sweet to Restock',
        category: 'Chocolate',
        price: 2.99,
        quantity: 5,
        createdBy: admin._id
      });
      await testSweet.save();
    });

    test('should restock sweet with admin token', async () => {
      const restockData = { quantity: 10 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.newQuantity).toBe(15);

      // Verify stock increase in database
      const restockedSweet = await Sweet.findById(testSweet._id);
      expect(restockedSweet.quantity).toBe(15);
    });

    test('should reject restock with regular user token', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(403);

      expect(response.body.status).toBe('fail');

      // Verify stock unchanged
      const unchangedSweet = await Sweet.findById(testSweet._id);
      expect(unchangedSweet.quantity).toBe(5);
    });

    test('should reject restock with invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.status).toBe('fail');
    });

    test('should return 404 for non-existent sweet', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post(`/api/sweets/${nonExistentId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 })
        .expect(404);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/sweets/purchases/history', () => {
    let testSweet;
    let Purchase;

    beforeEach(async () => {
      Purchase = require('../models/Purchase');
      const admin = await User.findOne({ email: adminUser.email });
      const user = await User.findOne({ email: regularUser.email });
      
      testSweet = new Sweet({
        name: 'Sweet for History',
        category: 'Chocolate',
        price: 2.99,
        quantity: 20,
        createdBy: admin._id
      });
      await testSweet.save();

      // Make some test purchases
      await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });
    });

    test('should return user purchase history', async () => {
      const response = await request(app)
        .get('/api/sweets/purchases/history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.results).toBe(2);
      expect(response.body.pagination.total).toBe(2);
    });

    test('should return empty array for user with no purchases', async () => {
      const response = await request(app)
        .get('/api/sweets/purchases/history')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(0);
      expect(response.body.results).toBe(0);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sweets/purchases/history')
        .expect(401);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/sweets/:id/stats', () => {
    let testSweet;

    beforeEach(async () => {
      const admin = await User.findOne({ email: adminUser.email });
      
      testSweet = new Sweet({
        name: 'Sweet for Stats',
        category: 'Chocolate',
        price: 2.99,
        quantity: 20,
        createdBy: admin._id
      });
      await testSweet.save();

      // Make some purchases for statistics
      await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });
    });

    test('should return sweet statistics with admin token', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet._id}/stats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.sweet.name).toBe(testSweet.name);
      expect(response.body.data.statistics.totalQuantitySold).toBe(5);
      expect(response.body.data.statistics.purchaseCount).toBe(2);
    });

    test('should reject stats request with regular user token', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet._id}/stats`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.status).toBe('fail');
    });

    test('should return 404 for non-existent sweet', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/sweets/${nonExistentId}/stats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.status).toBe('fail');
    });
  });
});
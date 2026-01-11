import request from 'supertest';
import app from '../server.js';

describe('Restaurant Reservation System', () => {
  let restaurantId;
  let tableId;

  it('should create a restaurant', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants/create')
      .send({
        name: 'Test Bistro',
        opensAt: 10,
        closesAt: 22
      })
      .expect(201);

    restaurantId = res.body.id;
  });

  it('should create a table for the restaurant', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants/createTable')
      .send({
        restaurantId,
        number: 1,
        capacity: 4
      })
      .expect(201);

    tableId = res.body.id;
  });

  it('should create a reservation during operating hours', async () => {
    const startTime = new Date();
    startTime.setHours(19, 0, 0, 0); // 7 PM

    const res = await request(app)
      .post('/api/v1/reservations/createReservation')
      .send({
        restaurantId,
        customerName: 'Alice',
        phone: '1234567890',
        partySize: 4,
        startTime: startTime.toISOString(),
        duration: 120
      })
      .expect(201);

    expect(res.body.status).toBe('CONFIRMED');
  });

  it('should reject overlapping reservation', async () => {
    const startTime = new Date();
    startTime.setHours(19, 30, 0, 0);

    await request(app)
      .post('/api/v1/reservations/createReservation')
      .send({
        restaurantId,
        customerName: 'Bob',
        phone: '0987654321',
        partySize: 4,
        startTime: startTime.toISOString(),
        duration: 60
      })
      .expect(409);
  });

  it('should reject long reservation during peak hours', async () => {
    const startTime = new Date();
    startTime.setHours(18, 0, 0, 0); // 6 PM

    await request(app)
      .post('/api/v1/reservations/createReservation')
      .send({
        restaurantId,
        customerName: 'Charlie',
        phone: '1112223333',
        partySize: 2,
        startTime: startTime.toISOString(),
        duration: 120
      })
      .expect(400);
  });
});


it('should reject party larger than table capacity', async () => {
  const startTime = new Date();
  startTime.setHours(20, 0, 0, 0);

  await request(app)
    .post('/api/v1/reservations/createReservation')
    .send({
      restaurantId,
      customerName: 'Big Group',
      phone: '9999999999',
      partySize: 6,
      startTime: startTime.toISOString(),
      duration: 60
    })
    .expect(400);
});

// End of tests
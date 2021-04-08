import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import bcrypt from "bcryptjs"
import {
    connectToDatabase,
    closeDatabase,
    clearDatabase,
  } from '../../utils/database';
  
  beforeAll(() => {
    return connectToDatabase();
  });
  
  afterEach(() => {
    return clearDatabase();
  });
  
  afterAll(() => {
    return closeDatabase();
  });
  
  jest.mock('../../middleware/verifyToken', () =>
    jest.fn((req, res, next) => {
      next();
    }),
  );

const user1 = {
    username:'koosha',
    email: 'kooshaala@gmail.com',
    password: 'Welcome123'
}

describe('authentication endpoints', () => {
    test('should save the user in database after signup', async () => {
        const res = await request(app).post('/api/signup').send(user1);    
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('user');
        const user = await User.findOne({ email: user1.email });
        expect(user.username).toBeTruthy();
        expect(user.email).toBeTruthy();
        expect(user.password).toBeTruthy();
    });

    test('should login the signedup user', async () => {
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(user1.password, salt)
        const user = await User.create({...user1, password: hashedPw});
        console.log(user)
        let res = await request(app)
        .post('/api/login')
        .send({password: user1.password, email: user1.email});
        expect(res.statusCode).toEqual(200);
        expect(user.email).toBeTruthy();
        expect(user.password).toBeTruthy();
    });
});

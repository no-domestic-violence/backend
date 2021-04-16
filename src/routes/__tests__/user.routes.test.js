import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';
import { mockUserWithContact, mockContact } from '../../models/__mocks__/user';
import { verifyToken } from '../../middleware';

jest.mock('../../middleware/verifyToken', () =>
  jest.fn((req, res, next) => {
    next();
  }),
);

beforeAll(() => {
  connectToDatabase();
});

afterEach(() => {
  clearDatabase();
});

afterAll(() => {
  closeDatabase();
});

describe('User endpoints', () => {
  let createdUser;
  let contactId;
  let username;

  beforeEach(async () => {
    createdUser = await User.create(mockUserWithContact);
    contactId = createdUser.contacts[0]._id;
    username = createdUser.username;
  });

  test('should get all contacts of a user with GET request', async () => {
    await request(app)
      .get(`/api/users/${username}/contacts`)
      .expect(200)
      .then(res => {
        expect(res.body.contacts[0].name).toBe(createdUser.contacts[0].name);
        expect(res.body.contacts[0].phone).toBe(createdUser.contacts[0].phone);
        expect(res.body.contacts[0].message).toBe(
          createdUser.contacts[0].message,
        );
      });
  });

  test('should call verifyToken middleware with GET request', async () => {
    await request(app).get(`/api/users/${username}/contacts`);
    expect(verifyToken).toBeCalledTimes(1);
  });

  test('should respond with an error when getting contacts of nonexistent user', async () => {
    await request(app)
      .get(`/api/users/invalidusername/contacts`)
      .expect(404);
  });

  test('should throw bad request error if required field for a contact is missing when adding or editing the contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts`)
      .send({})
      .expect(400);
  });

  test('should successfully add a contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts`)
      .send(mockContact)
      .expect(201)
      .then(res => {
        expect(res.body[1].name).toBe(mockContact.name);
        expect(res.body[1].phone).toBe(mockContact.phone);
        expect(res.body[1].message).toBe(mockContact.message);
        expect(res.body.length).toBe(2);
      });
  });

  test('should call verifyToken middleware when adding a contact', async () => {
    await request(app).patch(`/api/users/${username}/contacts`);
    expect(verifyToken).toBeCalledTimes(1);
  });

  test('should respond with an error when adding a contact on nonexistent user', async () => {
    await request(app)
      .patch(`/api/users/invalidusername/contacts`)
      .send(mockContact)
      .expect(404);
  });

  test('should successfully edit a contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts/${contactId}`)
      .send(mockContact)
      .expect(201)
      .then(res => {
        expect(res.body[0].name).toBe(mockContact.name);
        expect(res.body[0].phone).toBe(mockContact.phone);
        expect(res.body[0].message).toBe(mockContact.message);
      });
  });

  test('should call verifyToken middleware when editing a contact', async () => {
    await request(app).patch(`/api/users/${username}/contacts/${contactId}`);
    expect(verifyToken).toBeCalledTimes(1);
  });

  test('should respond with an error when editing not existing contact', async () => {
    const invalidContactId = '6062e6501e80a94test40522';
    const res = await request(app)
      .patch(`/api/users/${username}/contacts/${invalidContactId}`)
      .send(mockContact)
      .expect(404);
  });

  test('should successfully delete contact', async () => {
    await request(app)
      .delete(`/api/users/${username}/contacts/${contactId}`)
      .expect(202);
  });

  test('should call verifyToken middleware when deleting a contact', async () => {
    await request(app).delete(`/api/users/${username}/contacts/${contactId}`);
    expect(verifyToken).toBeCalledTimes(1);
  });

  test('should respond with an error when deleting not existing contact', async () => {
    const invalidContactId = '6062e6501e80a94test40522';
    await request(app)
      .delete(`/api/users/${username}/contacts/${invalidContactId}`)
      .expect(404);
  });
});

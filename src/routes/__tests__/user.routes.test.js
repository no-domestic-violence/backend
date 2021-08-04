import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';
import { mockUserWithContact, mockContact } from '../../models/__mocks__/user';

const mockToken = jwt.sign(
  {
    _id: mockUserWithContact._id,
    email: mockUserWithContact.email,
    username: mockUserWithContact.username,
    role: mockUserWithContact.role,
  },
  process.env.JWT_ACCESS_TOKEN_SECRET,
  { expiresIn: '1m' },
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
      .set({ authorization: `Bearer ${mockToken}` })
      .expect(200)
      .then(res => {
        expect(res.body.contacts[0].name).toBe(createdUser.contacts[0].name);
        expect(res.body.contacts[0].phone).toBe(createdUser.contacts[0].phone);
        expect(res.body.contacts[0].message).toBe(
          createdUser.contacts[0].message,
        );
      });
  });

  test('should respond with an error when getting contacts without access token', async () => {
    const res = await request(app).get(`/api/users/${username}/contacts`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when getting contacts with invalid auth token', async () => {
    const res = await request(app)
      .get(`/api/users/${username}/contacts`)
      .set({ authorization: 'invalidtoken' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should successfully add a contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send(mockContact)
      .expect(201)
      .then(res => {
        expect(res.body.contacts[1].name).toBe(mockContact.name);
        expect(res.body.contacts[1].phone).toBe(mockContact.phone);
        expect(res.body.contacts[1].message).toBe(mockContact.message);
        expect(res.body.contacts.length).toBe(2);
      });
  });

  test('should respond with error when adding contact without auth token', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .send(mockContact);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when adding contact with invalid auth token', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: 'invalidtoken' })
      .send(mockContact);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should successfully edit a contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts/${contactId}`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send(mockContact)
      .expect(201)
      .then(res => {
        expect(res.body.contacts[0].name).toBe(mockContact.name);
        expect(res.body.contacts[0].phone).toBe(mockContact.phone);
        expect(res.body.contacts[0].message).toBe(mockContact.message);
      });
  });

  test('should respond with error when editing contact without auth token', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts/${contactId}`)
      .send(mockContact);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when editing contact with invalid auth token', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts/${contactId}`)
      .set({ authorization: 'invalidtoken' })
      .send(mockContact);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when editing contact with invalid objectId', async () => {
    const invalidContactId = '6062e6501e80a94test40522';
    const res = await request(app)
      .patch(`/api/users/${username}/contacts/${invalidContactId}`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send(mockContact);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Contact does not exist');
  });

  test('should respond with an error when editing contact of not existing user', async () => {
    const contactId = '6062e6501e80a94123440522';
    const res = await request(app)
      .patch(`/api/users/fakeuserfake/contacts/${contactId}`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send(mockContact);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual(
      'User with provided contact does not exist',
    );
  });

  test('should successfully delete contact', async () => {
    await request(app)
      .delete(`/api/users/${username}/contacts/${contactId}`)
      .set({ authorization: `Bearer ${mockToken}` })
      .expect(202);
  });

  test('should respond with error when deleting contact without auth token', async () => {
    const res = await request(app).delete(
      `/api/users/${username}/contacts/${contactId}`,
    );
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when deleting contact with invalid auth token', async () => {
    const res = await request(app)
      .delete(`/api/users/${username}/contacts/${contactId}`)
      .set({ authorization: 'invalidtoken' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual('Invalid token');
  });

  test('should respond with an error when deleting contact with invalid objectId format', async () => {
    const invalidContactId = '6062e6501e80a94test40522';
    const res = await request(app)
      .delete(`/api/users/${username}/contacts/${invalidContactId}`)
      .set({ authorization: `Bearer ${mockToken}` });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual('Contact does not exist');
  });

  test('should respond with an error when deleting contact of not existing user', async () => {
    const contactId = '6062e6501e80a94123440522';
    const res = await request(app)
      .delete(`/api/users/fakeuserfake/contacts/${contactId}`)
      .set({ authorization: `Bearer ${mockToken}` });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual(
      'User with provided contact does not exist',
    );
  });

  test('should throw bad request error if required field for a contact is missing when adding a contact', async () => {
    await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({})
      .expect(400);
  });
  test('should respond with error when adding contact with empty name', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: '',
        phone: '12341234123',
        message: 'help',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid value');
  });

  test('should respond with error when adding contact with invalid name format', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: '<>d$02@4%^^^^',
        phone: '12341234123',
        message: 'help',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid name format');
  });

  test('should respond with error when adding contact with invalid name length', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: 'lorem ipsum hello this is a name hi test tezt testtestetsete',
        phone: '12341234123',
        message: 'help',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      'Name must be between 1 and 16 characters',
    );
  });

  test('should respond with error when adding contact with invalid phone number format', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: 'contact',
        phone: '<>d$02@4%^^^^@!#$',
        message: 'help',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid phone number format');
  });

  test('should respond with error when adding contact with phone number that exceeds valid length', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: 'contact',
        phone: '12387878787877887878',
        message: 'help me ',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Phone number should be max 15 digits');
  });

  test('should respond with error when adding contact with message that exceeds 25 characters', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: 'contact',
        phone: '015735137532',
        message:
          'help lorem ipsum hello refactoring second edition fully revised and updated includes factory calander',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      'Message must be between 1 and 25 characters',
    );
  });

  test('should respond with error when adding contact with invalid message format', async () => {
    const res = await request(app)
      .patch(`/api/users/${username}/contacts`)
      .set({ authorization: `Bearer ${mockToken}` })
      .send({
        name: 'contact',
        phone: '015735137532',
        message: '^$%*!(#)F(#*$kldfjlajfkldsjf#$)!@%U(+~',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid message format');
  });
});

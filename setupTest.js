import mongoose from 'mongoose';

afterEach(async done => {
  await mongoose.disconnect();
  return done();
});
afterAll(done => {
  return done();
});

jest.setTimeout(30000);
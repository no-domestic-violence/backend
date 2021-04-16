export const mockBasicUser = {
  _id: 'test_user_id_1',
  username: 'test_user_1',
  email: 'testuser1@test.com',
  password: 'testpassword',
  contacts: [
    {
      name: 'test_contact',
      phone: '012345787933',
      message: 'test',
    },
  ],
  role: 'basic',
};
export const mockAuthor = {
  _id: 'test_user_id_2',
  username: 'test_user_2',
  email: 'testuser2@test.com',
  password: 'testpassword',
  contacts: [
    {
      name: 'test_contact',
      phone: '012345787933',
      message: 'test',
    },
  ],
  role: 'editor',
};
export const mockAdmin = {
  _id: 'test_admin_id',
  username: 'test_admin',
  email: 'testadmin@test.com',
  password: 'testpassword',
  contacts: [],
  role: 'admin',
};

export const mockAuthorId = 'test_user_id_2';

export const mockUser = {
  username: 'testname',
  email: 'thisistest@test.com',
  password: 'testpassword',
};

export const mockUserWithoutUsername = {
  email: 'testemail@email.com',
  password: 'testpassword',
};

export const mockUserWithoutEmail = {
  username: 'hello',
  password: 'testpassword',
};

export const mockUserWithoutPassword = {
  username: 'tester',
  email: 'testemail1@email.com',
};

export const mockUserWithContact = {
  username: 'seedUser',
  email: 'seeduser1@test.com',
  password: 'testpassword',
  contacts: [
    {
      name: 'test_contact',
      phone: '012345787933',
      message: 'test',
    },
  ],
};

export const mockContact = {
  name: 'contact',
  phone: '12341234123',
  message: 'help me',
};

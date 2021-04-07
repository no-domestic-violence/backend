export const mockedUser = {
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
export const mockedAuthor = {
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
export const mockedAdmin = {
  _id: 'test_admin_id',
  username: 'test_admin',
  email: 'testadmin@test.com',
  password: 'testpassword',
  contacts: [],
  role: 'admin',
};

export const mockedAuthorId = 'test_user_id_2';

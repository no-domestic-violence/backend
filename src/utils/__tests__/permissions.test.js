import {
  hasDeleteArticlePermission,
  hasCreateArticlePermission,
  hasEditArticlePermission,
} from '../permissions';

const mockedUser = {
  _id: 'test_user_id_1',
  role: 'basic',
};
const mockedAuthor = {
  _id: 'test_user_id_2',
  role: 'basic',
};
const mockedAdmin = {
  _id: 'test_admin_id',
  role: 'admin',
};
const mockedAuthorId = 'test_user_id_2';

describe('permissions', () => {
  test('should check if the user has permission to create article', () => {
    const permission = hasCreateArticlePermission(mockedUser);
    expect(permission).toEqual(true);
    // change this to false after admin, editor assign is implemented
  });
  test('should check if the owner of the article has permission to delete article', () => {
    const permission = hasDeleteArticlePermission(mockedAuthor, mockedAuthorId);
    expect(permission).toEqual(true);
  });
  test('should give access to admin to delete article', () => {
    const permission = hasDeleteArticlePermission(mockedAdmin, mockedAuthorId);
    expect(permission).toEqual(true);
  });
  test('should prohibit user without permissions to delete article', () => {
    const permission = hasDeleteArticlePermission(mockedUser, mockedAuthorId);
    expect(permission).toEqual(false);
  });
  test('should check if the owner of the article has permission to edit article', () => {
    const permission = hasEditArticlePermission(mockedAuthor, mockedAuthorId);
    expect(permission).toEqual(true);
  });
});

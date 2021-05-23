import {
  hasDeleteArticlePermission,
  hasCreateArticlePermission,
  hasEditArticlePermission,
} from '../permissions';

import {
  mockBasicUser,
  mockAuthor,
  mockAdmin,
  mockAuthorId,
} from '../../models/__mocks__/user';

describe('permissions', () => {
  test('should restrict access to create article with basic user', () => {
    const permission = hasCreateArticlePermission(mockBasicUser);
    expect(permission).toEqual(false);
  });
  test('should give access to admin to create article', () => {
    const permission = hasCreateArticlePermission(mockAdmin);
    expect(permission).toEqual(true);
  });

  test('should give access to editor to create article', () => {
    const permission = hasCreateArticlePermission(mockAuthor);
    expect(permission).toEqual(true);
  });
  test('should check if the owner of the article has permission to delete article', () => {
    const permission = hasDeleteArticlePermission(mockAuthor, mockAuthorId);
    expect(permission).toEqual(true);
  });
  test('should give access to admin to delete article', () => {
    const permission = hasDeleteArticlePermission(mockAdmin, mockAuthorId);
    expect(permission).toEqual(true);
  });
  test('should prohibit user without permissions to delete article', () => {
    const permission = hasDeleteArticlePermission(mockBasicUser, mockAuthorId);
    expect(permission).toEqual(false);
  });
  test('should check if the owner of the article has permission to edit article', () => {
    const permission = hasEditArticlePermission(mockAuthor, mockAuthorId);
    expect(permission).toEqual(true);
  });
});

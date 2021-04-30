export const mockDefaultArticle = {
  title: 'Test title',
  author: 'Test User',
  text: 'Lorem ipsum',
  violence_type: ['emotional'],
  url_to_image: 'https://www.google.com/',
  created_at: new Date(),
};
export const mockArticleWithoutTitle = {
  author: 'Test User1',
  text: 'Lorem ipsumm',
  violence_type: ['financial'],
  url_to_image: '"https://www.youtube.com/',
  created_at: new Date(),
};

export const mockArticleWithoutAuthor = {
  title: 'here is title',
  text: 'Lorem ipsumm',
  violence_type: ['sexual'],
  url_to_image: '"https://www.bbc.com/',
  created_at: new Date(),
};

export const mockArticleWithoutText = {
  title: 'here is title',
  author: 'The user',
  violence_type: ['financial'],
  url_to_image: '"https://www.cnn.com/',
  created_at: new Date(),
};
export const mockArticleWithoutViolenceType = {
  title: 'here is title',
  text: 'Lorem ipsummm',
  author: 'The user',
  url_to_image: '"https://www.dw.com/',
  created_at: new Date(),
};

export const mockArticleWithoutUrlToImage = {
  title: 'here is title',
  text: 'Lorem ipsummm',
  violence_type: ['sexual'],
  author: 'The user',
  created_at: new Date(),
};

export const mockArticleWithoutCreatedAt = {
  title: 'here is title',
  text: 'Lorem ipsummm',
  violence_type: ['sexual'],
  url_to_image: '"https://www.apple.com/',
  author: 'The user',
};

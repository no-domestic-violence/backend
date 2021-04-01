/* eslint-disable  import/prefer-default-export */
export const BASE_URI = '/api';

export const ROLE = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  BASIC: 'basic',
};

export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const PORT = process.env.PORT || 3001;

const getUserGenerator = () => {
  let counter = 0;
  return (overrides = {}) => {
    counter += 1;
    return {
      username: `koosha${counter}`,
      email: `kooshaala${counter}@gmail.com`,
      password: 'Welcome123',
      ...overrides,
    };
  };
};
const getUser = getUserGenerator();

export const mockVALID_USERS = {
  DEFAULT: getUser(),
  PASSWORD_WITHOUT_NUMBERS: getUser({ password: 'Welcometthere' }),
  USERNAME_LENGTH_TWO: getUser({ username: 'hi' }),
};

export const mockINVALID_USERS = {
  INVALID_EMAIL: getUser({ email: 'jhhfuzegf' }),
  USERNAME_LENGTH_1: getUser({ username: 'a' }),
  INVALID_PASSWORD_LENGHT: getUser({ password: 'Welcome' }),
};

export const mockMISSING_USER_INFO = {
  DEFAULT: getUser({
    username: undefined,
    email: undefined,
    password: undefined,
  }),
  MISSING_USERNAME: getUser({ username: '' }),
  MISSING_PASSWORD: getUser({ password: '' }),
  MISSING_EMAIL: getUser({ email: '' }),
};

const getLoginUser = (overrides = {}) => ({
  email: 'hellothere@gmail.com',
  password: 'hellothere123',
  ...overrides,
});

export const mockLOGIN_VALID_USERS = {
  DEFAULT: getLoginUser(),
  PASSWORD_WITHOUT_NUMBERS: getLoginUser({ password: 'Welcometthere' }),
};

export const mockLOGIN_INVALID_USERS = {
  DEFAULT: getLoginUser({ email: undefined, password: undefined }),
  MISSING_EMAIL: getLoginUser({ email: undefined }),
  EMPTY_EMAIL: getLoginUser({ email: '' }),
  INVALID_EMAIL: getLoginUser({ email: 'jhhfuzegf' }),
  INVALID_PASSWORD_LENGHT: getLoginUser({ password: 'Welcome' }),
};

export const mockINCORRECT_LOGIN_PASSWORD = {
  INCORRECT_PASSWORD: getLoginUser(),
};

const getchangePassword = (overrides = {}) => ({
  email: 'welcome@gmail.com',
  oldPassword: 'Welcome1',
  password: 'Welcome2',
  ...overrides,
});

export const mockMISSING_CHANGEPASSWORD_INFO = {
  MISSING_OLDPASSWORD: getchangePassword({ oldPassword: '' }),
  MISSING_PASSWORD: getchangePassword({ password: '' }),
  MISSING_EMAIL: getchangePassword({ email: '' }),
};

export const mockINCORRECT_CHANGEPASSWORD_INFO = {
  INCORRECT_PASSWORD: getchangePassword(),
};

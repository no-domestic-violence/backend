import * as fetch from 'node-fetch';

const verifyCaptcha = async captchaResp => {
  try {
    const captchaSecret =
      process.env.CAPTCHA_SECRET_KEY ||
      '6Lfbl9YbAAAAABbX1A7VRcDal2fRKnSkTZnxIinx';
    const formBody = `secret=${captchaSecret}&response=${captchaResp}`;
    const resp = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      },
    );
    const response = await resp.json();
    return response.success;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error while verifying captcha: `, err.message);
    return false;
  }
};

export default verifyCaptcha;

import * as fetch from 'node-fetch';

const verifyCaptcha = async captchaResp => {
  try {
    const captchaSecret = process.env.CAPTCHA_SECRET_KEY || '';
    const resp = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        data: JSON.stringify({
          secret: captchaSecret,
          response: captchaResp,
        }),
      },
    );
    return resp.success;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error while verifying captcha: `, err.message);
    return false;
  }
};

export default verifyCaptcha;

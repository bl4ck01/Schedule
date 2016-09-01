const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const logger = require('./logService');

const saml = new SamlStrategy(
  {
    callbackUrl: 'https://helpdesk.unet.brandeis.edu/login/callback',
    entryPoint: 'https://shibboleth.brandeis.edu/idp/profile/SAML2/Redirect/SSO',
    issuer: 'https://helpdesk.unet.brandeis.edu/shibboleth',
    logoutCallbackUrl: 'https://helpdesk.unet.brandeis.edu/logout',
    passReqToCallback: true,
  },
  (profile, done) => {
    logger.write.console(JSON.stringify(profile));
    done(null, {
      id: profile.uid,
      email: profile.mail,
      displayName: profile.cn,
      firstName: profile.givenName,
      lastName: profile.sn,
    });
  }
);

passport.use(saml);

exports._ = passport;
exports.strategy = saml;

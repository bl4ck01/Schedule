const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const logger = require('./logService');
const config = require('../config/config');

const saml = new SamlStrategy(
  {
    callbackUrl: config.callbackUrl,
    entryPoint: config.entryPoint,
    issuer: config.issuer,
    logoutCallbackUrl: config.logoutCallbackUrl,
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

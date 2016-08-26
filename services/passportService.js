const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const logger = require('./logService');

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://louisbrandeis.shiftplanning.com/includes/saml/',
    issuer: 'https://shibboleth.brandeis.edu/idp/profile/SAML2/Redirect/SSO',
    logoutUrl: 'https://login.brandeis.edu/cgi-bin/logout',
    passReqToCallback: true,
  },
  (profile, done) => {
    logger.write.console(profile);
    done(null);
  }
));

module.exports = passport;

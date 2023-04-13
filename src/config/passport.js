var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
var User = require('../model/user')

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (username, password, done) {
  User
    .findOne({ username: username })
    .then(function (user) {
      if (!user || !user.validPassword(password, user.password)) {
        return done(null, false, { err: 'username or password is invalid' });
      }
      return done(null, user);
    }).catch(done);
}));

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_CALL_BACK_URL,
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    //check user table for anyone with a google ID of profile.id
    User.findOne({ 'google.id': profile.id }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          providerid: 'google.com',
        });
        User.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else { return done(err, user); }
    });
  }
));

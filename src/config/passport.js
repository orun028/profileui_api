var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
var User = require('../model/user')
var Admin = require('../server/model/admin')

passport.use('user_local', new LocalStrategy({
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

passport.use('admin_google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    //check user table for anyone with a google ID of profile.id
    Admin.findOne({ 'google.id': profile.id }, function (err, admin) {
      if (err) { return done(err); }
      if (!admin) {
        admin = new Admin({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'google',
          authJson: profile._json
        });
        admin.save(function (err) {
          if (err) console.log(err);
          return done(err, admin);
        });
      } else { return done(err, admin); }
    });
  }
));

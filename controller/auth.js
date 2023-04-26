const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../model/user')

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (user) {
      return res.json(user.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

exports.loginGoogle = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })(req, res, next);
}

exports.loginGoogleCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/auth'
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  res.status(205).json({})
  req.session.destroy(function (err) {
    if (err) { return next(err); }
  })
}

passport.serializeUser((user, done) => {
  process.nextTick(function () {
    return done(null, user.id);
  });
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    return done(null, user);
  }).catch(done)
});

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
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    //check user table for anyone with a google ID of profile.id
    User.findOne({ googleid: profile.id }, function (err, user) {
      if (err) { return done(err, false); }
      if (!user) {
        new User({
          googleid: profile.id,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value,
          photourl: profile.photos[0].value,
        })
        .save()
        .then(user => done(null, user))
        .catch(done)
      } else {
        done(null, user);
      }
    });
  }
));
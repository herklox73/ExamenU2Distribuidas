require('dotenv').config();
const express  = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool   = require('../config/db');
const logger = require('../config/logger');
const { saveLog } = require('../middlewares/log.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email   = emails[0].value;
    const picture = photos[0]?.value;
    const result  = await pool.query(
      `INSERT INTO users (google_id, email, name, picture)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (google_id) DO UPDATE
         SET email=EXCLUDED.email, name=EXCLUDED.name, picture=EXCLUDED.picture
       RETURNING *`,
      [id, email, displayName, picture]
    );
    return done(null, result.rows[0]);
  } catch (err) { return done(err, null); }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Inicia flujo Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Callback → genera JWT → redirige al frontend

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  async (req, res) => {
    const user = req.user;
    const jti  = uuidv4();
    const token = jwt.sign(
      { jti, sub: user.google_id, email: user.email, name: user.name, picture: user.picture },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    logger.info('Login con Google', { email: user.email });
    await saveLog({ event_type:'LOGIN', user_email: user.email,
      description:'Inicio de sesión Google OAuth' });

    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('Redirigiendo a:', `${process.env.FRONTEND_URL}/auth/callback?token=${token.substring(0,20)}...`);
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Logout: revoca el token
router.post('/logout', authMiddleware, async (req, res) => {
  const { jti, email } = req.user;
  await pool.query(
    'INSERT INTO revoked_tokens (jti) VALUES ($1) ON CONFLICT DO NOTHING', [jti]
  );
  logger.info('Logout', { email });
  await saveLog({ event_type:'LOGOUT', user_email: email,
    description:'Cierre de sesión — token revocado' });
  res.json({ message: 'Sesión cerrada correctamente' });
});

// Perfil
router.get('/me', authMiddleware, (req, res) => {
  const { email, name, picture } = req.user;
  res.json({ email, name, picture });
});

router.get('/failure', (req, res) =>
  res.status(401).json({ error: 'Autenticación con Google fallida' })
);

module.exports = router;
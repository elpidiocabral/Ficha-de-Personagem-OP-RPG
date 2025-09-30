import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy, type Profile as DiscordProfile } from 'passport-discord';
import jwt from 'jsonwebtoken';

type JwtUser = {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string | null;
  email?: string | null;
};

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_CALLBACK_URL,
  SESSION_SECRET,
  JWT_SECRET,
  FRONTEND_URL,
  PORT = '3000',
} = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_CALLBACK_URL || !SESSION_SECRET || !JWT_SECRET) {
  throw new Error('Faltam variáveis no .env (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CALLBACK_URL, SESSION_SECRET, JWT_SECRET).');
}

const app = express();

// Sessão (necessária para Passport quando usamos "authorization_code")
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true em produção atrás de HTTPS
    maxAge: 1000 * 60 * 10, // 10 min só pro fluxo de login
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Config do Passport Discord
const scopes = ['identify', 'email']; // tire "email" se não precisar
passport.use(new DiscordStrategy(
  {
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_CALLBACK_URL,
    scope: scopes,
  },
  // verify callback: aqui você pode criar/buscar usuário no DB
  async (accessToken: string, refreshToken: string, profile: DiscordProfile, done) => {
    try {
      // Exemplinho: mapear apenas dados que você quer guardar
      const user: JwtUser = {
        id: profile.id,
        username: profile.username,
        discriminator: (profile as any).discriminator, // pode ser undefined nas novas contas
        avatar: profile.avatar,
        email: profile.email ?? null,
      };
      // Em um projeto real, conecte-se ao banco e upsert(user) aqui.
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }
));

// (Opcional) serialize/deserialize — aqui guardo o usuário inteiro na sessão durante o fluxo
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

/**
 * Rota para iniciar o login no Discord
 * Ex.: GET http://localhost:3000/auth/discord
 */
app.get('/auth/discord', passport.authenticate('discord'));

/**
 * Callback do Discord.
 * Se sucesso: crio um JWT e redireciono pro FRONT com o token.
 */
app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = req.user as JwtUser;
    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        email: user.email,
        provider: 'discord',
      },
      JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Se tiver FRONTEND_URL, redireciona passando o token por query/hash:
    const redirect = FRONTEND_URL ? `${FRONTEND_URL}/auth/success#token=${token}` : `/auth/success?token=${token}`;
    res.redirect(redirect);
  }
);

// Rotinhas auxiliares
app.get('/auth/failure', (_req, res) => res.status(401).send('Falha na autenticação com o Discord.'));
app.get('/auth/success', (req, res) => {
  // Apenas pra testes via backend puro (sem front): mostra o token retornado via query
  const token = req.query.token;
  res.send(`Login OK. Token JWT: ${token}`);
});

// Exemplo de rota protegida por JWT (Bearer)
import type { Request, Response, NextFunction } from 'express';
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing Bearer token' });
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    (req as any).user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/me', requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

app.listen(Number(PORT), () => {
  console.log(`Auth server on http://localhost:${PORT}`);
});

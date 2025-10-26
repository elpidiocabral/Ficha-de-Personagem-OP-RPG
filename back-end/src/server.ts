import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy, type Profile as DiscordProfile } from 'passport-discord';
import jwt from 'jsonwebtoken';

import router from './routes';

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

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing JSON
app.use(express.json());

// Sessão(necessária para Passport quando usamos "authorization_code")
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
    try {
      console.log('✅ Callback do Discord executado com sucesso');
      console.log('👤 User recebido:', req.user);
      
      const user = req.user as JwtUser;
      
      if (!user) {
        console.error('❌ Usuário não encontrado no callback');
        return res.redirect('/auth/failure');
      }

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

      console.log('🔑 Token JWT criado:', token.substring(0, 20) + '...');
      console.log('🌐 FRONTEND_URL:', FRONTEND_URL);

      // Redirecionar direto para a página principal com token no hash
      const redirect = FRONTEND_URL ? `${FRONTEND_URL}/#token=${token}` : `/auth/success?token=${token}`;
      console.log('🔄 Redirecionando para:', redirect);
      
      res.redirect(redirect);
    } catch (error) {
      console.error('🚨 Erro no callback do Discord:', error);
      res.redirect('/auth/failure');
    }
  }
);

// Rotinhas auxiliares
app.get('/auth/failure', (req, res) => {
  console.error('❌ Falha na autenticação com Discord');
  res.status(401).send(`
    <h1>Falha na Autenticação</h1>
    <p>Não foi possível autenticar com o Discord.</p>
    <p><a href="/auth/discord">Tentar novamente</a></p>
    <p><a href="${FRONTEND_URL || 'http://localhost:5173'}">Voltar ao site</a></p>
  `);
});

app.get('/auth/success', (req, res) => {
  // Apenas pra testes via backend puro (sem front): mostra o token retornado via query
  const token = req.query.token;
  console.log('✅ Página de sucesso acessada com token:', token ? 'presente' : 'ausente');
  
  res.send(`
    <h1>Login Realizado com Sucesso!</h1>
    <p>Token JWT: <code>${token ? token.toString().substring(0, 50) + '...' : 'Não encontrado'}</code></p>
    <p>Esta página só aparece quando FRONTEND_URL não está configurado.</p>
    <p><a href="${FRONTEND_URL || 'http://localhost:5173'}">Ir para o site</a></p>
    <script>
      // Se há token, salvar no localStorage e redirecionar
      if ('${token}' && '${token}' !== 'undefined') {
        localStorage.setItem('auth_token', '${token}');
        window.location.href = '${FRONTEND_URL || 'http://localhost:5173'}';
      }
    </script>
  `);
});

// Importar middleware de autenticação do arquivo separado
import { requireAuth } from './middleware/auth';

app.get('/me', requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

// Montar todas as rotas da API
app.use(router);

app.listen(Number(3000), () => {
  console.log(`Auth server on http://localhost:${3000}`);
});

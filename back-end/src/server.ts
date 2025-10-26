import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import router from './routes';
import passport from './config/passport';

import session from 'express-session';

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:3000',
  /\.vercel\.app$/
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { // Configurações do cookie da sessão para prod
    secure: true, 
    httpOnly: false,
    sameSite: 'none',   
    maxAge: 1000 * 60 * 60 * 24 * 7 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));

app.use(router);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import router from './routes';
import passport from './config/passport';

import session from 'express-session';

const app = express();

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
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));

app.use(router);

app.listen(Number(3000), () => {
  console.log(`Servidor rodando na porta ${3000}`);
});

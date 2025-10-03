import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import router from './routes';
import passport from './config/passport';

import session from 'express-session';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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

app.use(express.json());

app.use(router);

app.listen(Number(3000), () => {
  console.log(`Servidor rodando na porta ${3000}`);
});

import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, optionalAuth, type UserPayload } from '../middleware/auth';

const router = Router();

/**
 * GET /api/user/me
 * Retorna informações do usuário logado
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload;
  
  // Formatando os dados do usuário para o frontend
  const userData = {
    id: user.sub,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    email: user.email,
    provider: user.provider,
    // Gerar URL do avatar se existir
    avatarUrl: user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.sub}/${user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.sub) % 5)}.png`, // avatar padrão
    displayName: user.discriminator && user.discriminator !== '0' 
      ? `${user.username}#${user.discriminator}` 
      : user.username, // novo formato do Discord (sem discriminator)
  };

  res.json({
    success: true,
    user: userData
  });
});

/**
 * GET /api/user/profile
 * Retorna perfil mais detalhado (pode incluir preferências, etc.)
 */
router.get('/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload;
  
  // Aqui você pode buscar dados adicionais do banco de dados
  // Por exemplo: preferências, configurações, estatísticas, etc.
  
  const profile = {
    id: user.sub,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    email: user.email,
    avatarUrl: user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.sub}/${user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.sub) % 5)}.png`,
    displayName: user.discriminator && user.discriminator !== '0' 
      ? `${user.username}#${user.discriminator}` 
      : user.username,
    joinedAt: new Date(user.iat! * 1000).toISOString(), // quando fez login pela primeira vez
    // Dados que você pode adicionar depois:
    // theme: 'dark' | 'light',
    // language: 'pt-BR',
    // totalCharacters: 0,
    // lastActive: new Date().toISOString(),
  };

  res.json({
    success: true,
    profile
  });
});

/**
 * PUT /api/user/preferences
 * Atualiza preferências do usuário (tema, idioma, etc.)
 */
router.put('/preferences', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload;
  const { theme, language, notifications } = req.body;
  
  // Validação básica
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['pt-BR', 'en-US', 'es-ES'];
  
  if (theme && !validThemes.includes(theme)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Tema inválido. Use: light, dark ou auto' 
    });
  }
  
  if (language && !validLanguages.includes(language)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Idioma inválido. Use: pt-BR, en-US ou es-ES' 
    });
  }
  
  // Aqui você salvaria no banco de dados
  // await UserPreferences.updateByUserId(user.sub, { theme, language, notifications });
  
  res.json({
    success: true,
    message: 'Preferências atualizadas com sucesso',
    preferences: {
      theme: theme || 'dark',
      language: language || 'pt-BR',
      notifications: notifications !== undefined ? notifications : true
    }
  });
});

/**
 * GET /api/user/stats
 * Retorna estatísticas do usuário (fichas criadas, tempo de uso, etc.)
 */
router.get('/stats', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload;
  
  // Aqui você buscaria do banco de dados
  const stats = {
    userId: user.sub,
    totalCharacters: 0, // await Character.countByUserId(user.sub)
    totalSessions: 0,   // quantas vezes logou
    lastLogin: new Date().toISOString(),
    accountCreated: new Date(user.iat! * 1000).toISOString(),
    // favoritClass: 'Espadachim',
    // totalPlayTime: '10h 30m',
  };
  
  res.json({
    success: true,
    stats
  });
});

/**
 * POST /api/user/logout
 * Logout (invalida token - se implementar blacklist)
 */
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  // Como estamos usando JWT stateless, não há muito o que fazer aqui
  // Em produção você pode implementar um blacklist de tokens
  // ou usar refresh tokens com revogação
  
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

/**
 * GET /api/user/session
 * Verifica se o token ainda é válido (similar ao /me mas mais leve)
 */
router.get('/session', optionalAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload | undefined;
  
  if (!user) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'Não autenticado'
    });
  }
  
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: user.sub,
      username: user.username,
      displayName: user.discriminator && user.discriminator !== '0' 
        ? `${user.username}#${user.discriminator}` 
        : user.username,
      avatarUrl: user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.sub}/${user.avatar}.png?size=64`
        : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.sub) % 5)}.png`
    }
  });
});

export default router;
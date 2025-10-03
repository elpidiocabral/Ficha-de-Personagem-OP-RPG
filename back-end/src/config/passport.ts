import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

passport.serializeUser((user: any, done) => {
    done(null, {
        id: user.id,
        username: user.username,
        avatar: user.avatar
    });
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});

passport.use(new DiscordStrategy(
    {
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: process.env.DISCORD_CALLBACK_URL || "http://localhost:3000/auth/discord/callback",
        scope: ["identify"]
    },
    async (_accessToken, _refreshToken, profile, done) => {
        return done(null, profile);
    }
));

export default passport;

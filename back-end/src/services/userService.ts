export function getUserObject(user: any) {
    return {
        id: user.id,
        name: user.username,
        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    }
}
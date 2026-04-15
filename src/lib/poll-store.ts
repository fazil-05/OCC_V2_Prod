// In-memory store for OAuth tokens (keyed by pollKey)
const tokenStore = new Map<string, { token: string; email: string; createdAt: number }>();

// Clean up tokens older than 10 minutes
function cleanupOldTokens() {
    const now = Date.now();
    for (const [key, value] of tokenStore.entries()) {
        if (now - value.createdAt > 10 * 60 * 1000) {
            tokenStore.delete(key);
        }
    }
}

export function storeOAuthToken(pollKey: string, token: string, email: string) {
    cleanupOldTokens();
    tokenStore.set(pollKey, { token, email, createdAt: Date.now() });
    console.log(`[PollStore] Token cached for key: ${pollKey}, email: ${email}`);
}

export function getOAuthToken(pollKey: string) {
    const entry = tokenStore.get(pollKey);

    if (!entry) return null;

    // Check expiration (10 min)
    if (Date.now() - entry.createdAt > 10 * 60 * 1000) {
        tokenStore.delete(pollKey);
        return { expired: true };
    }

    // Success - consume the token
    tokenStore.delete(pollKey);
    return { token: entry.token };
}

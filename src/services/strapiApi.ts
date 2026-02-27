/**
 * Real Strapi API client — replaces mockApi
 * All authenticated requests automatically include the JWT from localStorage
 */

const BASE_URL = 'http://localhost:1337';

const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') return null;
    return token;
};

const authHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

async function handleResponse(res: Response) {
    const json = await res.json();
    if (!res.ok) {
        console.error(`Strapi Error [${res.status}]:`, json);
        const message = json?.error?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
    }
    return json;
}

const strapiApi = {
    auth: {
        login: async (credentials: { email?: string; identifier?: string; password: string }) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/auth/local`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identifier: credentials.email || credentials.identifier,
                        password: credentials.password,
                    }),
                })
            );
            // Strapi returns { jwt, user } — wrap to match mockApi interface
            return { data: { jwt: json.jwt, user: json.user } };
        },

        register: async (credentials: { username?: string; email: string; password: string }) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/auth/local/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: credentials.username || credentials.email.split('@')[0],
                        email: credentials.email,
                        password: credentials.password,
                    }),
                })
            );
            return { data: { jwt: json.jwt, user: json.user } };
        },
    },

    user: {
        me: async () => {
            // Strapi returns user object directly (not wrapped in data)
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/users/me`, {
                    headers: authHeaders(),
                })
            );
            return { data: json };
        },

        update: async (id: string | number, updates: Record<string, any>) => {
            // Strapi users PUT takes flat fields, no { data: } wrapper
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/users/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(updates),
                })
            );
            return { data: json };
        },
    },

    foodLogs: {
        list: async () => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/foodlogs`, {
                    headers: authHeaders(),
                })
            );
            // Strapi v5 list: { data: [...], meta: {} }
            return { data: (json.data || []).map(normalizeFoodLog) };
        },

        create: async (payload: { data: { name: string; calories: number; mealType: string; date?: string } }) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/foodlogs`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({
                        data: {
                            ...payload.data,
                            date: payload.data.date || new Date().toISOString().split('T')[0],
                        },
                    }),
                })
            );
            return { data: normalizeFoodLog(json.data) };
        },

        delete: async (documentId: string) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/foodlogs/${documentId}`, {
                    method: 'DELETE',
                    headers: authHeaders(),
                })
            );
            return { data: json.data };
        },
    },

    activityLogs: {
        list: async () => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/activity-logs`, {
                    headers: authHeaders(),
                })
            );
            return { data: (json.data || []).map(normalizeActivityLog) };
        },

        create: async (payload: { data: { name: string; duration: number; calories: number; date?: string } }) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/activity-logs`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({
                        data: {
                            ...payload.data,
                            date: payload.data.date || new Date().toISOString().split('T')[0],
                        },
                    }),
                })
            );
            return { data: normalizeActivityLog(json.data) };
        },

        delete: async (documentId: string) => {
            const json = await handleResponse(
                await fetch(`${BASE_URL}/api/activity-logs/${documentId}`, {
                    method: 'DELETE',
                    headers: authHeaders(),
                })
            );
            return { data: json.data };
        },
    },
};

// Strapi v5 returns flat entries: { id, documentId, name, calories, ... }
function normalizeFoodLog(entry: any) {
    return {
        id: entry.id,
        documentId: entry.documentId,
        name: entry.name,
        calories: entry.calories,
        mealType: entry.mealType,
        date: entry.date || new Date().toISOString().split('T')[0],
        createdAt: entry.createdAt,
    };
}

function normalizeActivityLog(entry: any) {
    return {
        id: entry.id,
        documentId: entry.documentId,
        name: entry.name,
        duration: entry.duration,
        calories: entry.calories,
        date: entry.date || new Date().toISOString().split('T')[0],
        createdAt: entry.createdAt,
    };
}

export default strapiApi;

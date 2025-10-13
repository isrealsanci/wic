/// <reference types="@cloudflare/workers-types" />

import { Pool } from '@neondatabase/serverless';

interface Env {
    DATABASE_URL: string;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
    return new Response(null, { headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        const pool = new Pool({ connectionString: env.DATABASE_URL });
        const query = `
            SELECT username, pfp_url, score, wins, losses
            FROM player_stats
            ORDER BY score DESC
            LIMIT 25;
        `;
        
        const { rows } = await pool.query(query);
        await pool.end();

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Leaderboard Fetch Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
};
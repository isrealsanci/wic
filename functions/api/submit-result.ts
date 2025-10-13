/// <reference types="@cloudflare/workers-types" />

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Pool } from '@neondatabase/serverless';

// --- Type Definitions ---
type Difficulty = 'easy' | 'medium' | 'hard';
type Result = 'win' | 'loss';

interface Env {
    DATABASE_URL: string;
    NEYNAR_API_KEY: string;
}

interface RequestBody {
    userAddress: string;
    result: Result;
    difficulty: Difficulty;
}

// --- CORS Headers ---
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// --- Function Handlers ---

/**
 * Handles CORS preflight requests.
 */
export const onRequestOptions: PagesFunction<Env> = async () => {
    return new Response(null, { headers: corsHeaders });
};

/**
 * Handles the POST request to submit a game result.
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json<RequestBody>();
        const { userAddress, result, difficulty } = body;

        // 1. Validate Input
        if (!userAddress || !result || !difficulty || !['win', 'loss'].includes(result) || !['easy', 'medium', 'hard'].includes(difficulty)) {
            return new Response(JSON.stringify({ error: 'Missing or invalid required fields' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // 2. Fetch Farcaster data from Neynar
        const neynarClient = new NeynarAPIClient({ apiKey: env.NEYNAR_API_KEY });

        
        // CORRECTED: The address array is now passed inside an object with an 'addresses' key.
        const farcasterUserResponse = await neynarClient.fetchBulkUsersByEthOrSolAddress({ addresses: [userAddress] });

        const userData = farcasterUserResponse[userAddress.toLowerCase()]?.[0];
        const username = userData?.username || 'unknown_user';
        const pfp_url = userData?.pfp_url || '';

        // 3. Calculate Score
        const pointsConfig: Record<Difficulty, { win: number; loss: number }> = {
            easy: { win: 10, loss: -5 },
            medium: { win: 15, loss: -10 },
            hard: { win: 20, loss: -15 },
        };
        const scoreChange = pointsConfig[difficulty][result];
        const winIncrement = result === 'win' ? 1 : 0;
        const lossIncrement = result === 'loss' ? 1 : 0;

        // 4. Connect to Neon Database
        const pool = new Pool({ connectionString: env.DATABASE_URL });

        // 5. Upsert query to the database
        const upsertQuery = `
            INSERT INTO player_stats (user_address, username, pfp_url, score, wins, losses, total_plays, last_played_at)
            VALUES ($1, $2, $3, $4, $5, $6, 1, NOW())
            ON CONFLICT (user_address)
            DO UPDATE SET
                username = EXCLUDED.username,
                pfp_url = EXCLUDED.pfp_url,
                score = GREATEST(0, player_stats.score + $4),
                wins = player_stats.wins + $5,
                losses = player_stats.losses + $6,
                total_plays = player_stats.total_plays + 1,
                last_played_at = NOW();
        `;

        await pool.query(upsertQuery, [userAddress, username, pfp_url, scoreChange, winIncrement, lossIncrement]);
        await pool.end();

        return new Response(JSON.stringify({ message: 'Score updated successfully' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Backend Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
};
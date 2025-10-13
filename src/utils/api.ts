import { Difficulty } from '../types/game';

export const submitGameResult = async (
    userAddress: `0x${string}`,
    result: 'win' | 'loss',
    difficulty: Difficulty
) => {
    try {
        
        const response = await fetch('https://wtc.exapp.xyz/api/submit-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userAddress, result, difficulty }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to submit score to backend:', errorData);
        } else {
            console.log('Score submitted successfully!');
        }
    } catch (error) {
        console.error('Error submitting score:', error);
    }
};
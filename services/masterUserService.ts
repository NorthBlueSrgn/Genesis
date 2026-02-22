/**
 * Master User Initialization Service
 * Allows master user (Abas) to initialize stats from screening baseline, skipping onboarding
 */

const FUNCTION_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || 'http://localhost:5001/genesis-protocol-39345/us-central1';

export async function initializeStatsFromBaseline(uid: string, email: string) {
  try {
    const response = await fetch(
      `${FUNCTION_URL}/initializeStatsFromBaseline`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, email }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initialize stats');
    }

    const data = await response.json();
    return {
      success: true,
      stats: data.stats,
      summary: data.summaryByCategory,
    };
  } catch (error) {
    console.error('[initializeStatsFromBaseline] error:', error);
    throw error;
  }
}

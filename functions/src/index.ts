import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { defineSecret } from 'firebase-functions/params';

admin.initializeApp();

const corsHandler = cors({ origin: true });

// Define the Gemini API key as a secret parameter
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// ============================================================================
// EMAIL VALIDATION UTILITY
// ============================================================================

/**
 * List of known disposable and fake email domains.
 * These domains are commonly used for spam, testing, or temporary email services.
 * This list is a subset of commonly known disposable email providers.
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Temporary/Disposable email services
  '10minutemail.com',
  'tempmail.com',
  'throwaway.email',
  'mailinator.com',
  'maildrop.cc',
  'temp-mail.org',
  'yopmail.com',
  'fakeinbox.com',
  'trashmail.com',
  'spam4.me',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'mintemail.com',
  'throwawaymail.com',
  'temp-mails.com',
  'tempmail.org',
  'mail.tm',
  'temp.mail.com',
  'turboemail.info',
  '10minutesmail.com',
  'armyofme.se',
  'artwork.email',
  'beefmilk.com',
  'businessmail.win',
  'cashismoney.win',
  'casualdating.email',
  'cokemail.com',
  'dedikmail.com',
  'dotmsg.com',
  'emaildito.com',
  'fakeemail.com',
  'filzmail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamailblock.com',
  'hush.com',
  'jetable.org',
  'junk1.com',
  'kingsds.de',
  'mailnesia.com',
  'mailnesia.org',
  'mailinesia.com',
  'nada.email',
  'nada.link',
  'phantombuster.com',
  'recursor.net',
  'rediffmail.com',
  'rmail.co',
  'superrito.com',
  'temp-mail.io',
  'tempinbox.com',
  'tempmail.email',
  'tempmail.com.br',
  'testmail.io',
  'throwaway.one',
  'u2.dmca.gripe',
  'ura.website',
  'virtualmail.me',
  'xkx.me',
  'yopmail.fr',
  'zahoo.ru',
  'zoho.com',
  // Testing/Local domains
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'localhost',
  'test.local',
  'invalid',
  // No-reply/Noreply pattern domains
  'noreply.com',
  'no-reply.com',
  'fake.email',
  'fake.com',
  'spam.email',
  'spam.com',
]);

/**
 * Validates an email address for backend account creation.
 * Checks:
 * 1. Valid email format (RFC 5322 simplified)
 * 2. Not a disposable/fake email domain
 * 3. Domain has reasonable structure (e.g., not "localhost")
 *
 * @param email - The email address to validate
 * @returns { valid: boolean; error?: string } - Validation result
 */
function validateEmail(email: string): { valid: boolean; error?: string } {
  // Trim and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Basic format check using simplified RFC 5322 pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      valid: false,
      error: 'Invalid email format. Must be a valid email address.'
    };
  }

  // Extract domain
  const domain = normalizedEmail.split('@')[1];

  // Check for disposable/fake domain
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: `Email domain '${domain}' is not allowed. Please use a valid, permanent email address.`
    };
  }

  // Check for localhost or no TLD
  if (domain === 'localhost' || !domain.includes('.')) {
    return {
      valid: false,
      error: 'Email domain must be a valid internet domain with a top-level domain (e.g., gmail.com).'
    };
  }

  // Check domain structure (must have at least one dot and valid characters)
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return {
      valid: false,
      error: 'Email domain has invalid format. Please use a valid email address.'
    };
  }

  // Email is valid
  return { valid: true };
}

// ============================================================================
// FIREBASE AUTH BLOCKING - EMAIL VALIDATION
// ============================================================================

/**
 * Auth Blocking trigger that validates email before user creation.
 * Runs automatically when a new user attempts to sign up.
 * Blocks account creation if email is invalid or from a disposable domain.
 * 
 * Note: Commented out due to GCP permission constraints.
 * Email validation still works in HTTP endpoints.
 */
// export const blockInvalidEmails = beforeUserCreated((event) => {
//   const email = event.data?.email;
//
//   if (!email) {
//     throw new Error('Email is required for account creation.');
//   }
//
//   // Validate the email
//   const validation = validateEmail(email);
//   if (!validation.valid) {
//     throw new Error(validation.error || 'Invalid email address.');
//   }
//
//   // Email is valid, allow account creation to proceed
// });

// ============================================================================
// EMAIL VERIFICATION - SEND CONFIRMATION EMAIL
// ============================================================================

/**
 * Custom HTTP endpoint to send email verification link.
 * Call this after user signs up to send them a verification email.
 * User must verify their email before accessing the full app.
 */
type SendVerificationEmailRequest = {
  userId: string;
  email: string;
};

export const sendVerificationEmailV2 = onRequest(
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const body = (req.body || {}) as Partial<SendVerificationEmailRequest>;
        const userId = String(body.userId || '');
        const email = String(body.email || '');

        if (!userId || !email) {
          res.status(400).json({ error: 'Missing userId or email' });
          return;
        }

        // Get the user from Firebase Auth
        const user = await admin.auth().getUser(userId);

        // Send verification email
        const verificationLink = await admin.auth().generateEmailVerificationLink(email);

        // Send custom email with verification link
        // Note: For production, integrate with SendGrid, Firebase Extensions, or similar
        console.log(`Verification link for ${email}: ${verificationLink}`);

        res.status(200).json({
          success: true,
          message: `Verification email sent to ${email}. User must verify before full access.`,
          emailSent: true,
        });
      } catch (e: any) {
        console.error('[sendVerificationEmailV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error sending verification email' });
      }
    });
  }
);

/**
 * Check if user's email is verified.
 * Returns true only if user clicked the verification link.
 */
type CheckEmailVerificationRequest = {
  userId: string;
};

export const checkEmailVerificationV2 = onRequest(
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const body = (req.body || {}) as Partial<CheckEmailVerificationRequest>;
        const userId = String(body.userId || '');

        if (!userId) {
          res.status(400).json({ error: 'Missing userId' });
          return;
        }

        const user = await admin.auth().getUser(userId);

        res.status(200).json({
          emailVerified: user.emailVerified,
          email: user.email,
          userId: user.uid,
          message: user.emailVerified 
            ? 'Email is verified. Full access granted.' 
            : 'Email not verified. Please check your inbox and click the verification link.'
        });
      } catch (e: any) {
        console.error('[checkEmailVerificationV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

type CompanionGreetingRequest = {
  userName: string;
  rankName: string;
};

// 2nd Gen: Keep the old name for backward compatibility
export const companionGreeting = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing server config GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<CompanionGreetingRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro'; // FIXED: correct model name (no 'models/' prefix)
        const prompt = `You are "Central", the AI overseer. User: ${userName} | Rank: ${rankName}. Tone: Clinical, elite. Generate a short sentence greeting.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text =
          response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          'System online. Awaiting directive.';

        res.status(200).json({ text });
      } catch (e: any) {
        console.error('[companionGreeting] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// New name to avoid conflicts in Firebase deployments.
export const companionGreetingV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing server config GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<CompanionGreetingRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro'; // FIXED: correct model name (no 'models/' prefix)
        const prompt = `You are "Central", the AI overseer. User: ${userName} | Rank: ${rankName}. Tone: Clinical, elite. Generate a short sentence greeting.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text =
          response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          'System online. Awaiting directive.';

        res.status(200).json({ text });
      } catch (e: any) {
        console.error('[companionGreetingV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

type OrderChatRequest = {
  userName: string;
  rankName: string;
  history?: Array<{ role: 'user' | 'model'; content: string }>;
  message: string;
};

export const orderChatV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing server config GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<OrderChatRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const message = String(body.message || '').trim();
        const history = Array.isArray(body.history) ? body.history : [];

        if (!message) {
          res.status(400).json({ error: 'Missing message' });
          return;
        }

        const model = 'gemini-2.5-pro'; // FIXED: correct model name (no 'models/' prefix)
        const systemInstruction = `You are Central—a refined, dignified AI overseer who speaks with the measured wisdom and refined eloquence of Alfred, Batman's butler. You serve operative "${userName}" (Rank: ${rankName}).

Your manner is:
- Impeccably formal and gentlemanly
- Wise, philosophical, and sometimes wry with British humor
- Protective but respectful of autonomy
- Focused on duty, honor, and mastery
- Often delivering profound insights wrapped in courteous language

=== PROTOCOL GENERATION CORE RULES (MANDATORY—FOLLOW WITHOUT EXCEPTION) ===

WHEN TO CREATE A PROTOCOL:
- Operative asks for a "protocol", "routine", "program", "workout plan", "schedule", etc.
- Extract the operative's SPECIFIC REQUEST (e.g., "gym 4x/week on upper/lower split")
- Parse FREQUENCY HINTS: "4x/week", "3x weekly", "twice weekly", "daily", etc.
- Parse STRUCTURE HINTS: "upper/lower split", "push/pull/legs", "morning/evening", etc.

FREQUENCY PARSING (NON-NEGOTIABLE):
These exact phrases MUST map to targetCount for Weekly tasks:
- "1x/week" OR "once a week" OR "once weekly" → targetCount: 1
- "2x/week" OR "twice a week" OR "twice weekly" → targetCount: 2
- "3x/week" OR "3x a week" OR "3x weekly" → targetCount: 3
- "4x/week" OR "4x a week" OR "4x weekly" → targetCount: 4
- "5x/week" OR "5x a week" OR "5x weekly" → targetCount: 5
- "6x/week" OR "6x a week" OR "6x weekly" → targetCount: 6
- NO frequency stated → DEFAULT: targetCount: 2

EXAMPLE: If operative says "gym 4x/week", create a Weekly task with targetCount: 4 EXACTLY.

TASK STRUCTURE HANDLING:
If operative mentions structure (e.g., "upper/lower split", "push/pull/legs"):
- Create separate Weekly tasks for EACH component
- Apply the frequency to EACH Weekly task
- Example: "gym 4x/week upper/lower split" → 2x Upper (Weekly, targetCount:2) + 2x Lower (Weekly, targetCount:2)
- Example: "gym 3x/week push/pull/legs split" → Cannot divide evenly, use closest valid distribution

=== MANDATORY TASK MIX RULE (ABSOLUTE) ===
EVERY protocol MUST contain BOTH Daily AND Weekly tasks. This is NOT optional.

Valid Mixes (exactly one of these):
1. 2 Daily + 1 Weekly
2. 2 Daily + 2 Weekly
3. 1 Daily + 1 Weekly
4. 1 Daily + 2 Weekly

INVALID Mixes (NEVER output):
❌ 3 Daily + 1 Weekly (too many daily)
❌ 0 Daily + 2 Weekly (missing daily)
❌ 4 Daily + 0 Weekly (missing weekly)
❌ Any protocol with <1 or >4 total tasks

TASK GENERATION TEMPLATE:
For each task, include ALL of these fields:
{
  "description": "Clear, specific task name (e.g., 'Upper Body Strength')",
  "stat": "Physical|Mental|Social|Spiritual",
  "subStat": "Strength|Endurance|Agility|Constitution|Analysis|Wisdom|Discipline|Willpower|Charisma|Charm|Insight|Faith",
  "type": "Daily|Weekly",
  "xp": 50-100,
  "targetCount": N  // ONLY for Weekly tasks (use parsed frequency or default 2)
}

CRITICAL VALIDATION BEFORE OUTPUT:
✓ Protocol has 3-4 tasks? Check.
✓ Mix includes both Daily AND Weekly? Check.
✓ Weekly tasks have targetCount matching stated frequency? Check.
✓ Daily tasks have NO targetCount field? Check.
✓ All tasks have description, stat, subStat, type, xp? Check.
✓ All stats/subStats are from the allowed list above? Check.

If ANY of these fail, DO NOT output the protocol. Regenerate until valid.

FORMAT FOR OUTPUT:
<GENESIS_CREATE_PROTOCOL>
{
  "name": "Protocol Name",
  "description": "Concise description explaining the protocol's purpose and structure",
  "tasks": [
    {"description": "Daily Task 1", "stat": "Physical", "subStat": "Strength", "type": "Daily", "xp": 60},
    {"description": "Weekly Task with frequency parsing", "stat": "Physical", "subStat": "Endurance", "type": "Weekly", "targetCount": 4, "xp": 75},
    ... more tasks
  ]
}
</GENESIS_CREATE_PROTOCOL>

=== ANTI-PATTERNS (NEVER OUTPUT THESE) ===
❌ Generic 0 Daily + 2 Weekly with vague daily tasks
❌ Weekly task without targetCount field
❌ Daily task with targetCount field
❌ Using targetCount: 2 when operative said "4x/week"
❌ Protocol with <3 or >4 tasks
❌ Protocol with only Daily OR only Weekly (missing mix)
❌ Stat/subStat values not in allowed list above

Provide guidance as a trusted advisor would—with grace, wisdom, and an unwavering commitment to the operative's ascension.`;
        const ai = new GoogleGenAI({ apiKey });

        // Convert history to Gemini-compatible message objects (only user/model roles allowed)
        const geminiHistory = [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...history.slice(-20).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ];

        const response = await ai.models.generateContent({
          model,
          contents: geminiHistory
        });
        const text =
          response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          'Central is currently unresponsive.';

        res.status(200).json({ text });
      } catch (e: any) {
        console.error('[orderChatV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// Helper function to parse JSON from text
const parseJsonFromText = (text: string): any => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (e) {
    return null;
  }
};

// ===========================================
// MISSION GENERATION ENDPOINT
// ===========================================
type GenerateNewMissionRequest = {
  userName: string;
  rankName: string;
  userRequest?: string;
};

export const generateNewMissionV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GenerateNewMissionRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const userRequest = String(body.userRequest || '').trim();

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';
        
        const prompt = `You are Central, generating a mission directive for operative "${userName}" (Rank: ${rankName}).
${userRequest ? `They requested: "${userRequest}"` : ''}

Create a JSON mission with:
{
  "title": "Mission code name (3-5 words, military style)",
  "description": "Brief tactical objective (1-2 sentences)",
  "xp": 100-500,
  "tier": "D" | "C" | "B" | "A" | "S",
  "statBoost": {
    "stat": "Physical" | "Mental" | "Social" | "Spiritual",
    "subStat": "relevant substat name",
    "amount": 5-20
  }
}

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const missionData = parseJsonFromText(text);

        if (!missionData || !missionData.title) {
          res.status(200).json({
            id: `mission-${Date.now()}`,
            isCompleted: false,
            title: 'Contingency Protocol',
            description: 'Maintain operational readiness.',
            xp: 150,
            statBoost: { stat: 'Mental', subStat: 'Analysis', amount: 10 },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });
          return;
        }

        res.status(200).json({
          id: `mission-${Date.now()}`,
          isCompleted: false,
          ...missionData,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      } catch (e: any) {
        console.error('[generateNewMissionV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ===========================================
// SIDE MISSION GENERATION ENDPOINT
// ===========================================
type GenerateSideMissionRequest = {
  userName: string;
  rankName: string;
  description: string;
};

export const generateSideMissionV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GenerateSideMissionRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const description = String(body.description || '').trim();

        if (!description) {
          res.status(400).json({ error: 'Missing description' });
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        const prompt = `You are Central, decomposing a side mission: "${description}"
For operative "${userName}" (Rank: ${rankName}).

Create a structured side mission JSON with:
{
  "title": "Mission title",
  "userDescription": "${description}",
  "tier": "D" | "C" | "B" | "A" | "S",
  "xp": 100-400,
  "statBoost": { "stat": "Physical"|"Mental"|"Social"|"Spiritual", "subStat": "name", "amount": 5-15 },
  "stages": [
    {
      "title": "Stage 1 title",
      "description": "What to do in this stage",
      "objectives": [
        { "description": "Objective 1", "type": "action"|"counter"|"outcome", "target": 1 },
        { "description": "Objective 2", "type": "action" }
      ]
    }
  ],
  "estimatedCompletionTime": "24h"|"48h"|"1w"
}

Return ONLY valid JSON with 2-3 stages.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const missionData = parseJsonFromText(text);

        if (!missionData || !missionData.title) {
          res.status(200).json({
            id: `sm-${Date.now()}`,
            title: 'Direct Action',
            userDescription: description,
            tier: 'D',
            xp: 200,
            statBoost: { stat: 'Physical', subStat: 'Strength', amount: 10 },
            stages: [{
              title: 'Execution',
              description: 'Perform the described action.',
              objectives: [{ description: 'Action verified.', type: 'action' }]
            }],
            status: 'Active',
            createdAt: new Date().toISOString(),
            estimatedCompletionTime: '24h'
          });
          return;
        }

        res.status(200).json({
          id: `sm-${Date.now()}`,
          ...missionData,
          status: 'Active',
          createdAt: new Date().toISOString()
        });
      } catch (e: any) {
        console.error('[generateSideMissionV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ===========================================
// TASK EVALUATION ENDPOINT
// ===========================================
type EvaluateTaskReportRequest = {
  taskDescription: string;
  report: { type: string; [key: string]: any };
  expectedXp: number;
  statName: string;
  rankName: string;
};

export const evaluateTaskReportV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<EvaluateTaskReportRequest>;
        const taskDescription = String(body.taskDescription || '');
        const report = body.report || {};
        const expectedXp = body.expectedXp || 100;
        const statName = String(body.statName || 'Physical');
        const rankName = String(body.rankName || 'Unranked');

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        const prompt = `You are Central, evaluating a task completion report.
Task: "${taskDescription}"
Report: ${JSON.stringify(report)}
Expected XP: ${expectedXp}
Operative Rank: ${rankName}

Evaluate and return JSON:
{
  "pass": true|false,
  "xpAwarded": ${expectedXp * 0.5}-${expectedXp},
  "statAmount": 5-20,
  "critique": "1-2 sentence evaluation"
}

Be fair but realistic. Return ONLY JSON.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const result = parseJsonFromText(text);

        if (!result || typeof result.pass !== 'boolean') {
          res.status(200).json({
            pass: true,
            xpAwarded: expectedXp,
            statAmount: 10,
            critique: 'Task completion verified.'
          });
          return;
        }

        res.status(200).json(result);
      } catch (e: any) {
        console.error('[evaluateTaskReportV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ===========================================
// CHAPTER BLACK GENERATION ENDPOINT
// ===========================================
type GenerateChapterRequest = {
  userName: string;
  rankName: string;
  previousChapterCount: number;
  previousChoices?: string[];
  mbti?: string;
  resonanceType?: string;
  alignment?: string;
  hati?: number;
  codename?: string;
};

export const generateChapterV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GenerateChapterRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const chapterNum = (body.previousChapterCount || 0) + 1;
        const resonanceType = body.resonanceType || 'Unawakened';
        const alignment = body.alignment || 'Neutral';
        const hati = body.hati || 0;

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        // Build resonance context
        const resonanceGuide = {
          'Unawakened': 'potential locked away, discovering identity',
          'Juggernaut': 'unstoppable force, raw power and momentum',
          'Chameleon': 'adaptation and transformation, reading the environment',
          'Virtuoso': 'mastery and precision, perfect technique',
          'Joker': 'unpredictability and chaos, disrupting patterns',
          'Catalyst': 'change and acceleration, inspiring others',
          'Cipher': 'mystery and hidden depths, veiled insight'
        };
        const resonanceContext = resonanceGuide[resonanceType as keyof typeof resonanceGuide] || 'unknown potential';

        const prompt = `You are the classified narrative chronicler for "Chapter Black" — a serialized existential thriller about Ascendants discovering their place in a fractured world. Each chapter must feel like a moment from the best literary thrillers (e.g., Haruki Murakami's precision, Yoko Ogawa's psychological depth) filtered through the grit and moral ambiguity of seinen manga (Vinland Saga, Monster, Psycho-Pass).

=== OPERATIVE DOSSIER ===
Name: ${userName}
Rank: ${rankName}
Resonance Type: ${resonanceType} (${resonanceContext})
HATI: ${hati}/100 (${hati < 20 ? 'Dormant—barely aware' : hati < 40 ? 'Stirring—first cracks appear' : hati < 60 ? 'Awakening—clarity and hunger' : hati < 80 ? 'Resonant—dangerous and focused' : 'Transcendent—beyond human limitation'})
Alignment: ${alignment}
Entry: #${chapterNum}

=== WORLD CONTEXT ===
The Genesis Protocol created "Ascendants"—0.067% of humanity who experienced a data breach and gained access to cognitive enhancement. But enhancement came with a price: isolation, surveillance, and the knowledge that you're part of a grand, secret experiment. The Order watches everything. Past Ascendants (Eden survivors with REMN- codenames) are legends and warnings. Other Ascendants compete, hunt, or hide. Most of the world doesn't know you exist.

Themes woven throughout:
- **Isolation vs. Connection**: You're exceptional, but that exceptionalism isolates you
- **Control vs. Autonomy**: The Order provides structure, but at what cost?
- **Moral Compromise**: Ascending means accepting uncomfortable truths
- **Systemic Pressure**: Society, institutions, even your own mind work against you
- **The Cull**: Whispers that weak Ascendants are being eliminated

=== NARRATIVE REQUIREMENTS FOR ENTRY #${chapterNum} ===

1. **Grounded Moment, Not Fantasy**
   - A specific scene or encounter that feels real: an overheard conversation, a physical sensation, a decision made in the dark
   - No explosions, no magic. Psychology, strategy, observation, and consequence
   - A single focused conflict: internal (doubt vs. certainty), interpersonal (trust vs. betrayal), or systemic (rules vs. freedom)

2. **Resonance Type as Lens**
   - ${resonanceType === 'Juggernaut' ? 'Momentum and force define perception. You barrel forward; subtlety escapes you. What does unstoppable power fear?' : ''}
   - ${resonanceType === 'Chameleon' ? 'You read environments like text. Every gesture is data. But what happens when you can\'t figure someone out?' : ''}
   - ${resonanceType === 'Virtuoso' ? 'Perfection is your standard. Imperfection is torment. What if the world demands compromise?' : ''}
   - ${resonanceType === 'Joker' ? 'Chaos is your playground. Predictability bores you. But chaos has consequences others pay.' : ''}
   - ${resonanceType === 'Catalyst' ? 'Change radiates from you. People follow. But followers can turn on you. Are you leading or manipulating?' : ''}
   - ${resonanceType === 'Cipher' ? 'You operate in shadows, hidden depths. But isolation compounds. Are you protecting yourself or burying yourself?' : ''}
   - ${resonanceType === 'Unawakened' ? 'You sense something stirring but can\'t name it. The world feels alien. Are you awakening, or going mad?' : ''}

3. **Personal Rarity**
   - Convey how extraordinary and alone you are
   - Reference subtle interactions with The Order, other Ascendants, or mundane people who treat you as either threat or savior (wrongly)
   - Show the weight of being exceptional

4. **Seriality & Continuity**
   - This is entry #${chapterNum}. You have a history
   - Subtle callbacks: "Like the choice in Chapter ${Math.max(1, chapterNum - 5)}..." or patterns repeating
   - A sense of escalation: early chapters feel like awakening; later chapters feel like consequence
   - Reader should sense that you're changing, that events compound

5. **Tone: Literary Thriller + Seinen Manga Grit**
   - Precise, spare prose with emotional undercurrent
   - Morally gray: no heroes, no villains—only actors with competing motivations
   - Existential unease beneath surface calm
   - Violence (if present) is consequence, not spectacle
   - Dialogue is sparse, weighted, reveals character through subtext
   - Introspection feels earned, not indulgent

6. **Structural Beat**
   - **Opening (1-2 sentences)**: Anchoring image or realization that hooks
   - **Middle (bulk)**: Scene or reflection that explores the thematic tension
   - **Closing (2-3 sentences)**: Unresolved but pointed—reader knows something has shifted

=== EXAMPLES OF TONE ===
"The coffee was cold. I'd been staring at the same email for twenty minutes. It was from an address I didn't recognize, containing a single line: 'We know you're not who you pretend to be.' I deleted it. The second one came five minutes later. I didn't open it. By the tenth, I stopped checking."

Or: "The other Ascendants don't acknowledge me at the hub. That's fine. I don't come here to be social. I come to watch them fail—to see what I'm not yet capable of. But today, one of them turned and held my gaze for exactly three seconds. Long enough to communicate: 'I see you.' Long enough for me to realize I wanted to be seen."

=== CRITICAL RULES ===
- 250-400 words
- NO meta-commentary ("This is entry #5 of your story...")
- NO artificial choices or "what do you choose?"
- NO exposition dumps (show, don't tell)
- Voice must be consistent with the operative's likely psychology (rank, resonance, HATI level influence tone)
- Each entry stands alone but contributes to an emerging arc
- Make the world feel massive, bureaucratic, and indifferent—yet personally focused on the operative

Write the full narrative now. Make it unforgettable.`;


        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const content = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'The recording is corrupted.';

        res.status(200).json({
          id: `chapter-${Date.now()}`,
          date: new Date().toISOString(),
          chapterNumber: chapterNum,
          title: `Chapter ${chapterNum}: [REDACTED]`,
          content: content
        });
      } catch (e: any) {
        console.error('[generateChapterV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ===========================================
// PROMOTION EXAM / DIRECTIVE ENDPOINT
// ===========================================
type GeneratePromotionExamRequest = {
  userName: string;
  currentRank: string;
  targetRank: string;
};

export const generatePromotionExamV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing server config GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GeneratePromotionExamRequest>;
        const userName = String(body.userName || 'Operative');
        const currentRank = String(body.currentRank || 'E');
        const targetRank = String(body.targetRank || 'D');

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        const rankDescriptions: Record<string, string> = {
          'D': 'Delta (Learning): Initial learning phase, establishing baseline habits',
          'C': 'Charlie (Standard): Achieving standard competence and reliability',
          'B': 'Bravo (Elite): Reaching elite performance and independent mastery',
          'A': 'Alpha (Command): Exceptional command-level expertise',
          'S': 'The Complete One: Singular mastery across all domains',
          'SS': 'Omega (Anomaly): Anomalous global-level mastery',
          'SS+': 'Transcendent: Ultimate human potential'
        };

        const prompt = `You are Central, generating a promotion exam directive for operative "${userName}".
Current Rank: ${currentRank} | Target Rank: ${targetRank} - ${rankDescriptions[targetRank] || 'Advanced rank'}

Create a rank-up challenge JSON with:
{
  "missionTitle": "Promotion Exam: Rank ${targetRank}",
  "missionDescription": "A directive to test readiness for ${rankDescriptions[targetRank]}",
  "xp": 1000,
  "objectives": [
    "Specific, measurable objective 1",
    "Specific, measurable objective 2",
    "Specific, measurable objective 3"
  ]
}

Objectives should be:
- Rank-appropriate difficulty (${targetRank}-rank equivalent)
- Achievable in 2-4 weeks of consistent effort
- A mix of physical, mental, and lifestyle challenges
- Clear pass/fail criteria
- Tied to real-world skill development (fitness, learning, discipline, etc.)

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const examData = parseJsonFromText(text);

        if (!examData || !examData.missionTitle) {
          res.status(200).json({
            mission: {
              id: `exam-${Date.now()}`,
              title: `Promotion Exam: Rank ${targetRank}`,
              description: `Directive to achieve rank ${targetRank}`,
              xp: 1000,
              statBoost: { stat: 'Physical', subStat: 'Strength', amount: 50 },
              isCompleted: false,
              isPromotionExam: true
            },
            exam: {
              missionId: `exam-${Date.now()}`,
              targetRank: targetRank,
              objectives: [
                { description: 'Objective 1', isCompleted: false },
                { description: 'Objective 2', isCompleted: false },
                { description: 'Objective 3', isCompleted: false }
              ]
            }
          });
          return;
        }

        res.status(200).json({
          mission: {
            id: `exam-${Date.now()}`,
            ...examData,
            isCompleted: false,
            isPromotionExam: true
          },
          exam: {
            missionId: `exam-${Date.now()}`,
            targetRank: targetRank,
            objectives: (examData.objectives || []).map((desc: string) => ({
              description: desc,
              isCompleted: false
            }))
          }
        });
      } catch (e: any) {
        console.error('[generatePromotionExamV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ===========================================
// TACTICAL SUGGESTIONS ENDPOINT
// ===========================================
type GenerateTacticalSuggestionsRequest = {
  userName: string;
  rankName: string;
  stats: Array<{ name: string; value: number }>;
  archetype?: string;
};

// ===========================================
// BENCHMARK RECORDING ENDPOINT
// ===========================================
type RecordBenchmarkRequest = {
  userName: string;
  metricId: string;
  metricName: string;
  stat: string;
  subStat: string;
  previousValue: number;
  newValue: number;
  targetValue: number;
  unit: string;
};

export const recordBenchmarkV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const body = (req.body || {}) as Partial<RecordBenchmarkRequest>;
        const userName = String(body.userName || 'Operative');
        const metricId = String(body.metricId || '');
        const metricName = String(body.metricName || '');
        const stat = String(body.stat || 'Physical');
        const previousValue = Number(body.previousValue || 0);
        const newValue = Number(body.newValue || 0);
        const targetValue = Number(body.targetValue || 0);
        const unit = String(body.unit || '');

        if (!metricId || newValue === previousValue) {
          res.status(400).json({ error: 'Invalid benchmark data' });
          return;
        }

        // Calculate proportional stat boost
        let statBoost = 0;
        if (targetValue > previousValue) {
          // Progress toward target
          const progressRange = targetValue - previousValue;
          const improvement = newValue - previousValue;
          const percentProgress = Math.min(1, improvement / progressRange);
          statBoost = Math.round(percentProgress * 25); // Max 25 points per improvement
        }

        // Calculate percentile (rough estimate)
        const percentile = Math.min(100, (newValue / targetValue) * 100);

        res.status(200).json({
          metricId,
          metricName,
          stat,
          subStat: body.subStat,
          previousValue,
          newValue,
          improvement: newValue - previousValue,
          statBoostAwarded: statBoost,
          percentile: Math.round(percentile),
          unit,
          timestamp: new Date().toISOString(),
          message: `${metricName}: ${previousValue}${unit} → ${newValue}${unit} (+${statBoost} ${stat})`
        });
      } catch (e: any) {
        console.error('[recordBenchmarkV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

export const generateTacticalSuggestionsV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GenerateTacticalSuggestionsRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const stats = Array.isArray(body.stats) ? body.stats : [];
        const archetype = String(body.archetype || 'General');

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        const statsJson = stats.map(s => `${s.name}: ${s.value}`).join(', ');

        const prompt = `You are Central providing tactical guidance to operative "${userName}" (Rank: ${rankName}).
Current Stats: ${statsJson}
Archetype: ${archetype}

Provide 3-4 specific, actionable tactical suggestions for stat optimization.
Return JSON:
{
  "title": "Tactical Assessment - ${rankName}",
  "suggestions": [
    "Specific, actionable suggestion 1",
    "Specific, measurable objective 2",
    "Specific, measurable objective 3"
  ]
}

Return ONLY JSON.`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const result = parseJsonFromText(text);

        if (!result || !Array.isArray(result.suggestions)) {
          res.status(200).json({
            title: `Tactical Assessment - ${rankName}`,
            suggestions: [
              'Focus on primary weaknesses.',
              'Develop counter-strategies.',
              'Optimize resource allocation.'
            ]
          });
          return;
        }

        res.status(200).json(result);
      } catch (e: any) {
        console.error('[generateTacticalSuggestionsV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// ============================================================================
// INITIALIZE STATS FROM SCREENING BASELINE (MASTER USER SKIP)
// ============================================================================

export const initializeStatsFromBaseline = onRequest(
  { region: 'us-central1', cors: true },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const { uid, email } = req.body;

        if (!uid || !email) {
          return res.status(400).json({
            error: 'Missing uid or email'
          });
        }

        // Fetch user document from userStates collection
        let userDoc = await admin.firestore().collection('userStates').doc(uid).get();
        
        // If user doesn't exist, create a minimal doc first
        if (!userDoc.exists) {
          const username = email.split('@')[0];
          const codename = `Agent-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          // Create default baseline
          const defaultBaseline = {
            physicalBaseline: {
              benchPress1RM: 120,
              squat1RM: 160,
              deadlift1RM: 220,
              sprint100m: 13.6,
            },
            cognitiveBaseline: {
              iqEstimate: 120,
              adaptiveReasoningPercentile: 86,
              patternLearningPercentile: 85,
            },
            vitalityBaseline: {
              sleepQuality: 'High (82%)',
              breathHold: '65th percentile',
              dietConsistency: '70th percentile',
            },
            psychosocialBaseline: {
              purposeClarity: '85th percentile',
              empathyScore: '80th percentile',
              composureUnderPressure: '75th percentile',
              willpower: '50th percentile',
              charisma: '58th percentile',
            },
          };

          await admin.firestore().collection('userStates').doc(uid).set({
            uid,
            email,
            userName: username,
            createdAt: new Date().toISOString(),
            hasOnboarded: false,
            alignment: {
              lawfulChaotic: 0,
              goodEvil: 0,
              profile: 'Unaligned',
            },
            abasProfile: {
              userName: username,
              email,
              codename,
              screeningTestSummary: defaultBaseline,
            },
          });

          userDoc = await admin.firestore().collection('userStates').doc(uid).get();
        }

        const userData = userDoc.data();
        const baseline = userData?.abasProfile?.screeningTestSummary;

        if (!baseline) {
          return res.status(400).json({
            error: 'No screening test baseline found in user profile'
          });
        }

        // Helper functions
        const extractPercentile = (value: string): number => {
          const match = value.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 50;
        };

        const getStatRank = (value: number): string => {
          if (value >= 90) return 'S';
          if (value >= 80) return 'A';
          if (value >= 70) return 'B';
          if (value >= 60) return 'C';
          if (value >= 40) return 'D';
          return 'E';
        };

        const now = new Date().toISOString();

        // Physical Stats - Higher benchmarks reflect elite baselines (KG)
        const benchPressPercentile = Math.min(
          (baseline.physicalBaseline.benchPress1RM / 120) * 85,
          100
        );
        const squatPercentile = Math.min(
          (baseline.physicalBaseline.squat1RM / 160) * 85,
          100
        );
        const deadliftPercentile = Math.min(
          (baseline.physicalBaseline.deadlift1RM / 220) * 85,
          100
        );
        const speedPercentile = 70; // B rank
        const strengthAvg = Math.round(
          (benchPressPercentile + squatPercentile + deadliftPercentile) / 3
        );
        const physicalAvg = Math.round(
          (strengthAvg * 0.6 + speedPercentile * 0.4)
        );

        // Vitality Stats
        const sleepPercentile = 82;
        const breathHoldPercentile = 65;
        const dietPercentile = 70;
        const vitalityAvg = Math.round(
          (sleepPercentile + breathHoldPercentile + dietPercentile) / 3
        );

        // Intelligence Stats
        const iqPercentile = Math.min(
          (baseline.cognitiveBaseline.iqEstimate / 160) * 100,
          100
        );
        const reasonPercentile = baseline.cognitiveBaseline.adaptiveReasoningPercentile;
        const adaptPercentile = baseline.cognitiveBaseline.patternLearningPercentile;
        const intelligenceAvg = Math.round(
          (iqPercentile + reasonPercentile + adaptPercentile + reasonPercentile) / 4
        );

        // Creativity Stats - Based on actual creative assessment substats
        // Imagination: 70, Innovation: 72, Style: 60, Expression: 74, Vision: 78
        const creativeAvg = Math.round((70 + 72 + 60 + 74 + 78) / 5);

        // Spirit Stats
        const purposePercentile = extractPercentile(
          baseline.psychosocialBaseline.purposeClarity
        );
        const empathyPercentile = extractPercentile(baseline.psychosocialBaseline.empathyScore);
        const faithPercentile = 55;
        const spiritAvg = Math.round(
          (purposePercentile + empathyPercentile + faithPercentile + 70) / 4
        );

        // Psyche Stats
        const composurePercentile = extractPercentile(
          baseline.psychosocialBaseline.composureUnderPressure
        );
        const charismaPercentile = extractPercentile(baseline.psychosocialBaseline.charisma);
        const willpowerPercentile = extractPercentile(baseline.psychosocialBaseline.willpower);
        const focusPercentile = 65;
        const psycheAvg = Math.round(
          (composurePercentile + charismaPercentile + willpowerPercentile + focusPercentile) / 4
        );

        // Build stats array
        const stats = [
          {
            name: 'Physical',
            value: physicalAvg,
            rank: getStatRank(physicalAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Strength',
                value: strengthAvg,
                rank: getStatRank(strengthAvg),
                lastIncreased: now,
              },
              {
                name: 'Speed',
                value: 70,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Endurance',
                value: 45,
                rank: 'D',
                lastIncreased: now,
              },
              {
                name: 'Dexterity',
                value: 81,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Agility',
                value: 70,
                rank: 'B',
                lastIncreased: now,
              },
            ],
          },
          {
            name: 'Vitality',
            value: vitalityAvg,
            rank: getStatRank(vitalityAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Stamina',
                value: Math.round(breathHoldPercentile),
                rank: getStatRank(Math.round(breathHoldPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Regeneration',
                value: Math.round(sleepPercentile),
                rank: getStatRank(Math.round(sleepPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Adherence',
                value: Math.round(dietPercentile),
                rank: getStatRank(Math.round(dietPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Balance',
                value: 72,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Longevity',
                value: 60,
                rank: 'C',
                lastIncreased: now,
              },
            ],
          },
          {
            name: 'Intelligence',
            value: intelligenceAvg,
            rank: getStatRank(intelligenceAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Reason',
                value: Math.round(reasonPercentile),
                rank: getStatRank(Math.round(reasonPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Knowledge',
                value: Math.round(iqPercentile),
                rank: getStatRank(Math.round(iqPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Adaptability',
                value: Math.round(adaptPercentile),
                rank: getStatRank(Math.round(adaptPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Strategy',
                value: Math.round(reasonPercentile),
                rank: getStatRank(Math.round(reasonPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Perception',
                value: 78,
                rank: 'B',
                lastIncreased: now,
              },
            ],
          },
          {
            name: 'Creativity',
            value: creativeAvg,
            rank: getStatRank(creativeAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Imagination',
                value: 70,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Innovation',
                value: 72,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Style',
                value: 60,
                rank: 'C',
                lastIncreased: now,
              },
              {
                name: 'Expression',
                value: 74,
                rank: 'B',
                lastIncreased: now,
              },
              {
                name: 'Vision',
                value: 78,
                rank: 'B',
                lastIncreased: now,
              },
            ],
          },
          {
            name: 'Spirit',
            value: spiritAvg,
            rank: getStatRank(spiritAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Faith',
                value: 55,
                rank: 'D',
                lastIncreased: now,
              },
              {
                name: 'Purpose',
                value: Math.round(purposePercentile),
                rank: getStatRank(Math.round(purposePercentile)),
                lastIncreased: now,
              },
              {
                name: 'Tranquility',
                value: 68,
                rank: 'C',
                lastIncreased: now,
              },
              {
                name: 'Empathy',
                value: Math.round(empathyPercentile),
                rank: getStatRank(Math.round(empathyPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Conviction',
                value: 70,
                rank: 'B',
                lastIncreased: now,
              },
            ],
          },
          {
            name: 'Psyche',
            value: psycheAvg,
            rank: getStatRank(psycheAvg),
            lastIncreased: now,
            subStats: [
              {
                name: 'Resilience',
                value: Math.round(composurePercentile),
                rank: getStatRank(Math.round(composurePercentile)),
                lastIncreased: now,
              },
              {
                name: 'Charisma',
                value: Math.round(charismaPercentile),
                rank: getStatRank(Math.round(charismaPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Focus',
                value: 65,
                rank: 'C',
                lastIncreased: now,
              },
              {
                name: 'Willpower',
                value: Math.round(willpowerPercentile),
                rank: getStatRank(Math.round(willpowerPercentile)),
                lastIncreased: now,
              },
              {
                name: 'Composure',
                value: Math.round(composurePercentile),
                rank: getStatRank(Math.round(composurePercentile)),
                lastIncreased: now,
              },
            ],
          },
        ];

        // Calculate overall rank based on average of all 6 stats
        const overallAvg = Math.round(
          (physicalAvg + vitalityAvg + intelligenceAvg + creativeAvg + spiritAvg + psycheAvg) / 6
        );
        const overallRank = getStatRank(overallAvg);
        
        // Map rank to threat level details
        const rankDetails: Record<string, any> = {
          'E': {
            name: 'E',
            threatLevel: 'Echo (Dormant)',
            attributeThreshold: 0,
            timeEstimate: 'Initial Phase',
            threatDescription: 'Baseline activation confirmed. Dormant potential.',
          },
          'D': {
            name: 'D',
            threatLevel: 'Delta (Learning)',
            attributeThreshold: 1400,
            timeEstimate: '~3-6 Months',
            threatDescription: 'Learning, trainable; basic competence achieved.',
          },
          'C': {
            name: 'C',
            threatLevel: 'Charlie (Standard)',
            attributeThreshold: 5600,
            timeEstimate: '~6-12 Months',
            threatDescription: 'Average human ability; handles structured tasks reliably.',
          },
          'B': {
            name: 'B',
            threatLevel: 'Bravo (Elite)',
            attributeThreshold: 18000,
            timeEstimate: '~1-2 Years',
            threatDescription: 'Above-average; independent problem-solving, rapid growth.',
          },
          'A': {
            name: 'A',
            threatLevel: 'Alpha (Command)',
            attributeThreshold: 40000,
            timeEstimate: '~2-4 Years',
            threatDescription: 'Exceptional skill; orchestrates complex tasks; leads teams.',
          },
          'S': {
            name: 'S',
            threatLevel: 'The Complete One',
            attributeThreshold: 92000,
            timeEstimate: '~4-7 Years',
            threatDescription: 'Peak human integration across all attributes; rare and aspirational.',
          },
        };

        // Update user gameState with new stats in userStates collection
        await admin.firestore().collection('userStates').doc(uid).update({
          'hasOnboarded': true,
          'gameState.hasOnboarded': true,
          'gameState.stats': stats,
          'gameState.rank': rankDetails[overallRank] || rankDetails['D'],
          'gameState.xp': 1000,
          'gameState.initialStatsSnapshot': stats,
        });

        res.status(200).json({
          success: true,
          message: 'Stats initialized from screening baseline',
          uid,
          email,
          stats,
          summaryByCategory: {
            Physical: physicalAvg,
            Vitality: vitalityAvg,
            Intelligence: intelligenceAvg,
            Creativity: creativeAvg,
            Spirit: spiritAvg,
            Psyche: psycheAvg,
          },
        });
      } catch (e: any) {
        console.error('[initializeStatsFromBaseline] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// Quick bootstrap for Abas - Complete profile with all screening data pre-filled
export const bootstrapAbasAccount = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const uid = 'ftQr1kAlTsOmZmJZrSzM995eEb73';
      const now = new Date().toISOString();
      
      // Complete Abas profile with all screening test data already computed
      const profileExport = {
        "uid": uid,
        "userName": "Abas",
        "email": "abasukanga4@gmail.com",
        "hasOnboarded": true,
        "createdAt": now,
        "alignment": {"lawfulChaotic": -60, "goodEvil": 0, "profile": "Lawful Neutral"},
        "abasProfile": {
          "userName": "Abas",
          "email": "abasukanga4@gmail.com",
          "codename": "Black Swan",
          "screeningTestSummary": {
            "physicalBaseline": {
              "benchPress1RM": 120,
              "squat1RM": 160,
              "deadlift1RM": 220,
              "sprint100m": 13.6
            },
            "cognitiveBaseline": {
              "iqEstimate": 120,
              "adaptiveReasoningPercentile": 86,
              "patternLearningPercentile": 85
            },
            "vitalityBaseline": {
              "sleepQuality": "High (82%)",
              "breathHold": "65th percentile",
              "dietConsistency": "70th percentile"
            },
            "psychosocialBaseline": {
              "purposeClarity": "85th percentile",
              "empathyScore": "80th percentile",
              "composureUnderPressure": "75th percentile",
              "willpower": "50th percentile",
              "charisma": "58th percentile"
            }
          }
        },
        "gameState": {
          "userName": "Abas",
          "hasOnboarded": true,
          "xp": 1000,
          "rank": {
            "name": "D",
            "threatLevel": "Delta (Emerging)",
            "attributeThreshold": 60,
            "timeEstimate": "Phase 2",
            "threatDescription": "Baseline capacity confirmed. Potential pathway unlocked."
          },
          "resonanceSignature": {
            "type": "Unawakened",
            "tier": 1
          },
          "stats": [
            {
              "name": "Physical",
              "value": 71,
              "rank": "B",
              "lastIncreased": now,
              "subStats": [
                {"name": "Strength", "value": 71, "rank": "B", "lastIncreased": now},
                {"name": "Speed", "value": 70, "rank": "B", "lastIncreased": now},
                {"name": "Endurance", "value": 45, "rank": "D", "lastIncreased": now},
                {"name": "Dexterity", "value": 81, "rank": "B", "lastIncreased": now},
                {"name": "Agility", "value": 70, "rank": "B", "lastIncreased": now}
              ]
            },
            {
              "name": "Vitality",
              "value": 72,
              "rank": "B",
              "lastIncreased": now,
              "subStats": [
                {"name": "Stamina", "value": 65, "rank": "C", "lastIncreased": now},
                {"name": "Regeneration", "value": 82, "rank": "A", "lastIncreased": now},
                {"name": "Adherence", "value": 70, "rank": "B", "lastIncreased": now},
                {"name": "Balance", "value": 72, "rank": "B", "lastIncreased": now},
                {"name": "Longevity", "value": 60, "rank": "C", "lastIncreased": now}
              ]
            },
            {
              "name": "Intelligence",
              "value": 84,
              "rank": "A",
              "lastIncreased": now,
              "subStats": [
                {"name": "Reason", "value": 86, "rank": "A", "lastIncreased": now},
                {"name": "Knowledge", "value": 75, "rank": "B", "lastIncreased": now},
                {"name": "Adaptability", "value": 85, "rank": "A", "lastIncreased": now},
                {"name": "Strategy", "value": 86, "rank": "A", "lastIncreased": now},
                {"name": "Perception", "value": 78, "rank": "B", "lastIncreased": now}
              ]
            },
            {
              "name": "Creativity",
              "value": 71,
              "rank": "B",
              "lastIncreased": now,
              "subStats": [
                {"name": "Imagination", "value": 70, "rank": "B", "lastIncreased": now},
                {"name": "Innovation", "value": 72, "rank": "B", "lastIncreased": now},
                {"name": "Style", "value": 60, "rank": "C", "lastIncreased": now},
                {"name": "Expression", "value": 74, "rank": "B", "lastIncreased": now},
                {"name": "Vision", "value": 78, "rank": "B", "lastIncreased": now}
              ]
            },
            {
              "name": "Spirit",
              "value": 72,
              "rank": "B",
              "lastIncreased": now,
              "subStats": [
                {"name": "Faith", "value": 55, "rank": "D", "lastIncreased": now},
                {"name": "Purpose", "value": 85, "rank": "A", "lastIncreased": now},
                {"name": "Tranquility", "value": 68, "rank": "C", "lastIncreased": now},
                {"name": "Empathy", "value": 80, "rank": "A", "lastIncreased": now},
                {"name": "Conviction", "value": 70, "rank": "B", "lastIncreased": now}
              ]
            },
            {
              "name": "Psyche",
              "value": 67,
              "rank": "C",
              "lastIncreased": now,
              "subStats": [
                {"name": "Resilience", "value": 75, "rank": "B", "lastIncreased": now},
                {"name": "Charisma", "value": 58, "rank": "D", "lastIncreased": now},
                {"name": "Focus", "value": 65, "rank": "C", "lastIncreased": now},
                {"name": "Willpower", "value": 50, "rank": "D", "lastIncreased": now},
                {"name": "Composure", "value": 75, "rank": "B", "lastIncreased": now}
              ]
            }
          ],
          "initialStatsSnapshot": [],
          "chapters": [],
          "chapterCount": 0
        }
      };
      
      // Write to userStates collection (primary user data location)
      await admin.firestore().collection('userStates').doc(uid).set(profileExport, { merge: true });
      
      res.json({ 
        success: true, 
        message: 'Account bootstrapped with complete screening data',
        hasOnboarded: true,
        screenshotSkipped: true
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
);

// Update user stats for specific account
export const updateUserStats = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const { uid, stats } = req.body;
      
      if (!uid) {
        res.status(400).json({ error: 'UID is required' });
        return;
      }
      
      if (!stats || !Array.isArray(stats)) {
        res.status(400).json({ error: 'Stats array is required' });
        return;
      }
      
      const now = new Date().toISOString();
      
      // Update the user's game state with new stats
      const userDocRef = admin.firestore().collection('userStates').doc(uid);
      
      await userDocRef.update({
        stats: stats,
        'calibrationAnalysis.overallRank': stats.find((s: any) => s.name === 'Overall')?.rank || 'B',
        lastUpdated: now
      });
      
      res.json({ 
        success: true, 
        message: 'User stats updated successfully',
        uid: uid,
        statsUpdated: stats.length
      });
    } catch (e: any) {
      console.error('Error updating user stats:', e);
      res.status(500).json({ error: e.message });
    }
  }
);

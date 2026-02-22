// services/aiProxy.ts
// Minimal client for talking to server-side AI endpoints.

export async function fetchCompanionGreeting(params: { userName: string; rankName: string }) {
  const resp = await fetch('/api/companionGreetingV2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`companionGreetingV2 failed: ${resp.status} ${text}`);
  }

  return (await resp.json()) as { text: string };
}

export async function sendOrderMessage(params: {
  userName: string;
  rankName: string;
  history: Array<{ role: 'user' | 'model'; content: string }>;
  message: string;
}) {
  const resp = await fetch('/api/orderChatV2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`orderChatV2 failed: ${resp.status} ${text}`);
  }

  return (await resp.json()) as { text: string };
}

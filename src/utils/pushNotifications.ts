import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a URL-safe base64 VAPID public key to the Uint8Array that
 * pushManager.subscribe() expects as `applicationServerKey`.
 *
 * This is the canonical implementation — matches the web-push npm package
 * and the W3C Push API spec exactly.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  // Allocate with an explicit ArrayBuffer so the type satisfies the Push API's
  // BufferSource constraint (which requires ArrayBuffer, not ArrayBufferLike).
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
  // ── Requested early diagnostic logs ───────────────────────────────────────
  console.log('[Push] Starting subscription...');
  console.log('[Push] VAPID key:', import.meta.env.VITE_VAPID_PUBLIC_KEY?.substring(0, 20));

  try {
    // ── 1. Feature-detect ──────────────────────────────────────────────────
    if (!('serviceWorker' in navigator)) {
      console.error('[Push] FAIL — serviceWorker not supported in this browser.');
      return null;
    }
    if (!('PushManager' in window)) {
      console.error('[Push] FAIL — PushManager not supported in this browser.');
      return null;
    }

    // ── 2. Validate VAPID key ──────────────────────────────────────────────
    const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
    if (!VAPID_KEY) {
      console.error(
        '[Push] FAIL — VITE_VAPID_PUBLIC_KEY is not set.\n' +
        'Add it to your .env file (local) and Vercel environment variables (prod).'
      );
      return null;
    }
    console.log('[Push] VAPID key length:', VAPID_KEY.length, '(expected 87 for unpadded base64url)');

    // ── 3. Wait for the controlling service worker ─────────────────────────
    // We do NOT register sw.js here — main.tsx already handles registration
    // on page load. We just wait for whatever SW is in control.
    console.log('[Push] Step 1 — waiting for service worker via navigator.serviceWorker.ready…');
    const registration = await navigator.serviceWorker.ready;
    console.log('[Push] Step 1 ✓ SW ready. Scope:', registration.scope, '| Active SW:', registration.active?.scriptURL);

    // ── 4. Request notification permission ────────────────────────────────
    console.log('[Push] Step 2 — requesting Notification permission…');
    const permission = await Notification.requestPermission();
    console.log('[Push] Step 2 — permission result:', permission);
    if (permission !== 'granted') {
      console.warn('[Push] Step 2 — user did not grant permission. Aborting.');
      return null;
    }

    // ── 5. Convert VAPID key ───────────────────────────────────────────────
    console.log('[Push] Step 3 — converting VAPID key to Uint8Array…');
    let applicationServerKey: Uint8Array;
    try {
      applicationServerKey = urlBase64ToUint8Array(VAPID_KEY);
    } catch (e) {
      console.error('[Push] Step 3 ✗ — VAPID key conversion threw:', e);
      throw e;
    }
    console.log('[Push] Step 3 ✓ — key byte length:', applicationServerKey.length, '(expected 65)');

    // ── 6. Subscribe ───────────────────────────────────────────────────────
    console.log('[Push] Step 4 — calling pushManager.subscribe()…');
    let subscription: PushSubscription;
    try {
      // Pass the key read fresh from env (not a cached module-level variable)
      // to match exactly what the user requested.
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
      });
    } catch (subErr: any) {
      console.error(
        '[Push] Step 4 ✗ — pushManager.subscribe() threw:', subErr.name, subErr.message,
        '\n  Common causes of AbortError / "push service error":',
        '\n  • VITE_VAPID_PUBLIC_KEY does not match the private key used by web-push on the server',
        '\n  • The SW scope is not at root "/" (current scope:', registration.scope, ')',
        '\n  • The browser cannot reach the FCM/Mozilla push endpoint (network issue)',
        '\n  • An existing subscription used a different VAPID key — try unsubscribing first',
        '\n  Full error object:', subErr
      );
      throw subErr;
    }
    console.log('[Push] Step 4 ✓ — subscribed. Endpoint prefix:', subscription.endpoint.slice(0, 50) + '…');

    // ── 7. Persist to Supabase ─────────────────────────────────────────────
    console.log('[Push] Step 5 — saving subscription to Supabase…');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[Push] Step 5 — no authenticated Supabase user. Subscription not persisted.');
      return subscription;
    }

    // upsert so repeat calls don't fail on unique constraint
    const { error: dbError } = await supabase
      .from('push_subscriptions')
      .upsert(
        { user_id: user.id, subscription: subscription.toJSON() },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('[Push] Step 5 ✗ — Supabase upsert error:', dbError);
      throw dbError;
    }

    console.log('[Push] Step 5 ✓ — subscription saved for user:', user.id);
    return subscription;

  } catch (err) {
    console.error('[Push] subscribeUserToPush() failed:', err);
    return null;
  }
}

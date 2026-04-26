import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// VAPID key — read from env and log availability immediately at module load
// ---------------------------------------------------------------------------
const PUBLIC_VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
console.log('[Push] VAPID Public Key available:', !!PUBLIC_VAPID_KEY);
if (PUBLIC_VAPID_KEY) {
  // Log first 10 chars so we can verify the right key is loaded without
  // leaking the whole value.
  console.log('[Push] VAPID key prefix:', PUBLIC_VAPID_KEY.slice(0, 10) + '…');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a URL-safe base64 VAPID public key to the Uint8Array that
 * pushManager.subscribe() expects as `applicationServerKey`.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Ensure our custom service worker is registered and fully active before
 * trying to create a push subscription. Returns the ServiceWorkerRegistration.
 */
async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  // Check whether /sw.js is already registered to avoid double-registration.
  const existing = await navigator.serviceWorker.getRegistration('/');
  if (existing) {
    console.log('[Push] Existing SW registration found, scope:', existing.scope);
    // Wait for it to become active if it isn't yet.
    if (!existing.active) {
      console.log('[Push] Waiting for existing SW to activate…');
      await navigator.serviceWorker.ready;
    }
    return existing;
  }

  // Register fresh.
  console.log('[Push] Registering /sw.js…');
  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  });
  console.log('[Push] SW registered, scope:', registration.scope);

  // Wait until it is actually controlling the page.
  if (!registration.active) {
    console.log('[Push] Waiting for SW to become active…');
    await navigator.serviceWorker.ready;
    console.log('[Push] SW is now active.');
  }

  return registration;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
  try {
    // ── 1. Feature-detect ──────────────────────────────────────────────────
    if (!('PushManager' in window)) {
      console.warn('[Push] PushManager is not supported in this browser.');
      return null;
    }

    // ── 2. Validate VAPID key ──────────────────────────────────────────────
    if (!PUBLIC_VAPID_KEY) {
      console.error(
        '[Push] VITE_VAPID_PUBLIC_KEY is missing from env. ' +
        'Check your .env file and Vercel environment variables.'
      );
      return null;
    }

    // ── 3. Ensure service worker is ready ──────────────────────────────────
    console.log('[Push] Step 1 — ensuring service worker…');
    const registration = await ensureServiceWorker();
    console.log('[Push] Step 1 ✓ Service worker ready.');

    // ── 4. Request notification permission ────────────────────────────────
    console.log('[Push] Step 2 — requesting notification permission…');
    const permission = await Notification.requestPermission();
    console.log('[Push] Step 2 — permission result:', permission);
    if (permission !== 'granted') {
      console.warn('[Push] User did not grant notification permission.');
      return null;
    }
    console.log('[Push] Step 2 ✓ Permission granted.');

    // ── 5. Convert VAPID key ───────────────────────────────────────────────
    console.log('[Push] Step 3 — converting VAPID public key…');
    let applicationServerKey: Uint8Array;
    try {
      applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
      console.log(
        '[Push] Step 3 ✓ VAPID key converted, byte length:',
        applicationServerKey.length
      );
    } catch (convErr) {
      console.error('[Push] Step 3 ✗ VAPID key conversion failed:', convErr);
      throw convErr;
    }

    // ── 6. Subscribe to push ───────────────────────────────────────────────
    console.log('[Push] Step 4 — calling pushManager.subscribe()…');
    let subscription: PushSubscription;
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      console.log('[Push] Step 4 ✓ Subscribed:', subscription.endpoint.slice(0, 60) + '…');
    } catch (subErr) {
      console.error(
        '[Push] Step 4 ✗ pushManager.subscribe() failed.\n' +
        '  ➜ If this is an AbortError / "push service error", the most likely ' +
        'cause is a VAPID key mismatch — ensure VITE_VAPID_PUBLIC_KEY in your ' +
        'env matches the key used by web-push on the server.\n' +
        '  ➜ Raw error:',
        subErr
      );
      throw subErr;
    }

    // ── 7. Persist subscription to Supabase ───────────────────────────────
    console.log('[Push] Step 5 — saving subscription to Supabase…');
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn('[Push] Step 5 — no authenticated user, subscription not saved.');
      return subscription;
    }

    // Use upsert on (user_id) to avoid duplicate-subscription insert errors
    // if the user goes through the prompt more than once.
    const { error: dbError } = await supabase
      .from('push_subscriptions')
      .upsert(
        { user_id: user.id, subscription: subscription.toJSON() },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('[Push] Step 5 ✗ Supabase upsert error:', dbError);
      throw dbError;
    }

    console.log('[Push] Step 5 ✓ Subscription saved for user:', user.id);
    return subscription;

  } catch (error) {
    console.error('[Push] subscribeUserToPush() failed with:', error);
    return null;
  }
}

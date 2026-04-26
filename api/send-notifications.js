import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Initialize Web Push
webpush.setVapidDetails(
  'mailto:support@aya-game.com',
  process.env.VITE_VAPID_PUBLIC_KEY || 'BJ3xcv7SUQBXi1J2v1tTAlEiu7J4eImjbKYxXU-V_TI2ijPSj04lkAUd_tqnIdQu3pGhGIMYzLgeLxnRopoIRpE',
  process.env.VAPID_PRIVATE_KEY || '8DfK0SiZlz_9Tria0G97D9WRL-zzxaIMtm0NgQomTCQ'
);

/**
 * Rotating pool of motivational bodies for users with an active streak.
 * Supports [Name] and [X] template placeholders.
 */
const STREAK_BODIES = [
  "[Name], at your age Sachin was already playing for India. What are YOU building?",
  "Your [X] day streak says a lot about you. Don't let it die tonight.",
  "[Name], legends aren't born — they show up daily. Like you have for [X] days.",
  "At your age, Kobe was training at 4AM. You just need to open the app. 🏀",
  "[Name], your daily challenge takes 5 minutes. Your streak takes a lifetime to build.",
];

/**
 * Pick a body template from the rotating pool based on the current day,
 * then substitute [Name] and [X] with real values.
 */
function buildStreakBody(name, streakDays) {
  const dayIndex = new Date().getDate() % STREAK_BODIES.length;
  return STREAK_BODIES[dayIndex]
    .replace(/\[Name\]/g, name)
    .replace(/\[X\]/g, streakDays);
}

/**
 * Build the notification payload for a single user based on their state.
 *
 * States (evaluated in priority order):
 *  1. Completed challenge today already
 *  2. Active streak (streak > 0, not completed today)
 *  3. Broken streak (has been active before, streak = 0)
 *  4. New user (no stories completed yet)
 */
function buildNotification(user) {
  const name = user.name || 'Legend';
  const streak = user.current_streak || 0;

  // Determine if the user has completed today's challenge.
  // `last_challenge_date` is expected to be a date string (e.g. "2026-04-26").
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = user.last_challenge_date === today;

  if (completedToday) {
    return {
      title: `🌟 You showed up today, ${name}`,
      body: "That's what legends do. Come back tomorrow to keep your streak alive.",
    };
  }

  if (streak > 0) {
    // Pick a random idol for the "personal touch" title variant
    const idols = ['Sachin', 'Kobe', 'SRK', 'Elon', 'Jobs', 'Musk', 'Ronaldo'];
    const idol = idols[new Date().getDate() % idols.length];
    return {
      title: `🔥 Day ${streak} — Don't break it now`,
      body: buildStreakBody(name, streak).includes('[Name]')
        // Fallback in case template substitution missed something
        ? `${name}, at your age ${idol} was already building their legacy. Your streak is alive. Keep it that way.`
        : buildStreakBody(name, streak),
    };
  }

  if (user.last_active_date) {
    // Broken streak — user has been active before
    return {
      title: `⚡ Start fresh, ${name}`,
      body: "SRK was rejected 100 times at your age. He showed up anyway. Your daily challenge is waiting.",
    };
  }

  // New user — no stories completed yet
  return {
    title: `👋 ${name}, your story is waiting`,
    body: "What would you have done at Kobe's age? Step into their shoes today.",
  };
}

export default async function handler(req, res) {
  // Only allow GET for cron jobs
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Check for Vercel Cron secret to prevent unauthorized calls
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    // 1. Fetch all push subscriptions with associated user data
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*, users:user_id(*)');

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'No subscriptions found' });
    }

    // 2. Process notifications in parallel
    const notifications = subscriptions.map(async (sub) => {
      const user = sub.users;
      if (!user) return null;

      const { title, body } = buildNotification(user);

      const payload = JSON.stringify({
        title,
        body,
        url: '/?challenge=true'
      });

      try {
        await webpush.sendNotification(sub.subscription, payload);
        return { status: 'fulfilled', userId: user.id };
      } catch (err) {
        console.error(`Failed to send push to ${user.id}:`, err);
        // If subscription is expired or revoked, clean it up
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        return { status: 'rejected', userId: user.id, error: err.message };
      }
    });

    const results = await Promise.all(notifications);
    const fulfilled = results.filter(r => r && r.status === 'fulfilled').length;
    const rejected = results.filter(r => r && r.status === 'rejected').length;

    return res.status(200).json({
      success: true,
      processed: results.length,
      sent: fulfilled,
      failed: rejected
    });

  } catch (error) {
    console.error('Fatal Push Notification Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

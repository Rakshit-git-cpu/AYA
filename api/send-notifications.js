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
  process.env.VITE_VAPID_PUBLIC_KEY || 'BKuBEyjIX-OtnnyJ7cyBMLwAycYv6POyGVFIxPnlzbReZLxv3S-QP9wcJ-YIE38w_al1tqIDwSf41MUG8JgipZE',
  process.env.VAPID_PRIVATE_KEY || 'HHW51N5h_f1ofvSD3fJvVvToP93qk9lwr7_X7PuuPXo'
);

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
    // Note: We use a join to get user streak and activity status
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

      let title = 'AYA Daily Challenge';
      let body = `👋 ${user.name || 'Traveler'}, your daily story is waiting. What will you learn today?`;

      if (user.current_streak > 0) {
        title = '🔥 Streak Alert!';
        body = `🔥 ${user.name || 'Traveler'}! Your ${user.current_streak} day streak is waiting. Complete today's challenge before midnight!`;
      } else if (user.last_active_date) {
        title = '⚡ Start Fresh';
        body = `⚡ ${user.name || 'Traveler'}, start fresh today. Your daily challenge is ready!`;
      }

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
        // If subscription is expired or revoked, we should delete it
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

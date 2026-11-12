import { env } from '../config/env.js';
import { cacheService } from './cache.service.js';
import { logger } from '../utils/logger.js';

interface MusicTrack {
  artist: string;
  title: string;
  isPlaying?: boolean;
}

export class MusicService {
  private static CACHE_KEY = 'currently:music_track';
  private static CACHE_TTL_MS = 60 * 1000; // 60 seconds

  /**
   * Attempt to fetch real-time track from Last.fm or Spotify, caching the result.
   * Returns formatted string (e.g. "Artist - Track") or null if unavailable.
   */
  static async getCurrentListeningTrack(): Promise<string | null> {
    const cached = cacheService.get<string>(this.CACHE_KEY);
    if (cached !== null) {
      return cached;
    }

    let trackString: string | null = null;

    if (env.LASTFM_API_KEY && env.LASTFM_USERNAME) {
      trackString = await this.fetchFromLastFm();
    } else if (env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_REFRESH_TOKEN) {
      trackString = await this.fetchFromSpotify();
    }

    if (trackString) {
      cacheService.set(this.CACHE_KEY, trackString, this.CACHE_TTL_MS);
    }

    return trackString;
  }

  private static async fetchFromLastFm(): Promise<string | null> {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
        env.LASTFM_USERNAME!
      )}&api_key=${env.LASTFM_API_KEY}&format=json&limit=1`;

      const response = await fetch(url, { headers: { 'User-Agent': 'AnumPortfolioBackend/1.0' } });
      if (!response.ok) return null;

      const data = (await response.json()) as any;
      const track = data?.recenttracks?.track?.[0];
      if (!track) return null;

      const artist = track.artist?.['#text'] || track.artist?.name;
      const title = track.name;
      const isNowPlaying = track['@attr']?.nowplaying === 'true';

      if (artist && title) {
        return isNowPlaying ? `🎧 Listening to: ${artist} - ${title}` : `${artist} - ${title}`;
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to fetch Last.fm track; falling back to database value.');
    }
    return null;
  }

  private static async fetchFromSpotify(): Promise<string | null> {
    try {
      // Refresh Spotify Access Token
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: env.SPOTIFY_REFRESH_TOKEN!,
        }),
      });

      if (!tokenRes.ok) return null;
      const tokenData = (await tokenRes.json()) as any;
      const accessToken = tokenData.access_token;

      // Get currently playing track
      const playbackRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (playbackRes.status === 204 || playbackRes.status > 400) return null;
      const playbackData = (await playbackRes.json()) as any;

      if (playbackData?.item) {
        const artist = playbackData.item.artists?.map((a: any) => a.name).join(', ');
        const song = playbackData.item.name;
        return playbackData.is_playing ? `🎧 Playing: ${artist} - ${song}` : `${artist} - ${song}`;
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to fetch Spotify track; falling back to database value.');
    }
    return null;
  }
}

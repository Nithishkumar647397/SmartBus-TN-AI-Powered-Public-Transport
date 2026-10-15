import { BusLive } from '../api/client';

export interface LiveStatusInfo {
  isLive: boolean;
  statusText: string;
  badgeColor: string;
  etaDisplay: string;
}

/**
 * Calculates live status according to strict staleness rules:
 * - If position is older than 2 minutes (> 120s): "No live data" or "Last updated X min ago"
 * - If position <= 120s: "LIVE"
 * - NEVER fabricate live status or ETA!
 */
export function formatLiveStatus(live?: BusLive | null): LiveStatusInfo {
  if (!live || live.seconds_since_last_update === null || live.seconds_since_last_update === undefined) {
    return {
      isLive: false,
      statusText: 'No live data',
      badgeColor: '#94A3B8',
      etaDisplay: 'No live ETA',
    };
  }

  const seconds = live.seconds_since_last_update;

  // Stale position (> 120 seconds = 2 minutes)
  if (seconds > 120) {
    const mins = Math.floor(seconds / 60);
    const text = mins > 60 ? 'No live data' : `Last updated ${mins} min ago`;
    return {
      isLive: false,
      statusText: text,
      badgeColor: '#F59E0B',
      etaDisplay: 'No live ETA',
    };
  }

  // Active live position
  return {
    isLive: true,
    statusText: 'LIVE',
    badgeColor: '#10B981',
    etaDisplay: live.speed && live.speed > 0 ? `${Math.round(live.speed)} km/h` : 'Tracking',
  };
}

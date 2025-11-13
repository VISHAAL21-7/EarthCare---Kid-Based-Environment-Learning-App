
export type EarthState = "Healthy" | "Damaged" | "Critical";

export interface AppState {
  mode: "kid" | "dev";
  kidName: string;
  earthState: EarthState;
  shieldsRemaining: number;
  consecutiveMisses: number;
  approvedPhotos: number;
  badgeCount: number;
  lastCheckInDate: string | null;
}

export type View = 
  | 'kid-home'
  | 'kid-check-in'
  | 'kid-repair'
  | 'kid-upload'
  | 'kid-badge-awarded'
  | 'dev-unlock'
  | 'dev-dashboard';
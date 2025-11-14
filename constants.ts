import { AppState } from './types';

export const GOOGLE_FORM_URL = "https://forms.gle/rk371eZD24Usr3nK8";
export const DEV_PASSCODE = "EARTHADMIN2025";
export const TEN_MINUTES_MS = 10 * 60 * 1000;

export const BADGE_TITLES = [
  "", // Index 0, no badge
  "Eco Hero",
  "Eco Warrior",
  "Eco Saviour",
  "Eco Champion",
  "Planet Guardian"
];

export const INITIAL_STATE: AppState = {
  mode: "kid",
  kidName: "TestKid",
  earthState: "Healthy",
  shieldsRemaining: 2,
  consecutiveMisses: 0,
  approvedPhotos: 0,
  badgeCount: 0,
  streak: 0,
  lastCheckInTimestamp: null,
  lastUploadTimestamp: null,
  storyIndex: 0,
  lastStoryCompletionTimestamp: null,
  lastCheckInWasSkip: false,
};
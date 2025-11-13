
import { AppState } from './types';

export const GOOGLE_FORM_URL = "https://forms.gle/rk371eZD24Usr3nK8";
export const DEV_PASSCODE = "EARTHADMIN2025";

export const INITIAL_STATE: AppState = {
  mode: "kid",
  kidName: "TestKid",
  earthState: "Healthy",
  shieldsRemaining: 2,
  consecutiveMisses: 0,
  approvedPhotos: 0,
  badgeCount: 0,
  lastCheckInDate: null,
};
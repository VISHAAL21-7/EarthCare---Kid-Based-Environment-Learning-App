export type SoundEffect =
  | 'click'
  | 'success'
  | 'error'
  | 'win'
  | 'pickup'
  | 'pageTurn'
  | 'badge'
  | 'wobble'
  | 'flutter'
  | 'splash'
  | 'powerup';

const audioFiles: Record<SoundEffect, string> = {
  click: 'https://actions.google.com/sounds/v1/ui/button_press.mp3',
  success: 'https://actions.google.com/sounds/v1/positive/success.mp3',
  error: 'https://actions.google.com/sounds/v1/negative/failure.mp3',
  win: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.mp3',
  pickup: 'https://actions.google.com/sounds/v1/impacts/light_object_fall_on_grass.mp3',
  pageTurn: 'https://actions.google.com/sounds/v1/foley/page_turn.mp3',
  badge: 'https://actions.google.com/sounds/v1/magical/magic_chime.mp3',
  wobble: 'https://actions.google.com/sounds/v1/cartoon/wobble.mp3',
  flutter: 'https://actions.google.com/sounds/v1/foley/animal_wing_flaps_flutter.mp3',
  splash: 'https://actions.google.com/sounds/v1/water/splash.mp3',
  powerup: 'https://actions.google.com/sounds/v1/magical/magic_spell.mp3',
};

const playSound = (sound: SoundEffect, volume: number = 0.5) => {
  try {
    // Create a new Audio object for each playback.
    // This is more robust against browser autoplay policies and allows for overlapping sounds.
    const audio = new Audio(audioFiles[sound]);
    audio.volume = volume;
    audio.play().catch(e => console.error(`Could not play sound: ${sound}`, e));
  } catch (error) {
    console.error(`Error playing sound ${sound}:`, error);
  }
};

export default playSound;
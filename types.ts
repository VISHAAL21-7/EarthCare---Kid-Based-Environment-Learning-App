
export type EarthState = "Healthy" | "Damaged" | "Critical";

export interface AppState {
  mode: "kid" | "dev";
  kidName: string;
  earthState: EarthState;
  shieldsRemaining: number;
  consecutiveMisses: number;
  approvedPhotos: number;
  badgeCount: number;
  streak: number;
  lastCheckInTimestamp: number | null;
  lastUploadTimestamp: number | null;
  storyIndex: number;
  lastStoryCompletionTimestamp: number | null;
}

export type View = 
  | 'kid-home'
  | 'kid-check-in'
  | 'kid-repair'
  | 'kid-upload'
  | 'kid-badge-awarded'
  | 'dev-unlock'
  | 'dev-dashboard'
  | 'kid-sapling-game'
  | 'kid-story';

// --- Interactive Story Types ---

export interface TapTarget {
  id: number;
  emoji: string;
  x: number; // percentage left
  y: number; // percentage top
}

export interface DragItem {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
}

export interface DropZone {
  id: number;
  emoji: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SortDragItem extends DragItem {
  correctZoneId: number;
}

export interface SortDropZone extends DropZone {}

export interface SortInteractionData {
  items: SortDragItem[];
  zones: SortDropZone[];
}

export interface CatchAndSortItem {
  emoji: string;
  correctZoneId: number;
}

export interface CatchAndSortZone extends DropZone {
    name: string;
}

export interface CatchAndSortInteractionData {
    itemsToSpawn: CatchAndSortItem[];
    zones: CatchAndSortZone[];
    totalToCatch: number;
}

export interface StoryInteraction {
  type: 'tap-collect' | 'drag-drop' | 'sort' | 'catch-and-sort';
  prompt: string;
  data: {
    targets?: TapTarget[];
    draggable?: DragItem;
    dropZone?: DropZone;
    sortables?: SortInteractionData;
    catchAndSort?: CatchAndSortInteractionData;
  };
}

export interface StoryPage {
  image: string;
  text: string;
  interaction?: StoryInteraction;
  choice?: {
    prompt:string;
    options: { text: string; response: string }[];
  };
}

export interface Story {
  title: string;
  character: string;
  pages: StoryPage[];
}
export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  x: number;
  y: number;
  layerId: string;
}

export interface EventConnection {
  id: string;
  fromEventId: string;
  toEventId: string;
  description: string;
  type: 'cause-effect' | 'related';
}

export interface TimelineLayer {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  opacity: number;
  events: TimelineEvent[];
  connections: EventConnection[];
}

export interface TimelineDocument {
  id: string;
  name: string;
  layers: TimelineLayer[];
  activeLayerId: string;
  zoom: number;
  panX: number;
  panY: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
}

export interface AppState {
  user: User | null;
  currentDocument: TimelineDocument | null;
  documents: TimelineDocument[];
  isLayersPanelOpen: boolean;
}

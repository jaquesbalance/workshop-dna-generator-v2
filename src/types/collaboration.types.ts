export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export type SessionState = 'active' | 'paused' | 'ended';

export interface Session {
  id: string;
  workshopId: string;
  participants: Map<string, import('./workshop.types').User>;
  state: SessionState;
  lastActivity: Date;
  metadata?: {
    createdAt: Date;
    facilitatorId: string;
    maxParticipants?: number;
  };
}

export type MessageType =
  | 'join_session'
  | 'leave_session'
  | 'state_update'
  | 'cursor_position'
  | 'user_presence'
  | 'error'
  | 'sync_request'
  | 'sync_response'
  | 'session_joined';

export interface WebSocketMessage {
  type: MessageType;
  sessionId: string;
  userId: string;
  timestamp: number;
  data?: any;
}

export interface TextOperation {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

export interface CursorPosition {
  userId: string;
  fieldPath: string;
  position: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface UserPresenceData {
  userId: string;
  userName: string;
  avatar?: string;
  status: 'active' | 'idle' | 'away';
  currentLocation?: string;
  lastSeen: Date;
}

export interface CollaborationState {
  sessionId: string | null;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  participants: Map<string, import('./workshop.types').User>;
  cursors: Map<string, CursorPosition>;
  presence: Map<string, UserPresenceData>;
  pendingOperations: TextOperation[];
  lastSyncTimestamp: number;
}

export interface CollaborationContext {
  sessionId: string;
  userId: string;
  userName: string;
  role: import('./workshop.types').UserRole;
}

export type CollaborationEvent =
  | { type: 'CONNECT'; sessionId: string; userId: string }
  | { type: 'DISCONNECT' }
  | { type: 'MESSAGE'; message: WebSocketMessage }
  | { type: 'ERROR'; error: string }
  | { type: 'RETRY' }
  | { type: 'SYNC' }
  | { type: 'UPDATE_PRESENCE'; presence: UserPresenceData };
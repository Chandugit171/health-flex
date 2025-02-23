export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remainingTime: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  halfwayAlert?: boolean;
}

export interface TimerLog {
  id: string;
  timerId: string;
  timerName: string;
  category: string;
  completedAt: string;
}

export interface Category {
  name: string;
  expanded: boolean;
}
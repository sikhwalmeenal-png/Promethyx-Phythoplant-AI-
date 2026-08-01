export interface SensorReading {
  moisture: number;
  humidity: number;
  temperature: number;
  bioelectricSignal: number;
  stressScore: number;
  timestamp: string;
}

export interface ChatMessage {
  sender: 'plant' | 'user';
  text: string;
  timestamp: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  health: number;
  moisture: number;
  humidity: number;
  temperature: number;
  bioelectricSignal: number;
  stressScore: number;
  stressLevel: 'Optimal' | 'Mild Stress' | 'High Stress' | 'Critical';
  lastWatered: string;
  nextWatering: string;
  isIndoor: boolean;
  status: 'Healthy' | 'Needs Attention' | 'Critical';
  alertBadge: string | null;
  history: SensorReading[];
  dialogue: string;
  chatHistory: ChatMessage[];
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  timestamp: string;
  plantId?: string;
  plantName?: string;
  resolved: boolean;
}

export interface AutomationConfig {
  autoIrrigation: boolean;
  autoFan: boolean;
  smartAlerts: boolean;
  aiWhisperer: boolean;
}

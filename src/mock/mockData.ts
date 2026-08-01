import { Plant, AlertItem } from '../types';

const generateMockHistory = (
  baseMoisture: number,
  baseTemp: number,
  baseHumidity: number,
  baseBio: number,
  baseStress: number
) => {
  const history = [];
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'];
  
  for (let i = 0; i < hours.length; i++) {
    const varMoisture = baseMoisture + Math.sin(i * 0.8) * 3 + (Math.random() - 0.5) * 2;
    const varTemp = baseTemp + Math.cos(i * 0.5) * 2 + (Math.random() - 0.5) * 1;
    const varHumidity = baseHumidity + Math.sin(i * 0.4) * 4 + (Math.random() - 0.5) * 2;
    const varBio = baseBio + Math.sin(i * 1.5) * 8 + (Math.random() - 0.5) * 5;
    const varStress = Math.max(0, Math.min(100, baseStress + Math.cos(i * 0.9) * 5 + (Math.random() - 0.5) * 3));
    
    history.push({
      moisture: Math.max(0, Math.min(100, Math.round(varMoisture))),
      humidity: Math.max(0, Math.min(100, Math.round(varHumidity))),
      temperature: parseFloat(varTemp.toFixed(1)),
      bioelectricSignal: Math.max(0, Math.round(varBio)),
      stressScore: Math.max(0, Math.min(100, Math.round(varStress))),
      timestamp: hours[i]
    });
  }
  return history;
};

export const mockPlant: Plant = {
  id: '1',
  name: 'Roma Tomato',
  species: 'Tomato (Solanum lycopersicum)',
  image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=500',
  health: 94,
  moisture: 68,
  humidity: 55,
  temperature: 24.5,
  bioelectricSignal: 88,
  stressScore: 12,
  stressLevel: 'Optimal',
  lastWatered: '4 hours ago',
  nextWatering: 'In 8 hours',
  isIndoor: false,
  status: 'Healthy',
  alertBadge: null,
  history: generateMockHistory(65, 24, 55, 85, 15),
  dialogue: "Photosynthesis is peaking, Harish! The light and temperature are perfect. Ready to bear fruit.",
  chatHistory: [
    { sender: 'plant', text: "Systems online. Leaf nodes expanding. Current bio-signals are strong.", timestamp: "8:00 AM" },
    { sender: 'user', text: "How are you doing today?", timestamp: "10:30 AM" },
    { sender: 'plant', text: "Photosynthesis is peaking, Harish! The light and temperature are perfect. Ready to bear fruit.", timestamp: "10:31 AM" }
  ]
};

export const mockAlerts: AlertItem[] = [
  {
    id: '101',
    type: 'warning',
    title: 'Moisture Calibration Sync',
    message: 'Roma Tomato root moisture dipped slightly but stabilized after automation sync.',
    timestamp: '2 hours ago',
    plantId: '1',
    plantName: 'Roma Tomato',
    resolved: true
  },
  {
    id: '103',
    type: 'success',
    title: 'Ecosystem Feeding Resolved',
    message: 'Roma Tomato has recovered to Optimal status after automatic irrigation cycle.',
    timestamp: 'Yesterday',
    plantId: '1',
    plantName: 'Roma Tomato',
    resolved: true
  }
];

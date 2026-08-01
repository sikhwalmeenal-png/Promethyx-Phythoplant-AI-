import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Plant, AlertItem, AutomationConfig, ChatMessage } from '../types';
import { mockPlant, mockAlerts } from '../mock/mockData';
import { lightTheme, darkTheme } from '../theme/theme';

interface PlantDataContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof lightTheme;
  plant: Plant;
  alerts: AlertItem[];
  automation: AutomationConfig;
  setAutomation: React.Dispatch<React.SetStateAction<AutomationConfig>>;
  waterPlant: () => void;
  toggleAutomation: (key: keyof AutomationConfig) => void;
  resolveAlert: (id: string) => void;
  refreshData: () => Promise<void>;
  isRefreshing: boolean;
  addChatMessage: (text: string) => void;
}

const PlantDataContext = createContext<PlantDataContextType | undefined>(undefined);

// Dialogue generator based on plant state
const getDialogueText = (moisture: number, temp: number, status: string): string => {
  if (status === 'Critical') {
    if (moisture < 20) {
      return "Danger! My root moisture has collapsed. Photosynthesis is shutting down. Please irrigate immediately.";
    }
    if (temp > 30) return "It is burning hot here! My leaves are overheating. Can I get some fan ventilation and shade?";
  }
  
  if (status === 'Needs Attention') {
    if (moisture < 35) {
      return "Hey Harish, my soil is getting a bit dry. A small splash of water would keep me growing strong.";
    }
    if (temp > 28) return "Oof, the temperature is spiking. A bit of fresh airflow from the canopy fan would be awesome.";
  }

  // Healthy states
  return "Photosynthesis is peaking, Harish! The light and temperature are perfect. Ready to bear fruit.";
};

export const PlantDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [plant, setPlant] = useState<Plant>(mockPlant);
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [automation, setAutomation] = useState<AutomationConfig>({
    autoIrrigation: true,
    autoFan: true,
    smartAlerts: true,
    aiWhisperer: true,
  });

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const colors = theme === 'light' ? lightTheme : darkTheme;

  const automationRef = useRef(automation);
  useEffect(() => {
    automationRef.current = automation;
  }, [automation]);

  // Simulate real-time sensor updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlant(prevPlant => {
        // Environmental fluctuation
        const deltaTemp = (Math.random() - 0.5) * 0.4;
        const deltaHum = (Math.random() - 0.5) * 1.5;
        let deltaMoist = (Math.random() - 0.5) * 0.8;
        
        // Soil slowly dries out
        deltaMoist -= 0.25; 

        const nextTemp = parseFloat(Math.max(15, Math.min(42, prevPlant.temperature + deltaTemp)).toFixed(1));
        const nextHum = Math.max(20, Math.min(95, Math.round(prevPlant.humidity + deltaHum)));
        
        let nextMoist = prevPlant.moisture + deltaMoist;
        let lastWateredText = prevPlant.lastWatered;
        let triggeredAutoWater = false;

        // Auto-water check
        if (nextMoist < 20 && automationRef.current.autoIrrigation) {
          nextMoist = 78;
          lastWateredText = 'Just now (Auto Eco)';
          triggeredAutoWater = true;
        } else {
          nextMoist = Math.max(5, Math.min(100, Math.round(nextMoist)));
        }

        const isStressed = nextMoist < 30 || nextTemp > 28;
        const baseBio = isStressed ? 35 : 90;
        const nextBio = Math.max(10, Math.round(baseBio + (Math.random() - 0.5) * 12));

        let stress = 10;
        if (nextMoist < 30) stress += (30 - nextMoist) * 2.5;
        if (nextTemp > 27) stress += (nextTemp - 27) * 5;
        const nextStressScore = Math.max(0, Math.min(100, Math.round(stress)));

        let stressLevel: Plant['stressLevel'] = 'Optimal';
        let status: Plant['status'] = 'Healthy';
        let alertBadge: Plant['alertBadge'] = null;

        if (nextStressScore > 70) {
          stressLevel = 'Critical';
          status = 'Critical';
          alertBadge = nextMoist < 20 ? 'Critical Moisture' : 'Critical Temp';
        } else if (nextStressScore > 30) {
          stressLevel = 'High Stress';
          status = 'Needs Attention';
          alertBadge = nextMoist < 30 ? 'Moisture Low' : 'High Temp';
        } else if (nextStressScore > 15) {
          stressLevel = 'Mild Stress';
          status = 'Needs Attention';
        }

        if (triggeredAutoWater) {
          stressLevel = 'Optimal';
          status = 'Healthy';
          alertBadge = null;
        }

        const newHistory = [...prevPlant.history.slice(1)];
        newHistory.push({
          moisture: nextMoist,
          humidity: nextHum,
          temperature: nextTemp,
          bioelectricSignal: nextBio,
          stressScore: nextStressScore,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });

        // Generate dynamic dialogue text
        const nextDialogue = getDialogueText(nextMoist, nextTemp, status);

        // Append to chat history on event triggers
        const newChatHistory = [...prevPlant.chatHistory];
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (triggeredAutoWater) {
          newChatHistory.push({
            sender: 'plant',
            text: `💧 Ecosystem Automated Feed watered my soil. Moisture replenished to 78%. Cells stabilized.`,
            timestamp: timeString
          });

          setTimeout(() => {
            const newAlert: AlertItem = {
              id: Math.random().toString(),
              type: 'success',
              title: 'Auto Irrigation Triggered',
              message: `Automated ecosystem watered Roma Tomato as soil moisture dipped to 20%.`,
              timestamp: 'Just now',
              plantId: prevPlant.id,
              plantName: prevPlant.name,
              resolved: true
            };
            setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
          }, 0);
        } else if (status === 'Critical' && prevPlant.status !== 'Critical') {
          newChatHistory.push({
            sender: 'plant',
            text: `⚠️ Biophysical Distress: ${nextDialogue}`,
            timestamp: timeString
          });

          setTimeout(() => {
            setAlerts(prev => {
              const alreadyAlerted = prev.some(a => !a.resolved);
              if (alreadyAlerted) return prev;

              const newAlert: AlertItem = {
                id: Math.random().toString(),
                type: 'danger',
                title: `Distress: ${prevPlant.name}`,
                message: `Roma Tomato is in critical stress (${nextDialogue})`,
                timestamp: 'Just now',
                plantId: prevPlant.id,
                plantName: prevPlant.name,
                resolved: false
              };
              return [newAlert, ...prev];
            });
          }, 0);
        }

        return {
          ...prevPlant,
          moisture: nextMoist,
          humidity: nextHum,
          temperature: nextTemp,
          bioelectricSignal: nextBio,
          stressScore: nextStressScore,
          stressLevel,
          status,
          alertBadge,
          lastWatered: lastWateredText,
          health: Math.max(10, Math.min(100, 100 - Math.round(nextStressScore * 0.7))),
          history: newHistory,
          dialogue: nextDialogue,
          chatHistory: newChatHistory,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const waterPlant = () => {
    setPlant(prevPlant => {
      const wateredHistory = [...prevPlant.history];
      wateredHistory[wateredHistory.length - 1] = {
        ...wateredHistory[wateredHistory.length - 1],
        moisture: 85,
        stressScore: 5,
      };

      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newChatHistory: ChatMessage[] = [
        ...prevPlant.chatHistory,
        { sender: 'user', text: 'Irrigated root structure manually', timestamp: timeString },
        { sender: 'plant', text: 'Ah, thank you! I can feel my roots drinking. My moisture is back to 85%. That feels amazing.', timestamp: timeString }
      ];

      // Create success alert
      const newAlert: AlertItem = {
        id: Math.random().toString(),
        type: 'success',
        title: 'Manual Irrigation Activated',
        message: `Irrigated Roma Tomato. Soil moisture structure replenished.`,
        timestamp: 'Just now',
        plantId: prevPlant.id,
        plantName: prevPlant.name,
        resolved: true
      };
      setAlerts(prev => [newAlert, ...prev]);

      // Resolve warning alerts
      setAlerts(prev =>
        prev.map(alert =>
          alert.plantId === prevPlant.id ? { ...alert, resolved: true, timestamp: 'Resolved just now' } : alert
        )
      );

      return {
        ...prevPlant,
        moisture: 85,
        health: 99,
        stressScore: 5,
        stressLevel: 'Optimal',
        status: 'Healthy',
        alertBadge: null,
        lastWatered: 'Just now',
        history: wateredHistory,
        dialogue: getDialogueText(85, prevPlant.temperature, 'Healthy'),
        chatHistory: newChatHistory,
      };
    });
  };

  const addChatMessage = (text: string) => {
    setPlant(prevPlant => {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let plantReplyText = `I am processing your queries. My current leaf sap sugar is stable and moisture is ${prevPlant.moisture}%.`;
      if (text.toLowerCase().includes('water') || text.toLowerCase().includes('drink')) {
        setTimeout(() => waterPlant(), 0);
        return prevPlant;
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        plantReplyText = `Hello Harish! I am doing well. My active bio-current reads ${prevPlant.bioelectricSignal}uV. Photosynthesis looks excellent under this ${prevPlant.temperature}°C heat.`;
      } else if (text.toLowerCase().includes('health') || text.toLowerCase().includes('status')) {
        plantReplyText = `My health is at ${prevPlant.health}%. My cells are ${prevPlant.status.toLowerCase()} and environmental temperature is ${prevPlant.temperature}°C.`;
      }

      return {
        ...prevPlant,
        chatHistory: [
          ...prevPlant.chatHistory,
          { sender: 'user', text, timestamp: timeString },
          { sender: 'plant', text: plantReplyText, timestamp: timeString }
        ]
      };
    });
  };

  const toggleAutomation = (key: keyof AutomationConfig) => {
    setAutomation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, resolved: true } : alert))
    );
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPlant(prev => ({
      ...prev,
      moisture: Math.max(10, Math.min(95, prev.moisture + Math.round((Math.random() - 0.5) * 10))),
      temperature: parseFloat(Math.max(18, Math.min(32, prev.temperature + (Math.random() - 0.5) * 2)).toFixed(1)),
    }));
    setIsRefreshing(false);
  };

  return (
    <PlantDataContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        plant,
        alerts,
        automation,
        setAutomation,
        waterPlant,
        toggleAutomation,
        resolveAlert,
        refreshData,
        isRefreshing,
        addChatMessage,
      }}
    >
      {children}
    </PlantDataContext.Provider>
  );
};

export const usePlantData = () => {
  const context = useContext(PlantDataContext);
  if (!context) {
    throw new Error('usePlantData must be used within a PlantDataProvider');
  }
  return context;
};

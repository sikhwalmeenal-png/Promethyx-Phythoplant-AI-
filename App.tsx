import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PlantDataProvider, usePlantData } from './src/hooks/usePlantData';
import { AppNavigator } from './src/navigation/AppNavigator';

import { SplashScreen } from './src/screens/SplashScreen';

// Inner component to access the PlantData context for the StatusBar theme
const MainApp = () => {
  const { theme } = usePlantData();
  const [showSplash, setShowSplash] = React.useState(true);
  
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {showSplash ? (
        <SplashScreen onAnimationEnd={() => setShowSplash(false)} />
      ) : (
        <AppNavigator />
      )}
    </>
  );
};

export default function App() {
  return (
    <PlantDataProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </PlantDataProvider>
  );
}

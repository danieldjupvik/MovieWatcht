import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppearanceContext = createContext();

export const AppearanceProvider = ({ children }) => {
  const [appearance, setAppearance] = useState('auto');
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem('appearance').then((value) => {
      if (value !== null) {
        setAppearance(value);
      }
    });
  }, []);

  const colorScheme = appearance === 'auto' ? systemColorScheme : appearance;

  const updateAppearance = async (value) => {
    setAppearance(value);
    await AsyncStorage.setItem('appearance', value);
  };

  return (
    <AppearanceContext.Provider value={{ colorScheme, appearance, updateAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => useContext(AppearanceContext);

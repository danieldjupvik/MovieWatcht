import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
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
    }).catch(() => {});
  }, []);

  const colorScheme = appearance === 'auto' ? systemColorScheme : appearance;

  useEffect(() => {
    if (appearance === 'auto') {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(appearance);
    }
  }, [appearance]);

  const updateAppearance = useCallback(async (value) => {
    const previous = appearance;
    setAppearance(value);
    try {
      await AsyncStorage.setItem('appearance', value);
    } catch {
      setAppearance(previous);
    }
  }, [appearance]);

  const value = useMemo(
    () => ({ colorScheme, appearance, updateAppearance }),
    [colorScheme, appearance, updateAppearance]
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => useContext(AppearanceContext);

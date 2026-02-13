import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import i18n from '../language/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppearance } from '../components/AppearanceContext';
import { backgroundColorDark, backgroundColorLight } from '../colors/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const Adult = () => {
  const { colorScheme } = useAppearance();
  const themeContainerStyle = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    getAdult();
  }, []);

  const getAdult = async () => {
    try {
      const value = await AsyncStorage.getItem('adult');
      if (value !== null) {
        setIsEnabled(JSON.parse(value));
      } else {
        setIsEnabled(false);
      }
    } catch (_e) {
      alert('error reading value');
    }
  };

  const toggleSwitch = (value) => {
    setIsEnabled(value);
    storeAdult(JSON.stringify(value));
  };

  const storeAdult = async (adultValue) => {
    try {
      await AsyncStorage.setItem('adult', adultValue);
    } catch (_e) {
      alert('Error saving adult value, contact developer');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeContainerStyle }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection
            header={i18n.t('adult')}
            footer={i18n.t('adultButtonDescription')}
          >
            <SettingsRow
              title={i18n.t('adultContent')}
              accessory='switch'
              switchValue={isEnabled}
              onSwitchChange={toggleSwitch}
            />
          </SettingsSection>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
});

export default Adult;

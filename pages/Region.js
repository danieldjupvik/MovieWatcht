import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import i18n from '../language/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppearance } from '../components/AppearanceContext';
import { backgroundColorDark, backgroundColorLight } from '../colors/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const Region = ({ navigation }) => {
  const [selectedRegion, setSelectedRegion] = useState('auto');
  const { colorScheme } = useAppearance();
  const themeContainerStyle = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  const getRegion = async () => {
    try {
      const value = await AsyncStorage.getItem('region');
      if (value !== null && value !== 'auto') {
        setSelectedRegion(value);
      } else {
        setSelectedRegion('auto');
      }
    } catch (_e) {
      alert('error reading value');
    }
  };

  const selectRegion = async (regionValue) => {
    setSelectedRegion(regionValue);
    await storeRegion(regionValue);
    navigation.goBack();
  };

  const storeRegion = async (regionValue) => {
    try {
      await AsyncStorage.setItem('region', regionValue);
    } catch (_e) {
      alert('Error saving region value, contact developer');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRegion();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: themeContainerStyle }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection header={i18n.t('region')}>
            <SettingsRow
              title={i18n.t('deviceRegion')}
              subtitle={i18n.t('deviceRegionDescription')}
              accessory='checkmark'
              checked={selectedRegion === 'auto'}
              onPress={() => selectRegion('auto')}
            />
            <SettingsRow
              title={i18n.t('norway')}
              subtitle={i18n.t('norwayDescription')}
              accessory='checkmark'
              checked={selectedRegion === 'NO'}
              onPress={() => selectRegion('NO')}
            />
            <SettingsRow
              title={i18n.t('unitedState')}
              subtitle={i18n.t('unitedStateDescription')}
              accessory='checkmark'
              checked={selectedRegion === 'US'}
              onPress={() => selectRegion('US')}
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});

export default Region;

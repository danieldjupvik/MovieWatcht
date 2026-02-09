import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { useAppearance } from '../components/AppearanceContext';
import { backgroundColorDark, backgroundColorLight } from '../colors/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const Appearance = () => {
  const { colorScheme, appearance, updateAppearance } = useAppearance();
  const themeContainerStyle = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <View style={[styles.container, { backgroundColor: themeContainerStyle }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection header={i18n.t('appearance')}>
            <SettingsRow
              title={i18n.t('auto')}
              subtitle={i18n.t('autoDescription')}
              accessory='checkmark'
              checked={appearance === 'auto'}
              onPress={() => updateAppearance('auto')}
            />
            <SettingsRow
              title={i18n.t('dark')}
              subtitle={i18n.t('darkDescription')}
              accessory='checkmark'
              checked={appearance === 'dark'}
              onPress={() => updateAppearance('dark')}
            />
            <SettingsRow
              title={i18n.t('light')}
              subtitle={i18n.t('lightDescription')}
              accessory='checkmark'
              checked={appearance === 'light'}
              onPress={() => updateAppearance('light')}
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

export default Appearance;

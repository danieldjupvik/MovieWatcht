import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import i18n from '../language/i18n';
import { useAppearance } from '../components/AppearanceContext';
import { backgroundColorDark, backgroundColorLight } from '../colors/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const ContentSettings = ({ navigation }) => {
  const { colorScheme } = useAppearance();
  const containerBg = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection header={i18n.t('languageAndRegion')}>
            <SettingsRow
              icon='globe.europe.africa.fill'
              iconColor='#30B0C7'
              title={i18n.t('region')}
              accessory='chevron'
              onPress={() =>
                navigation.navigate('Region', {
                  headerTitle: i18n.t('region'),
                })
              }
            />
          </SettingsSection>

          <SettingsSection header={i18n.t('content')}>
            <SettingsRow
              icon='exclamationmark.triangle.fill'
              iconColor='#FF9500'
              title={i18n.t('adult')}
              accessory='chevron'
              onPress={() =>
                navigation.navigate('Adult', {
                  headerTitle: i18n.t('adult'),
                })
              }
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

export default ContentSettings;

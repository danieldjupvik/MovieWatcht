import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppearance } from './AppearanceContext';
import { systemColors } from '../colors/colors';

const SettingsSection = ({ header, footer, children }) => {
  const { colorScheme } = useAppearance();
  const colors = systemColors[colorScheme] || systemColors.light;

  return (
    <View style={styles.section}>
      {header ? (
        <Text style={[styles.header, { color: colors.label }]}>
          {header}
        </Text>
      ) : null}
      <View style={styles.group}>
        {children}
      </View>
      {footer ? (
        <Text style={[styles.footer, { color: colors.tertiaryLabel }]}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  header: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 20,
    letterSpacing: -0.4,
  },
  footer: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 8,
    paddingHorizontal: 20,
    letterSpacing: -0.08,
  },
  group: {
    gap: 2,
  },
});

export default SettingsSection;

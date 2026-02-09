import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppearance } from './AppearanceContext';
import { systemColors } from '../colors/colors';

const SettingsSection = ({ header, footer, children }) => {
  const { colorScheme } = useAppearance();
  const colors = systemColors[colorScheme] || systemColors.light;

  const childArray = React.Children.toArray(children);

  return (
    <View style={styles.section}>
      {header ? (
        <Text style={[styles.header, { color: colors.secondaryLabel }]}>
          {header.toUpperCase()}
        </Text>
      ) : null}
      <View
        style={[
          styles.group,
          { backgroundColor: colors.secondarySystemGroupedBackground },
        ]}
      >
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childArray.length - 1 ? (
              <View style={styles.separatorRow}>
                <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              </View>
            ) : null}
          </React.Fragment>
        ))}
      </View>
      {footer ? (
        <Text style={[styles.footer, { color: colors.secondaryLabel }]}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
  },
  header: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 7,
    paddingHorizontal: 16,
    letterSpacing: -0.08,
  },
  footer: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 7,
    paddingHorizontal: 16,
    letterSpacing: -0.08,
  },
  group: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  separatorRow: {
    paddingLeft: 52,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});

export default SettingsSection;

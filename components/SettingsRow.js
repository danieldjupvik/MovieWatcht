import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useAppearance } from './AppearanceContext';
import { systemColors } from '../colors/colors';

const SettingsRow = ({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  accessory,
  checked,
  switchValue,
  onSwitchChange,
  rightText,
}) => {
  const { colorScheme } = useAppearance();
  const colors = systemColors[colorScheme] || systemColors.light;

  const renderAccessory = () => {
    if (accessory === 'chevron') {
      return (
        <SymbolView
          name='chevron.right'
          style={styles.chevron}
          tintColor='#C7C7CC'
          resizeMode='scaleAspectFit'
        />
      );
    }
    if (accessory === 'checkmark' && checked) {
      return (
        <SymbolView
          name='checkmark'
          style={styles.checkmark}
          tintColor='#007AFF'
          resizeMode='scaleAspectFit'
        />
      );
    }
    if (accessory === 'switch') {
      return (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
        />
      );
    }
    if (rightText) {
      return (
        <View style={styles.rightTextRow}>
          <Text style={[styles.rightText, { color: colors.secondaryLabel }]}>
            {rightText}
          </Text>
          {onPress ? (
            <SymbolView
              name='chevron.right'
              style={styles.chevron}
              tintColor='#C7C7CC'
              resizeMode='scaleAspectFit'
            />
          ) : null}
        </View>
      );
    }
    return null;
  };

  const content = (
    <View style={styles.row}>
      {icon ? (
        <View style={[styles.iconContainer, { backgroundColor: iconColor || '#007AFF' }]}>
          <SymbolView
            name={icon}
            style={styles.icon}
            tintColor='#FFFFFF'
            resizeMode='scaleAspectFit'
          />
        </View>
      ) : null}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.label }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.secondaryLabel }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {renderAccessory()}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed ? { opacity: 0.6 } : null}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingLeft: 16,
  },
  iconContainer: {
    width: 29,
    height: 29,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 17,
    height: 17,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingRight: 16,
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: -0.08,
  },
  chevron: {
    width: 13,
    height: 20,
  },
  checkmark: {
    width: 18,
    height: 18,
  },
  rightTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightText: {
    fontSize: 17,
  },
});

export default SettingsRow;

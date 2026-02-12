import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppearance } from './AppearanceContext';
import { backgroundColorDark, backgroundColorLight, textColorDark, textColorLight } from '../colors/colors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ onRetry, error }) => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? backgroundColorDark : backgroundColorLight }]}>
      <Text style={[styles.emoji]}>😔</Text>
      <Text style={[styles.title, { color: isDark ? textColorDark : textColorLight }]}>
        Something went wrong
      </Text>
      <Text style={[styles.message, { color: isDark ? '#98989F' : '#8E8E93' }]}>
        An unexpected error occurred. Please try again.
      </Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;

import React from 'react';
import { TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomTabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  accessibilityState?: {
    selected?: boolean;
  };
  [key: string]: any; // Allow other props to pass through
}

const CustomTabBarButton = ({
  onPress,
  onLongPress,
  children,
  accessibilityState,
  ...rest
}: CustomTabBarButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        accessibilityState?.selected && styles.selected,
      ]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    opacity: 1,
  },
});

export default CustomTabBarButton; 
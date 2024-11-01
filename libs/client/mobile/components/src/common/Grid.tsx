import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GridProps {
  children: React.ReactNode;
  spacing?: number;
  columns?: number;
  style?: ViewStyle;
}

export const Grid: React.FC<GridProps> = ({ children, spacing = 8, columns = 2, style }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <View style={[styles.container, style]}>
      {React.Children.map(childrenArray, (child, index) => (
        <View
          style={[
            styles.item,
            {
              width: `${100 / columns}%`,
              padding: spacing / 2,
            },
          ]}
          key={index}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'column',
  },
});

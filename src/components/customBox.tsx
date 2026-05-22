import React from "react";
import { StyleSheet, Text, View, DimensionsValue, DimensionValue  } from "react-native";

interface CustomBox {
    value: string | number;
    label: string;
    valueColor?: string;
    width: DimensionValue;
}

export const CustomBox: React.FC<CustomBox> = ({ 
    value, 
    label, 
    valueColor = "#fff", 
    width = "30%"
}) => {
    return (
        <View style={[styles.container, { width }]}>
            <Text style={[styles.value, { color: valueColor }]}>
                {value}
            </Text>
            <Text style={styles.label}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#151b2a',
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1, 
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#AE9E91',
    fontWeight: '500',
    textAlign: 'center',
  },
});
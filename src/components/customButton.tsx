import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function CustomButton({ 
    title, 
    type = 'primary',
    onPress 
}: { 
    title: string;
    type?: 'primary' | 'secondary'; 
    onPress: () => void;
}) {
    const isPrimary = type === 'primary';

    if (isPrimary) {
        return (
            <Pressable 
                onPress={onPress}
                style={({ pressed }) => [
                    styles.buttonContainer,
                    styles.primaryButton,
                    { backgroundColor: pressed ? '#d98a0a' : '#f59f0b' }
                ]}
            >
                <Text style={styles.primaryText}>{title}</Text>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.buttonContainer,
                styles.secondaryButton,
                { backgroundColor: pressed ? '#232b35' : '#1d232a' }
            ]}
        >
            <Text style={styles.secondaryText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: 18,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
    },
    primaryButton: {
        
        elevation: 5,
    },
    primaryText: {
        color: '#111622',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#262f3a',
    },
    secondaryText: {
        color: '#ffddb8ee',
        fontSize: 18,
        fontWeight: '700',
    },
});

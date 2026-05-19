import { LinearGradient } from "expo-linear-gradient";
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
        return(
            <Pressable onPress={onPress} style={styles.pressable}>
                {({ pressed }) => (
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={pressed ? ['#e6ad68', '#dc8e0a'] : ['#ffc174', '#f59e0b']}
                        style={styles.buttonContainer}
                    >
                        <Text style={styles.primaryText}>{title}</Text>
                    </LinearGradient>
                )}
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
    pressable: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonContainer: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
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
        color: '#ffc174',
        fontSize: 18,
        fontWeight: '700',
    },
})
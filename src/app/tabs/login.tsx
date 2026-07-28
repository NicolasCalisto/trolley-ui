import CustomButton from "@/components/customButton";
import CustomInput from "@/components/customInput";
import { router } from 'expo-router';
import React, { useState } from "react"; 
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.select({ ios: "padding", android: "height" })}
        >
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require("@/assets/image2.png")}
                    style={styles.illustration}
                />

                <Text style={styles.titlePrincipal}>
                    Crie sua conta
                </Text>

                <View style={styles.inputGroup}>
                    <CustomInput 
                        placeholder="Nome"
                        autoCapitalize="none"
                        value={name}
                        onChangeText={setName}
                    />

                    <CustomInput 
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <CustomInput 
                        placeholder="Senha"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton 
                        title="Criar" 
                        type="secondary"
                        onPress={() => router.push('/home')} 
                    />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1321",
    },
    scrollContent: {
        flexGrow: 1,
        padding: 32,
        alignItems: "center",
    },
    illustration: {
        width: "100%",
        height: 330,
        resizeMode: "contain",
        marginTop: 62
    },
    titlePrincipal:{
        fontSize: 18,
        color: "#FFF",
        marginTop: 32,
        textAlign: "center"
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 32,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: "#ffddb8ee",
        marginTop: 16,
        textAlign: "center"
    },
    inputGroup: {
        marginTop: 24,
        gap: 16,
        alignItems: "center"
    },
    buttonContainer: {
        marginTop: 32,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        width: "100%"
    }
});

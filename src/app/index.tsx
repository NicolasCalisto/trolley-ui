import CustomButton from "@/components/customButton"
import { Alert, Image, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { router } from 'expo-router'; 

export default function Index() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <Image
                source={require("@/assets/image.png")}
                style={styles.illustration}
            />

            <Text style={styles.titlePrincipal}>
                Minha Cestinha
            </Text>

            <Text style={styles.title}>
                Gestão inteligente para suas compras.
            </Text>

            <Text style={styles.subtitle}>
                Planeje suas listas, controle seus gastos e conomize tempo no mercado com a Trolley.
            </Text>

            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="Criar conta" 
                    type="primary"
                    onPress={() => router.push('/tabs/login')} 
                />

                <CustomButton 
                    title="Começar Agora" 
                    type="secondary"
                    onPress={() => router.push('/tabs/home')} 
                />
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1321",
        padding: 32
    },
    illustration: {
        width: "100%",
        height: 330,
        resizeMode: "contain",
        marginTop: 62
    },
    titlePrincipal:{
        fontSize: 76,
        alignContent: "center",
        fontWeight: "bold",
        color: "#F59E0B",
        marginTop: 32,
        textAlign: "center"
    },
    title: {
        fontSize: 48,
        alignContent: "center",
        fontWeight: "bold",
        color: "#fff",
        marginTop: 32,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        alignContent: "center",
        color: "#ffddb8ee",
        marginTop: 16,
        textAlign: "center"
    },
    buttonContainer: {
        marginTop: 32,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
    }

})

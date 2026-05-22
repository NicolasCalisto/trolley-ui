import CustomButton from "@/components/customButton"
import { Alert, Image, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { router } from 'expo-router'; 
import Icon  from "react-native-vector-icons/FontAwesome5";
import { CustomBox } from "@/components/customBox";

export default function Home() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            
            <View style={styles.topBox}>
                <Text style={styles.titlePrincipal}>
                    Minha Cestinha
                </Text>

                <View style={styles.iconsBox}>
                    <Icon name="bell" size={24} color="#F59E0B"/>

                    <View style={styles.userIconBox}>
                        <Image
                            source={require("@/assets/userIcon.png")}
                            style={styles.userIcon}
                        />
                    </View>
                </View>
            </View>

            <Text style={styles.title}>
                Olá, fulano
            </Text>
            <Text style={styles.subtitle}>
                Pronto para economizar hoje?
            </Text>

            <View style={styles.detailsBox}>
                <CustomBox 
                    value="3" 
                    label="Listas Ativas"
                />
                <CustomBox 
                    value="R$ 450" 
                    label="Gastos do mês"
                />
                <CustomBox 
                    value="R$ 185" 
                    label="Economia do mês"
                />
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton 
                    style={styles.button}
                    title="+ criar nova lista" 
                    textStyle={{ fontSize: 18, fontWeight: "400" }}
                    type="primary"
                    onPress={() => router.push('/home')} 
                />
            </View>

            <View style={styles.listBox}>

            </View>

            <View style={styles.infoBox}>

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
    topBox: {
        flexDirection: "row",
        marginTop: 32,
    },
    iconsBox: {
        flexDirection: "row",
        gap: 16,
        marginLeft: "auto",
        alignItems: "center",
    },
    userIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        borderBlockColor: "#000",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userIcon: {
        width: 26,
        height: 26,
        borderRadius: 25,
        
    },
    titlePrincipal:{
        fontSize: 28,
        fontWeight: "bold",
        color: "#F59E0B",
        textAlign: "start"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 48,
        textAlign: "start",
        fontWeight: "300"
    },
    subtitle: {
        fontSize: 16,
        alignContent: "center",
        color: "#ffddb8ee",
        marginTop: 8,
        textAlign: "start",
        fontWeight: "300"
    },
    detailsBox: {
        flexDirection: "row",
        marginTop: 24,
        justifyContent: "space-between"
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 24,
        marginBottom: 24,
        width: "100%"
    },
    button: {
        width: "100%",
        fontWeight: "300"
    }

})
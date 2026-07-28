import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Esconde os textos/rótulos abaixo dos ícones
        tabBarActiveTintColor: '#151b2a',   // Cor do ícone selecionado (Amarelo)
        tabBarInactiveTintColor: '#AE9E91', // Mesma cor, mas o estilo inativo cuida da opacidade
        tabBarStyle: {
          backgroundColor: '#151b2a', 
          borderTopColor: '#2c354b',
          height: 70,
          paddingBottom: 0,
          paddingTop: 16,
        },
      }}
    >
      {/* Rota 1: Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <FontAwesome5 
                name="home" 
                size={22} 
                color={color} 
                style={{ opacity: focused ? 1 : 0.6 }} 
              />
            </View>
          ),
        }}
      />

      {/* Rota 2: listas */}

      {/* Rota 3: Criar / Adicionar */}

      {/* Rota 4: Perfil */}
      
      {/* Rota planning */}
      <Tabs.Screen
        name="planning"
        options={{
          href: null, // esconde a rota de navegação para a tela inicial
        }}
      />

      {/* Rota login */}
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#F59E0B', // Fundo destacado do ícone selecionado
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',    // Borda sutil da caixinha ativa
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
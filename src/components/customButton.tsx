import React from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from "react-native";

// Estendemos as props para aceitar estilos customizados de fora
interface CustomButtonProps {
  title: string;
  type?: 'primary' | 'secondary';
  onPress: () => void;
  style?: StyleProp<ViewStyle>; // Permite customizar o container (largura, margem, etc)
  textStyle?: StyleProp<TextStyle>; // Permite customizar o texto (fonte, tamanho, etc)
}

export default function CustomButton({ 
  title, 
  type = 'primary',
  onPress,
  style,
  textStyle
}: CustomButtonProps) {
  
  const isPrimary = type === 'primary';

  // Definição dinâmica das cores de feedback visual (Active Opacity / Pressed)
  const getBackgroundColor = (pressed: boolean) => {
    if (isPrimary) {
      return pressed ? '#d98a0a' : '#f59f0b';
    }
    return pressed ? '#232b35' : '#1d232a';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        { backgroundColor: getBackgroundColor(pressed) },
        style // O estilo passado por fora SEMPRE vem por último para sobrescrever o padrão
      ]}
    >
      <Text style={[
        isPrimary ? styles.primaryText : styles.secondaryText, 
        textStyle // Permite mudar fonte, tamanho, etc. na chamada do componente
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 350, // Largura padrão caso nenhuma seja passada
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
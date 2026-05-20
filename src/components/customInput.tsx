import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface CustomInputProps extends TextInputProps {
  // Você pode adicionar propriedades customizadas aqui no futuro (ex: ícones, mensagens de erro)
}

export default function CustomInput({ style, ...rest }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      style={[
        styles.container, 
        // Destaca a borda com a cor laranja do botão quando o usuário clica no input
        isFocused && styles.containerFocused 
      ]}
    >
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#64748b" // Cor de placeholder cinza sutil
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d232a', // Mesmo fundo cinza escuro do botão secundário
    width: 350, // Mesma largura exata dos seus botões para alinhar perfeitamente
    height: 58, // Altura proporcional ao padding vertical do botão
    borderRadius: 16, // Mesmo arredondamento dos botões
    borderWidth: 1,
    borderColor: '#262f3a', // Mesma borda sutil do botão secundário
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  containerFocused: {
    borderColor: '#f59f0b', // Borda laranja ao focar para dar feedback visual
  },
  input: {
    color: '#FFFFFF', // Texto digitado fica branco
    fontSize: 16,
    width: '100%',
    height: '100%',
  },
});

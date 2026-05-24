import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Componente para entrada de texto padronizada
export default function CustomInput(props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#95a5a6"
      // Permite que o componente receba props dinâmicas (ex: onChangeText, value)
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 55,
    borderRadius: 10, // Bordas arredondadas
    paddingHorizontal: 15, // Padding para o texto não encostar na borda
    borderWidth: 1,
    borderColor: '#dcdde1',
    fontSize: 16,
    marginBottom: 15,
    // Sombra suave para destaque visual
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
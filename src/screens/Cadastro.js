import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';

export default function Cadastro({ navigation }) {
  // useState para gerenciar os campos do formulário
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  // useEffect: Lógica de autopreenchimento ao abrir o app
  useEffect(() => {
    const carregarDadosDadosSalvos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@vet-flow:pet');
        if (jsonValue != null) {
          const dados = JSON.parse(jsonValue); // Converte string de volta para objeto
          setNome(dados.nome);
          setPeso(dados.peso);
          setCpf(dados.cpf);
          setTelefone(dados.telefone);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível recuperar os dados.");
      }
    };
    carregarDadosDadosSalvos();
  }, []); // Array vazio garante execução apenas na montagem

  // Função vinculada ao botão "Salvar"
  const salvar = async () => {
    // Validação de formulário
    if (!nome || !peso || !cpf || !telefone) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha todas as informações do Pet.");
      return;
    }

    const petData = { nome, peso, cpf, telefone, rm: '99999' };

    try {
      // Salva no AsyncStorage antes de navegar
      await AsyncStorage.setItem('@vet-flow:pet', JSON.stringify(petData));
      navigation.navigate('Perfil');
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar os dados.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/vet-flow-cadastro.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Vet-Flow Powered by PetCare 360"
      />
      <Text style={styles.title}>Cadastro do Pet</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Nome do Pet" 
        value={nome} 
        onChangeText={setNome} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Peso (kg)" 
        keyboardType="numeric"
        value={peso} 
        onChangeText={setPeso} 
      />

      {/* Máscara de CPF obrigatória */}
      <MaskedTextInput
        mask="999.999.999-99"
        style={styles.input}
        placeholder="CPF do Tutor"
        keyboardType="numeric"
        value={cpf}
        onChangeText={(text) => setCpf(text)}
      />

      {/* Máscara de Telefone obrigatória */}
      <MaskedTextInput
        mask="(99) 99999-9999"
        style={styles.input}
        placeholder="Telefone"
        keyboardType="numeric"
        value={telefone}
        onChangeText={(text) => setTelefone(text)}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>SALVAR E VER PERFIL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff', alignItems: 'center' },
  logo: { width: '100%', height: 220, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', width: '100%' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
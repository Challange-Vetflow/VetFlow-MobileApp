import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ navigation }) {
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const buscarPet = async () => {
      const data = await AsyncStorage.getItem('@vet-flow:pet');
      if (data) setPet(JSON.parse(data));
    };
    buscarPet();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/vet-flow-cadastro.png')}
        style={styles.avatar}
        resizeMode="contain"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>NOME DO PET:</Text>
        <Text style={styles.value}>{pet?.nome || 'Não cadastrado'}</Text>

        <Text style={styles.label}>PESO:</Text>
        <Text style={styles.value}>{pet?.peso} kg</Text>

        <Text style={styles.label}>CPF DO TUTOR:</Text>
        <Text style={styles.value}>{pet?.cpf || 'Não cadastrado'}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.buttonText}>HISTÓRICO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lembretes')}
        >
          <Text style={styles.buttonText}>LEMBRETES</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  avatar: { width: 200, height: 200, borderRadius: 100, marginBottom: 20, backgroundColor: '#ddd' },
  infoContainer: { width: '100%', padding: 20, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  label: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  value: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  buttonsContainer: { width: '100%', alignItems: 'center', marginTop: 30 },
  button: {
    width: '80%',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
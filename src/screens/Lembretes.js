import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Lembretes({ navigation }) {
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    // Lógica para carregar lembretes (pode ser expandida com AsyncStorage futuramente)
    const dadosIniciais = [
      { id: '1', titulo: 'Vacina V10', data: '25/05/2026', urgente: true },
      { id: '2', titulo: 'Consulta de Retorno', data: '01/06/2026', urgente: false },
    ];
    setAvisos(dadosIniciais);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar ao Perfil</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Meus Lembretes</Text>
      <FlatList
        data={avisos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.urgente && styles.urgente]}>
            <Feather name={item.urgente ? "alert-triangle" : "calendar"} size={20} color="#fff" />
            <Text style={styles.cardText}>{item.titulo} - {item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  backButton: { marginBottom: 12, alignSelf: 'flex-start' },
  backButtonText: { color: '#3498db', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 10, backgroundColor: '#3498db', marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  urgente: { backgroundColor: '#e74c3c' },
  cardText: { color: '#fff', marginLeft: 10, fontWeight: '500' }
});
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function Historico({ navigation }) {
  // Array de objetos para a lista
  const historicoDados = [
    { id: '1', tipo: 'Vacina', nome: 'V10', data: '10/05/2026' },
    { id: '2', tipo: 'Consulta', nome: 'Check-up Geral', data: '15/04/2026' },
    { id: '3', tipo: 'Vacina', nome: 'Antirrábica', data: '02/02/2026' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar ao Perfil</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Histórico de Saúde</Text>
      
      {/* FlatList para renderizar a lista */}
      <FlatList
        data={historicoDados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.tipo}>{item.tipo}</Text>
              <Text style={styles.nome}>{item.nome}</Text>
            </View>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 12, alignSelf: 'flex-start' },
  backButtonText: { color: '#3498db', fontSize: 16, fontWeight: '600' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  tipo: { fontSize: 12, color: '#3498db', fontWeight: 'bold' },
  nome: { fontSize: 16, fontWeight: '500' },
  data: { fontSize: 14, color: '#95a5a6' }
});
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Card para exibição de pets em listas
export default function PetCard({ pet, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Imagem do pet com modo de redimensionamento centralizado*/}
      <Image 
        source={{ uri: pet.image || 'https://placedog.net/100' }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{pet.nome}</Text>
        <Text style={styles.details}>{pet.raca} • {pet.peso}kg</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Alinha imagem e texto lado a lado
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  details: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
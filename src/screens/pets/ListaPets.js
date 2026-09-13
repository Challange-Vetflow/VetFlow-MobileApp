// src/screens/pets/ListaPets.js
// Tela 4: Meus Pets — READ do CRUD de Pets, com busca e remoção rápida.

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import PetCard from '../../components/PetCard';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { usePets, useDeletePet } from '../../hooks/usePets';
import { useAuth } from '../../contexts/AuthContext';

export default function ListaPets({ navigation }) {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const { data: pets = [], isLoading, isFetching, refetch } = usePets(usuario?.tutorId);
  const deletePet = useDeletePet();

  const petsFiltrados = useMemo(
    () =>
      pets.filter((p) =>
        (p.name || '').toLowerCase().includes(busca.toLowerCase()) ||
        (p.breed || '').toLowerCase().includes(busca.toLowerCase()),
      ),
    [pets, busca],
  );

  const handleDeletar = (pet) => {
    Alert.alert(
      'Remover pet',
      `Deseja remover "${pet.name}" e todo o seu histórico de vacinas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            deletePet.mutate(pet.id, {
              onError: () => Alert.alert('Erro', 'Não foi possível remover o pet.'),
            });
          },
        },
      ],
    );
  };

  if (isLoading) return <LoadingOverlay mensagem="Carregando seus pets..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header
        title="Meus Pets"
        rightIcon="plus-circle"
        onRightPress={() => navigation.navigate('PetForm')}
      />

      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou raça..."
          placeholderTextColor={COLORS.textMuted}
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Feather name="x-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {petsFiltrados.length} pet{petsFiltrados.length !== 1 ? 's' : ''} encontrado
          {petsFiltrados.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={petsFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleDeletar(item)} activeOpacity={1}>
            <PetCard pet={item} onPress={() => navigation.navigate('PetDetalhe', { petId: item.id })} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="Você ainda não cadastrou nenhum pet."
            actionLabel="Cadastrar primeiro pet"
            onAction={() => navigation.navigate('PetForm')}
          />
        }
        ListFooterComponent={
          petsFiltrados.length > 0 ? (
            <Text style={styles.dica}>Dica: toque e segure um pet para removê-lo.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    height: 48,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONTS.sizes.md, height: '100%' },
  countRow: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  countText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, flexGrow: 1 },
  dica: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

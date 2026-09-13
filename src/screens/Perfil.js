// src/screens/Perfil.js
// Tela 10: Perfil — dados do usuário logado + logout.
// O logout chama authService.logout() (encerra a sessão no servidor) e
// limpa o contexto local; a troca de tela é automática (ver routes/index.js).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../components/Header';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const ROLE_LABEL = { TUTOR: 'Tutor', VET: 'Veterinário(a)' };

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const [saindo, setSaindo] = React.useState(false);

  const iniciais = (usuario?.nome || '?')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair do VetFlow?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setSaindo(true);
          await logout();
          // Nada de navegação manual aqui: isAuthenticated muda e o
          // navigator raiz troca sozinho de volta para o AuthRoutes.
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Perfil" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <View style={styles.roleBadge}>
            <Feather name="shield" size={12} color={COLORS.primary} />
            <Text style={styles.roleText}>{ROLE_LABEL[usuario?.role] || usuario?.role}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Feather name="mail" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{usuario?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Feather name="hash" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Id do tutor</Text>
              <Text style={styles.infoValue}>#{usuario?.tutorId}</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Sobre o VetFlow</Text>
          <Text style={styles.aboutText}>
            Acompanhamento de saúde de pets: cadastro de pets, histórico de vacinas e
            lembretes de próximas doses, tudo integrado à API VetFlow.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={saindo}>
          <Feather name="log-out" size={18} color={COLORS.critical} />
          <Text style={styles.logoutText}>{saindo ? 'Saindo...' : 'Sair da conta'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.md },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  nome: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    marginTop: SPACING.sm,
  },
  roleText: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  infoValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600', marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  aboutCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  aboutTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700', marginBottom: 6 },
  aboutText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, lineHeight: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.critical,
  },
  logoutText: { color: COLORS.critical, fontSize: FONTS.sizes.md, fontWeight: '700' },
});

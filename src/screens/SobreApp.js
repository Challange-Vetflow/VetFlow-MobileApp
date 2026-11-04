// src/screens/SobreApp.js
// Tela "Sobre o App" — identificação da versão publicada.
// Exibe o HASH DO COMMIT de referência (injetado no build por app.config.js),
// permitindo comprovar que o app instalado corresponde ao código do repositório.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

import Header from '../components/Header';
import { FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { BUILD_INFO } from '../config/buildInfo';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { formatarDataHora } from '../utils/dateUtils';

function Linha({ icon, label, valor, styles, COLORS, mono = false, selecionavel = false }) {
  return (
    <View style={styles.linha}>
      <View style={styles.linhaIcone}>
        <Feather name={icon} size={16} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.linhaLabel}>{label}</Text>
        <Text style={[styles.linhaValor, mono && styles.mono]} selectable={selecionavel}>
          {valor}
        </Text>
      </View>
    </View>
  );
}

export default function SobreApp({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  const dataBuild = BUILD_INFO.dataBuild
    ? formatarDataHora(BUILD_INFO.dataBuild.slice(0, 19)) // ISO UTC → exibição simples
    : '—';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Sobre o App" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.nome}>{BUILD_INFO.nome}</Text>
          <Text style={styles.versao}>Versão {BUILD_INFO.versao}</Text>
        </View>

        {/* Destaque: hash do commit de referência */}
        <View style={styles.hashCard}>
          <View style={styles.hashHeader}>
            <Feather name="git-commit" size={18} color={COLORS.primary} />
            <Text style={styles.hashTitulo}>Commit de referência</Text>
          </View>
          <Text style={styles.hashCurto} selectable>{BUILD_INFO.commitCurto}</Text>
          <Text style={styles.hashCompleto} selectable>{BUILD_INFO.commitHash}</Text>
          <Text style={styles.hashDica}>
            Este é o hash do commit usado para gerar esta versão. Confira no GitHub: o commit com
            esse hash contém exatamente o código deste aplicativo.
          </Text>
        </View>

        <View style={styles.card}>
          <Linha icon="git-branch" label="Branch" valor={BUILD_INFO.branch} styles={styles} COLORS={COLORS} />
          <View style={styles.divider} />
          <Linha icon="calendar" label="Data do build" valor={dataBuild} styles={styles} COLORS={COLORS} />
          <View style={styles.divider} />
          <Linha icon="server" label="Ambiente" valor={BUILD_INFO.ambiente} styles={styles} COLORS={COLORS} />
          <View style={styles.divider} />
          <Linha icon="link" label="API" valor={BUILD_INFO.apiUrl} styles={styles} COLORS={COLORS} mono selecionavel />
          <View style={styles.divider} />
          <Linha
            icon="smartphone"
            label="Plataforma"
            valor={`${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${Platform.Version} · Expo SDK ${
              Constants.expoConfig?.sdkVersion?.split('.')[0] ?? '—'
            }`}
            styles={styles}
            COLORS={COLORS}
          />
          <View style={styles.divider} />
          <Linha icon={isDark ? 'moon' : 'sun'} label="Tema ativo" valor={isDark ? 'Escuro' : 'Claro'} styles={styles} COLORS={COLORS} />
        </View>

        <Text style={styles.rodape}>
          VetFlow · Challenge FIAP 2026 · Clyvo Vet{'\n'}
          Acompanhamento de saúde de pets: cadastro, vacinas, consultas e lembretes.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  hero: { alignItems: 'center', marginVertical: SPACING.lg },
  logo: { width: 96, height: 96, borderRadius: 24, marginBottom: SPACING.md, backgroundColor: COLORS.surface },
  nome: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  versao: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: 2 },
  hashCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  hashHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  hashTitulo: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  hashCurto: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hashCompleto: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xs,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hashDica: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: SPACING.md, lineHeight: 17 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  linhaIcone: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  linhaValor: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600', marginTop: 1 },
  mono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: FONTS.sizes.sm },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  rodape: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'center', lineHeight: 18 },
});

// src/screens/auth/Login.js
// Tela 1: Login — autenticação real via AuthContext (POST /api/auth/login).
// A troca de tela após o sucesso é automática: o AuthContext atualiza
// `isAuthenticated` e src/routes/index.js monta o AppRoutes no lugar.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function Login({ navigation }) {
  const { login, processando } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros, setErros] = useState({});

  const validar = () => {
    const novosErros = {};
    if (!email.trim()) novosErros.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(email)) novosErros.email = 'E-mail inválido.';
    if (!senha) novosErros.senha = 'Senha é obrigatória.';
    else if (senha.length < 6) novosErros.senha = 'Senha deve ter no mínimo 6 caracteres.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;
    try {
      await login({ email: email.trim(), senha });
      // Nada de navigation.replace aqui: isAuthenticated muda e o
      // navigator raiz troca sozinho para o AppRoutes.
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        status === 401 || status === 403
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.';
      Alert.alert('Erro ao entrar', msg, [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.logoIcon}>
              <Feather name="heart" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>VetFlow</Text>
            <Text style={styles.appTagline}>
              Saúde e bem-estar do seu pet, sempre em dia
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Entrar na sua conta</Text>

            <CustomInput
              label="E-mail"
              icon="mail"
              placeholder="tutor@vetflow.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (erros.email) setErros((prev) => ({ ...prev, email: null }));
              }}
              error={erros.email}
            />

            <View style={styles.senhaWrapper}>
              <CustomInput
                label="Senha"
                icon="lock"
                placeholder="••••••••"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  if (erros.senha) setErros((prev) => ({ ...prev, senha: null }));
                }}
                error={erros.senha}
              />
              <TouchableOpacity style={styles.senhaToggle} onPress={() => setSenhaVisivel((v) => !v)}>
                <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <PrimaryButton
              label="ENTRAR"
              icon="log-in"
              onPress={handleLogin}
              loading={processando}
              style={{ marginTop: SPACING.sm }}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
              label="CRIAR CONTA"
              icon="user-plus"
              variant="outline"
              onPress={() => navigation.navigate('Cadastro')}
            />
          </View>

          <Text style={styles.footer}>
            Cuidar do seu pet começa por acompanhar de perto sua saúde.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  appName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
    maxWidth: 260,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  senhaWrapper: { position: 'relative' },
  senhaToggle: {
    position: 'absolute',
    right: SPACING.lg,
    top: 36,
    height: 52,
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  footer: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
});

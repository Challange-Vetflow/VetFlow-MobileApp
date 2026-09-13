// src/screens/auth/Cadastro.js
// Tela 2: Cadastro — cria usuário via AuthContext.registrar()
// (POST /api/auth/register) e já autentica em seguida.
// Campos alinhados ao RegisterRequest da API: name, email, phone, password.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function Cadastro({ navigation }) {
  const { registrar, processando } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Nome completo é obrigatório.';
    if (!email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido.';
    if (!telefone.trim()) e.telefone = 'Telefone é obrigatório.';
    else if (telefone.replace(/\D/g, '').length < 8) e.telefone = 'Telefone inválido.';
    if (!senha) e.senha = 'Senha é obrigatória.';
    else if (senha.length < 6) e.senha = 'Senha deve ter no mínimo 6 caracteres.';
    if (senha !== confirmarSenha) e.confirmarSenha = 'As senhas não coincidem.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;
    try {
      await registrar({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), senha });
      // A troca para o app principal acontece sozinha (isAuthenticated muda).
    } catch (error) {
      const status = error?.response?.status;
      const apiMsg = error?.response?.data?.erro;
      const msg =
        status === 409
          ? apiMsg || 'Já existe uma conta cadastrada com este e-mail.'
          : status === 400
          ? apiMsg || 'Dados inválidos. Confira os campos e tente novamente.'
          : 'Não foi possível criar sua conta. Verifique a conexão com a API e tente novamente.';
      Alert.alert('Erro no cadastro', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Criar Conta" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heroSection}>
            <View style={styles.avatarCircle}>
              <Feather name="user-plus" size={30} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>Novo Tutor</Text>
            <Text style={styles.heroSubtitle}>
              Cadastre-se para acompanhar a saúde dos seus pets em um só lugar
            </Text>
          </View>

          <CustomInput
            label="Nome completo *"
            icon="user"
            placeholder="Maria da Silva"
            value={nome}
            onChangeText={(t) => { setNome(t); setErros((e) => ({ ...e, nome: null })); }}
            autoCapitalize="words"
            error={erros.nome}
          />

          <CustomInput
            label="E-mail *"
            icon="mail"
            placeholder="tutor@vetflow.com"
            value={email}
            onChangeText={(t) => { setEmail(t); setErros((e) => ({ ...e, email: null })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={erros.email}
          />

          <CustomInput
            label="Telefone *"
            icon="phone"
            placeholder="(11) 91234-5678"
            value={telefone}
            onChangeText={(t) => { setTelefone(t); setErros((e) => ({ ...e, telefone: null })); }}
            keyboardType="phone-pad"
            error={erros.telefone}
          />

          <View style={styles.senhaWrapper}>
            <CustomInput
              label="Senha *"
              icon="lock"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChangeText={(t) => { setSenha(t); setErros((e) => ({ ...e, senha: null })); }}
              secureTextEntry={!senhaVisivel}
              error={erros.senha}
            />
            <TouchableOpacity style={styles.senhaToggle} onPress={() => setSenhaVisivel((v) => !v)}>
              <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Confirmar senha *"
            icon="check-circle"
            placeholder="Repita sua senha"
            value={confirmarSenha}
            onChangeText={(t) => {
              setConfirmarSenha(t);
              setErros((e) => ({ ...e, confirmarSenha: null }));
            }}
            secureTextEntry={!senhaVisivel}
            error={erros.confirmarSenha}
          />

          <PrimaryButton
            label="CRIAR CONTA"
            icon="user-check"
            onPress={handleCadastrar}
            loading={processando}
            style={{ marginTop: SPACING.sm }}
          />

          <TouchableOpacity style={styles.linkLogin} onPress={() => navigation.goBack()}>
            <Text style={styles.linkLoginText}>
              Já tem conta? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
  heroSection: { alignItems: 'center', marginBottom: SPACING.xxl },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  senhaWrapper: { position: 'relative' },
  senhaToggle: {
    position: 'absolute',
    right: SPACING.lg,
    top: 36,
    height: 52,
    justifyContent: 'center',
  },
  linkLogin: { alignItems: 'center', marginTop: SPACING.xl },
  linkLoginText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
});

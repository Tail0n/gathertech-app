import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaLogin({ aoEntrar, irParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }
    aoEntrar();
  };

  const handleEsqueciSenha = () => {
    Alert.alert('Recuperar Senha', 'Enviaremos um e-mail com as instruções para redefinir a sua senha.');
  };

  return (
    <SafeAreaView style={styles.containerAuth}>
      <ScrollView contentContainerStyle={styles.authBody} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerAuthArea}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoLogin} 
            resizeMode="contain"
          />
          <Text style={styles.welcomeTitle}>Que bom te ver de novo! 👋</Text>
          <Text style={styles.welcomeSub}>
            Faça login para continuar a explorar e gerir eventos de tecnologia.
          </Text>
        </View>

        <View style={styles.formArea}>
          <Text style={styles.labelInput}>E-mail</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="Digite o seu e-mail"
            placeholderTextColor="#8F9CAE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.labelInput}>Senha</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="Digite a sua senha"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.btnEsqueciSenha} onPress={handleEsqueciSenha}>
            <Text style={styles.textoEsqueciSenha}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimarioAuth} onPress={handleLogin}>
            <Text style={styles.textoBtnPrimario}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou continuar com</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={styles.btnSocial} 
            onPress={() => Alert.alert('Google', 'Login via Google em breve!')}
          >
            <Text style={styles.textoSocial}>🌐 Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnSocial} 
            onPress={() => Alert.alert('Apple', 'Login via Apple ID em breve!')}
          >
            <Text style={styles.textoSocial}>🍎 Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={irParaCadastro} style={styles.linkCadastro}>
          <Text style={styles.textoLink}>
            Ainda não tem conta? <Text style={styles.textDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerAuth: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24 },
  authBody: { paddingTop: 40, paddingBottom: 40 },
  headerAuthArea: { alignItems: 'center', marginBottom: 24 },
  logoLogin: { width: 90, height: 90, marginBottom: 16 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  welcomeSub: { fontSize: 14, color: '#8F9CAE', textAlign: 'center', lineHeight: 20 },
  formArea: { marginBottom: 20 },
  labelInput: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  inputAuth: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#FFFFFF', fontSize: 15 },
  btnEsqueciSenha: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 24 },
  textoEsqueciSenha: { color: '#7C3AED', fontSize: 13, fontWeight: '600' },
  btnPrimarioAuth: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnPrimario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1E293B' },
  dividerText: { color: '#8F9CAE', paddingHorizontal: 12, fontSize: 12 },
  socialButtonsContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  btnSocial: { flex: 1, backgroundColor: '#121824', borderWidth: 1, borderColor: '#1E293B', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  textoSocial: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  linkCadastro: { alignItems: 'center' },
  textoLink: { color: '#8F9CAE', fontSize: 14 },
  textDestaque: { color: '#7C3AED', fontWeight: 'bold' },
});
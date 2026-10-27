import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

// ⚠️ SUBSTiTUA PELO SEU IPV4 DA REDE LOCAL OBTIDO NO IPCONFIG
const API_URL_LOGIN = 'http://10.0.0.102:3000/api/login';
const API_URL_GOOGLE = 'http://10.0.0.102:3000/api/auth/google';

export default function TelaLogin({ aoEntrar, irParaCadastro, irParaRecuperarSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Configuração da autenticação do Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Cole aqui os Client IDs gerados no Google Cloud Console
    androidClientId: 'SEU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'SEU_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  // Escuta a resposta da janela de login do Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { accessToken } = response.authentication;
      autenticarComGoogle(accessToken);
    }
  }, [response]);

  // Busca os dados do usuário no Google e envia para a API
  const autenticarComGoogle = async (accessToken) => {
    try {
      setCarregando(true);

      // 1. Obtém dados do perfil da API do Google
      const resGoogle = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const dadosGoogle = await resGoogle.json();

      if (dadosGoogle.email) {
        // 2. Envia para o backend Node.js
        const resposta = await fetch(API_URL_GOOGLE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: dadosGoogle.email,
            name: dadosGoogle.name,
            googleId: dadosGoogle.id,
          }),
        });

        const dados = await resposta.json();

        if (resposta.ok && dados.usuario) {
          aoEntrar(dados.usuario);
        } else {
          Alert.alert('Falha no Login Social', dados.erro || 'Erro ao autenticar com o Google.');
        }
      }
    } catch (erro) {
      console.error('Erro no Google Auth:', erro);
      Alert.alert('Erro de Conexão', 'Não foi possível concluir o login com o Google.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setCarregando(true);
      
      const resposta = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.usuario) {
        aoEntrar(dados.usuario);
      } else {
        Alert.alert('Falha no Login', dados.erro || 'E-mail ou senha incorretos.');
      }
    } catch (erro) {
      console.error('Erro no login:', erro);
      Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor da API. Verifique o seu IP.');
    } finally {
      setCarregando(false);
    }
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

          <TouchableOpacity style={styles.btnEsqueciSenha} onPress={irParaRecuperarSenha}>
            <Text style={styles.textoEsqueciSenha}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimarioAuth} onPress={handleLogin} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBtnPrimario}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={irParaCadastro} style={styles.linkCadastro}>
          <Text style={styles.textoLink}>
            Ainda não tem uma conta? <Text style={styles.textDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou continue com</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={styles.btnSocial} 
            onPress={() => promptAsync()}
            disabled={!request || carregando}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} 
              style={styles.iconeSocial} 
            />
            <Text style={styles.textoSocial}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnSocial} 
            onPress={() => Alert.alert('Apple', 'Login via Apple ID em breve!')}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/mac-os.png' }} 
              style={styles.iconeSocial} 
            />
            <Text style={styles.textoSocial}>Apple</Text>
          </TouchableOpacity>
        </View>

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
  btnPrimarioAuth: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  textoBtnPrimario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1E293B' },
  dividerText: { color: '#8F9CAE', paddingHorizontal: 12, fontSize: 12 },
  socialButtonsContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  btnSocial: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    backgroundColor: '#121824', 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  iconeSocial: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  textoSocial: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  linkCadastro: { alignItems: 'center' },
  textoLink: { color: '#8F9CAE', fontSize: 14 },
  textDestaque: { color: '#7C3AED', fontWeight: 'bold' },
});
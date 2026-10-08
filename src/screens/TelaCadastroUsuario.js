import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaCadastroUsuario({ aoCadastrar, irParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCriarConta = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha pelo menos Nome, E-mail e Senha.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas digitadas não coincidem.');
      return;
    }

    Alert.alert('Sucesso!', 'Conta criada com sucesso! Bem-vindo ao GatherTech.');
    aoCadastrar();
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
          <Text style={styles.welcomeTitle}>Crie sua conta ✨</Text>
          <Text style={styles.welcomeSub}>
            Junte-se à comunidade tech e não perca nenhum evento em Salvador.
          </Text>
        </View>

        <View style={styles.formArea}>
          <Text style={styles.labelInput}>Nome Completo</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="Seu nome completo"
            placeholderTextColor="#8F9CAE"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelInput}>E-mail</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#8F9CAE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelInput}>Nascimento</Text>
              <TextInput
                style={styles.inputAuth}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#8F9CAE"
                keyboardType="numeric"
                value={dataNascimento}
                onChangeText={setDataNascimento}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.labelInput}>Telefone</Text>
              <TextInput
                style={styles.inputAuth}
                placeholder="(71) 99999-9999"
                placeholderTextColor="#8F9CAE"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
              />
            </View>
          </View>

          <Text style={styles.labelInput}>CPF ou CNPJ</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="000.000.000-00"
            placeholderTextColor="#8F9CAE"
            keyboardType="numeric"
            value={documento}
            onChangeText={setDocumento}
          />

          <Text style={styles.labelInput}>Senha</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="Crie uma senha forte"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.labelInput}>Confirmar Senha</Text>
          <TextInput
            style={styles.inputAuth}
            placeholder="Repita sua senha"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={[styles.btnPrimarioAuth, { marginTop: 24 }]} onPress={handleCriarConta}>
            <Text style={styles.textoBtnPrimario}>Criar Conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={irParaLogin} style={styles.linkCadastro}>
          <Text style={styles.textoLink}>
            Já tem uma conta? <Text style={styles.textDestaque}>Fazer Login</Text>
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
  btnPrimarioAuth: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnPrimario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkCadastro: { alignItems: 'center' },
  textoLink: { color: '#8F9CAE', fontSize: 14 },
  textDestaque: { color: '#7C3AED', fontWeight: 'bold' },
});
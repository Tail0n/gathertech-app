import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaCadastroUsuario({ aoVoltar, aoCadastrar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRegistar = () => {
    // 1. Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !email || !senha || !confirmarSenha || !cpfCnpj) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // 2. Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    // Se passar nas validações, cria a conta
    Alert.alert('Sucesso!', 'Conta criada com sucesso!', [
      { text: 'OK', onPress: aoCadastrar }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.sub}>Preencha os dados abaixo para se registar no GatherTech.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Lucas Andrade"
            placeholderTextColor="#8F9CAE"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#8F9CAE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#8F9CAE"
            value={nascimento}
            onChangeText={setNascimento}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(71) 99999-9999"
            placeholderTextColor="#8F9CAE"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          <Text style={styles.label}>CPF ou CNPJ *</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor="#8F9CAE"
            value={cpfCnpj}
            onChangeText={setCpfCnpj}
          />

          <Text style={styles.label}>Senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.label}>Confirmar Senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={styles.btnSalvar} onPress={handleRegistar}>
            <Text style={styles.textoBtnSalvar}>Concluir Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={aoVoltar} style={styles.linkLogin}>
            <Text style={styles.textoLink}>
              Já tem uma conta? <Text style={styles.textDestaque}>Fazer Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10', paddingHorizontal: 20 },
  scrollBody: { paddingTop: 30, paddingBottom: 40 }, 
  titulo: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  sub: { color: '#94A3B8', fontSize: 14, marginBottom: 24, lineHeight: 20 },
  form: { width: '100%' },
  label: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#121620', borderWidth: 1, borderColor: '#1E2430', borderRadius: 10, padding: 12, color: '#FFFFFF', fontSize: 14 },
  btnSalvar: { backgroundColor: '#0066FF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  textoBtnSalvar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkLogin: { alignItems: 'center', marginTop: 24 },
  textoLink: { color: '#8F9CAE', fontSize: 14 },
  textDestaque: { color: '#7C3AED', fontWeight: 'bold' }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.0.0.102:3000/api/redefinir-senha';

export default function TelaRedefinirSenha({ email, codigo, aoConcluir }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRedefinir = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha ambos os campos.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, novaSenha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        Alert.alert('Sucesso!', 'A sua senha foi alterada com sucesso.', [{ text: 'Fazer Login', onPress: aoConcluir }]);
      } else {
        Alert.alert('Erro', dados.erro || 'Não foi possível redefinir a senha.');
      }
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerArea}>
          <Text style={styles.titulo}>Nova Senha</Text>
          <Text style={styles.subtitulo}>Crie uma nova senha para a sua conta.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a nova senha"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme a nova senha"
            placeholderTextColor="#8F9CAE"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={styles.btnEnviar} onPress={handleRedefinir} disabled={carregando}>
            {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.textoBtnEnviar}>Redefinir Senha</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24, justifyContent: 'center' },
  content: { width: '100%' },
  headerArea: { marginBottom: 32 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitulo: { fontSize: 15, color: '#8F9CAE', lineHeight: 22 },
  form: { marginBottom: 24 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#FFFFFF', fontSize: 15 },
  btnEnviar: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  textoBtnEnviar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
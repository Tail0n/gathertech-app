import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaRecuperarSenha({ aoVoltar }) {
  const [email, setEmail] = useState('');

  const handleEnviar = () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite o seu e-mail.');
      return;
    }
    Alert.alert('Sucesso', 'Instruções enviadas para o seu e-mail.', [
      { text: 'OK', onPress: aoVoltar }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={aoVoltar} style={styles.btnVoltar}>
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.titulo}>Recuperar Senha</Text>
        <Text style={styles.sub}>Digite seu e-mail cadastrado para receber as instruções.</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#8F9CAE"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.btn} onPress={handleEnviar}>
          <Text style={styles.textoBtn}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10', paddingHorizontal: 20 },
  btnVoltar: { marginTop: 10, marginBottom: 20 },
  textoVoltar: { color: '#8B5CF6', fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', paddingBottom: 60 },
  titulo: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  sub: { color: '#94A3B8', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  input: { backgroundColor: '#121620', borderWidth: 1, borderColor: '#1E2430', borderRadius: 10, padding: 14, color: '#FFFFFF', marginBottom: 20 },
  btn: { backgroundColor: '#0066FF', padding: 16, borderRadius: 10, alignItems: 'center' },
  textoBtn: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
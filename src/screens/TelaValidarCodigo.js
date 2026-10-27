import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.0.0.102:3000/api/validar-codigo';

export default function TelaValidarCodigo({ email, aoVoltar, aoSucesso }) {
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleValidar = async () => {
    if (codigo.length < 6) {
      Alert.alert('Atenção', 'O código deve conter 6 dígitos.');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        aoSucesso(codigo); // Passa o código validado para a próxima tela
      } else {
        Alert.alert('Erro', dados.erro || 'Código inválido ou expirado.');
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
          <Text style={styles.titulo}>Verificar Código</Text>
          <Text style={styles.subtitulo}>
            Enviamos um código de 6 dígitos para o e-mail: {email}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.inputCodigo}
            placeholder="000000"
            placeholderTextColor="#8F9CAE"
            keyboardType="numeric"
            maxLength={6}
            value={codigo}
            onChangeText={setCodigo}
            textAlign="center"
          />

          <TouchableOpacity style={styles.btnEnviar} onPress={handleValidar} disabled={carregando}>
            {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.textoBtnEnviar}>Validar Código</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnVoltar} onPress={aoVoltar}>
          <Text style={styles.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24, justifyContent: 'center' },
  content: { width: '100%' },
  headerArea: { marginBottom: 32, alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitulo: { fontSize: 15, color: '#8F9CAE', textAlign: 'center', lineHeight: 22 },
  form: { marginBottom: 24 },
  inputCodigo: { backgroundColor: '#121824', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#0066FF', fontSize: 32, letterSpacing: 8, fontWeight: 'bold', marginBottom: 20 },
  btnEnviar: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnEnviar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  btnVoltar: { alignItems: 'center', paddingVertical: 12 },
  textoVoltar: { color: '#8F9CAE', fontSize: 14, fontWeight: '600' }
});
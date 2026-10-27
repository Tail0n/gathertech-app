import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.0.0.102:3000/api/recuperar-senha';

// Validação de formato de e-mail
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function TelaRecuperarSenha({ aoVoltar, aoAvancar }) {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const emailValido = email.length === 0 || validarEmail(email);

  const handleRecuperarSenha = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, digite o seu e-mail cadastrado.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('E-mail Inválido', 'Insira um e-mail no formato correto (ex: nome@dominio.com).');
      return;
    }

    try {
      setCarregando(true);

      const emailTratado = email.toLowerCase().trim();

      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTratado }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        Alert.alert(
          'Código Enviado!',
          dados.mensagem || 'Enviamos o código de 6 dígitos para o seu e-mail.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (aoAvancar) {
                  aoAvancar(emailTratado);
                }
              } 
            }
          ]
        );
      } else {
        Alert.alert('Atenção', dados.erro || 'Não foi possível solicitar a recuperação.');
      }
    } catch (erro) {
      console.error('Erro ao recuperar senha:', erro);
      Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor da API.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.headerArea}>
          <Text style={styles.titulo}>Recuperar Senha</Text>
          <Text style={styles.subtitulo}>
            Digite o e-mail associado à sua conta para receber o código de verificação.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={[styles.input, !emailValido && styles.inputErro]}
            placeholder="nome@dominio.com"
            placeholderTextColor="#8F9CAE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {!emailValido && (
            <Text style={styles.textoErro}>E-mail inválido. Utilize o formato nome@dominio.com</Text>
          )}

          <TouchableOpacity 
            style={styles.btnEnviar} 
            onPress={handleRecuperarSenha} 
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBtnEnviar}>Enviar Código</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnVoltar} onPress={aoVoltar}>
          <Text style={styles.textoVoltar}>Voltar para o Login</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24, justifyContent: 'center' },
  content: { width: '100%', paddingBottom: 40 },
  headerArea: { marginBottom: 32 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitulo: { fontSize: 15, color: '#8F9CAE', lineHeight: 22 },
  form: { marginBottom: 24 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#FFFFFF', fontSize: 15 },
  inputErro: { borderColor: '#EF4444' },
  textoErro: { color: '#EF4444', fontSize: 12, marginTop: 4, marginBottom: 8 },
  btnEnviar: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  textoBtnEnviar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  btnVoltar: { alignItems: 'center', paddingVertical: 12 },
  textoVoltar: { color: '#8F9CAE', fontSize: 14, fontWeight: '600' }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaCadastro({ adicionarEvento, navigation }) {
  const [titulo, setTitulo] = useState('');
  const [cidade, setCidade] = useState('');
  const [tech, setTech] = useState('React');

  const handleCadastrar = () => {
    if (!titulo || !cidade) {
      Alert.alert('Atenção', 'Por favor, preencha o título e a cidade do evento.');
      return;
    }

    const novoEvento = {
      id: Date.now().toString(),
      titulo,
      cidade,
      formato: 'Presencial',
      tech,
      nota: '5.0',
      preco: 'Gratuito',
      imagem: 'https://picsum.photos/400/200?random=' + Date.now(),
      participantes: 1,
    };

    adicionarEvento(novoEvento);
    Alert.alert('Sucesso!', 'Evento cadastrado e publicado com sucesso!');
    setTitulo('');
    setCidade('');
    navigation.navigate('Eventos');
  };

  return (
    <SafeAreaView style={styles.containerFeed}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitleFeed, { marginVertical: 20 }]}>👩‍💼 Cadastrar Novo Evento</Text>
        
        <Text style={styles.labelInput}>Título do Evento:</Text>
        <TextInput 
          style={styles.inputAuth} 
          placeholder="Ex: Workshop Node.js" 
          placeholderTextColor="#8F9CAE"
          value={titulo} 
          onChangeText={setTitulo} 
        />

        <Text style={styles.labelInput}>Cidade / Local:</Text>
        <TextInput 
          style={styles.inputAuth} 
          placeholder="Ex: Salvador - BA ou Online" 
          placeholderTextColor="#8F9CAE"
          value={cidade} 
          onChangeText={setCidade} 
        />

        <Text style={styles.labelInput}>Tecnologia Principal:</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {['React', 'Python', 'IA'].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.chipTech, tech === t && styles.chipTechAtivo]}
              onPress={() => setTech(t)}
            >
              <Text style={[styles.textoChipTech, tech === t && styles.textoChipTechAtivo]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrimarioAuth} onPress={handleCadastrar}>
          <Text style={styles.textoBtnPrimario}>Publicar Evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerFeed: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 20 },
  headerTitleFeed: { fontSize: 20, fontWeight: 'bold', color: '#0066FF' },
  labelInput: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  inputAuth: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#FFFFFF', fontSize: 15 },
  chipTech: { backgroundColor: '#121824', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', marginRight: 8 },
  chipTechAtivo: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  textoChipTech: { color: '#8F9CAE', fontSize: 13, fontWeight: '600' },
  textoChipTechAtivo: { color: '#FFFFFF' },
  btnPrimarioAuth: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  textoBtnPrimario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
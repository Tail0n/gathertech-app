import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function TelaCriarEvento({ aoVoltar, aoSalvar }) {
  const [imagem, setImagem] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [stack, setStack] = useState('');
  const [formato, setFormato] = useState('Presencial');
  const [preco, setPreco] = useState('Gratuito');

  const escolherImagem = () => {
    // Aqui no futuro você instalará o expo-image-picker.
    // Por enquanto, simulamos que o utilizador escolheu uma foto da galeria!
    setImagem('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600');
  };

  const handleSalvar = () => {
    if (!titulo || !data || !local) {
      Alert.alert('Atenção', 'Por favor, preencha pelo menos o Título, Data e Local.');
      return;
    }
    
    const novoEvento = {
      id: Math.random().toString(),
      titulo,
      descricao,
      data,
      cidade: local,
      tech: stack,
      formato,
      preco,
      imagem: imagem || 'https://picsum.photos/600/400' // Usa a imagem escolhida ou uma padrão
    };

    aoSalvar(novoEvento);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={aoVoltar} style={styles.btnVoltar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="arrow-left" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Evento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
        
        {/* ÁREA DE UPLOAD DE IMAGEM */}
        <Text style={[styles.label, { marginTop: 0 }]}>Capa do Evento</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem} activeOpacity={0.8}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagemSelecionada} />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Feather name="image" size={32} color="#475569" />
              <Text style={styles.imagePickerText}>Toque para adicionar uma imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Título do Evento *</Text>
        <TextInput style={styles.input} placeholder="Ex: Workshop de React Native" placeholderTextColor="#475569" value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Data e Horário *</Text>
        <TextInput style={styles.input} placeholder="Ex: 24 de Nov • 14:00" placeholderTextColor="#475569" value={data} onChangeText={setData} />

        <Text style={styles.label}>Local (Endereço ou Link) *</Text>
        <TextInput style={styles.input} placeholder="Ex: Laboratório 3 ou Link do Meet" placeholderTextColor="#475569" value={local} onChangeText={setLocal} />

        <Text style={styles.label}>Tecnologias / Stack</Text>
        <TextInput style={styles.input} placeholder="Ex: Python, Frontend, DevOps..." placeholderTextColor="#475569" value={stack} onChangeText={setStack} />

        <View style={styles.rowSelectors}>
          <View style={styles.selectorGroup}>
            <Text style={styles.label}>Formato</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity style={[styles.chip, formato === 'Presencial' && styles.chipAtivo]} onPress={() => setFormato('Presencial')}>
                <Text style={[styles.chipText, formato === 'Presencial' && styles.chipTextAtivo]}>Presencial</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, formato === 'Online' && styles.chipAtivo]} onPress={() => setFormato('Online')}>
                <Text style={[styles.chipText, formato === 'Online' && styles.chipTextAtivo]}>Online</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.selectorGroup}>
            <Text style={styles.label}>Preço</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity style={[styles.chip, preco === 'Gratuito' && styles.chipAtivo]} onPress={() => setPreco('Gratuito')}>
                <Text style={[styles.chipText, preco === 'Gratuito' && styles.chipTextAtivo]}>Gratuito</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, preco === 'Pago' && styles.chipAtivo]} onPress={() => setPreco('Pago')}>
                <Text style={[styles.chipText, preco === 'Pago' && styles.chipTextAtivo]}>Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Descrição (Opcional)</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Detalhes sobre o evento..." placeholderTextColor="#475569" multiline={true} numberOfLines={4} value={descricao} onChangeText={setDescricao} textAlignVertical="top" />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBtnSalvar}>Publicar Evento</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E2430' },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  btnVoltar: { padding: 4 },
  formContainer: { padding: 20, paddingBottom: 40 },
  
  // ESTILOS DO UPLOAD DE IMAGEM
  imagePicker: { height: 160, backgroundColor: '#121620', borderWidth: 2, borderColor: '#1E2430', borderStyle: 'dashed', borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  imagePickerPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePickerText: { color: '#475569', marginTop: 12, fontSize: 14, fontWeight: '500' },
  imagemSelecionada: { width: '100%', height: '100%', resizeMode: 'cover' },

  label: { color: '#E2E8F0', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#121620', borderWidth: 1, borderColor: '#1E2430', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#F8FAFC', fontSize: 15 },
  textArea: { height: 120 },
  rowSelectors: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  selectorGroup: { flex: 1, marginRight: 10 },
  chipContainer: { flexDirection: 'row', backgroundColor: '#121620', borderRadius: 10, borderWidth: 1, borderColor: '#1E2430', overflow: 'hidden' },
  chip: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  chipAtivo: { backgroundColor: '#8B5CF6' },
  chipText: { color: '#8F9CAE', fontSize: 13, fontWeight: '600' },
  chipTextAtivo: { color: '#FFFFFF' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#1E2430', backgroundColor: '#090C10' },
  btnSalvar: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnSalvar: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
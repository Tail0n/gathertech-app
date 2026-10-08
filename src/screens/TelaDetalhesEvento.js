import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaDetalhesEvento({ evento, aoVoltar }) {
  const [fotos, setFotos] = useState([
    evento.imagem || 'https://picsum.photos/400/250?random=1',
    'https://picsum.photos/400/250?random=2',
    'https://picsum.photos/400/250?random=3',
  ]);

  const [comentarios, setComentarios] = useState([
    { id: '1', usuario: 'Lucas Andrade', texto: 'Evento sensacional na edição passada! Valeu muito a pena.', nota: '5.0' },
    { id: '2', usuario: 'Maria Julia', texto: 'Ótima organização e o conteúdo foi super prático.', nota: '4.8' },
  ]);
  const [novoComentario, setNovoComentario] = useState('');

  const handleAdicionarFoto = () => {
    const novaFotoUrl = `https://picsum.photos/400/250?random=${Date.now()}`;
    setFotos([...fotos, novaFotoUrl]);
    Alert.alert('Foto Adicionada!', 'Sua foto do evento foi enviada para a galeria com sucesso.');
  };

  const handleAdicionarComentario = () => {
    if (!novoComentario.trim()) {
      Alert.alert('Atenção', 'Digite um comentário antes de enviar.');
      return;
    }

    const item = {
      id: Date.now().toString(),
      usuario: 'Você (Lucas)',
      texto: novoComentario,
      nota: '5.0',
    };

    setComentarios([item, ...comentarios]);
    setNovoComentario('');
    Alert.alert('Sucesso!', 'Seu comentário foi publicado.');
  };

  if (!evento) return null;

  return (
    <SafeAreaView style={styles.containerFeed}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <TouchableOpacity style={styles.btnVoltarDetalhes} onPress={aoVoltar}>
          <Text style={styles.textoBtnVoltar}>← Voltar aos Eventos</Text>
        </TouchableOpacity>

        <View style={styles.secaoGaleria}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.containerFotosCarrossel}
          >
            {fotos.map((fotoUrl, idx) => (
              <View key={idx} style={styles.cardFotoWrapper}>
                <Image source={{ uri: fotoUrl }} style={styles.imagemCarrossel} resizeMode="cover" />
                <View style={styles.badgeIndicadorFoto}>
                  <Text style={styles.textoIndicadorFoto}>{idx + 1}/{fotos.length}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.btnAdicionarFoto} onPress={handleAdicionarFoto}>
            <Text style={styles.textoAdicionarFoto}>📷 Adicionar Foto ao Evento</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linhaTagsDetalhes}>
          <View style={styles.badgeFormato}>
            <Text style={styles.textoBadge}>{evento.formato}</Text>
          </View>
          <Text style={styles.techTagDetalhes}>{evento.tech}</Text>
        </View>

        <Text style={styles.tituloDetalhes}>{evento.titulo}</Text>
        <Text style={styles.subDetalhes}>📍 Local: {evento.localExato || evento.cidade}</Text>
        <Text style={styles.subDetalhes}>🎟️ Valor: {evento.preco || 'Gratuito'}</Text>
        <Text style={styles.subDetalhes}>⭐ Avaliação Geral: {evento.nota} / 5.0</Text>

        <View style={styles.secaoDetalhes}>
          <Text style={styles.tituloSecao}>Sobre o Evento</Text>
          <Text style={styles.textoDescricao}>
            {evento.descricao || 'Este evento reúne profissionais, estudantes e entusiastas de tecnologia para trocas de conhecimento, minicursos e networking focado no mercado de Salvador e região.'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.btnInscricaoDetalhes}
          onPress={() => Alert.alert('Inscrição Externa', 'Redirecionando para a plataforma externa de inscrição...')}
        >
          <Text style={styles.textoBtnInscricao}>Garantir Minha Vaga 🚀</Text>
        </TouchableOpacity>

        <View style={styles.secaoComentarios}>
          <Text style={styles.tituloSecao}>💬 Avaliações e Comentários</Text>

          <View style={styles.boxNovoComentario}>
            <TextInput
              style={styles.inputComentario}
              placeholder="Escreva seu comentário ou dúvida..."
              placeholderTextColor="#8F9CAE"
              multiline
              value={novoComentario}
              onChangeText={setNovoComentario}
            />
            <TouchableOpacity style={styles.btnEnviarComentario} onPress={handleAdicionarComentario}>
              <Text style={styles.textoBtnEnviar}>Comentar</Text>
            </TouchableOpacity>
          </View>

          {comentarios.map((item) => (
            <View key={item.id} style={styles.cardComentario}>
              <View style={styles.headerComentario}>
                <Text style={styles.nomeComentario}>{item.usuario}</Text>
                <Text style={styles.notaComentario}>⭐ {item.nota}</Text>
              </View>
              <Text style={styles.textoCardComentario}>{item.texto}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerFeed: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 20 },
  btnVoltarDetalhes: { marginBottom: 16, paddingTop: 10 },
  textoBtnVoltar: { color: '#0066FF', fontSize: 15, fontWeight: 'bold' },
  secaoGaleria: { marginBottom: 20 },
  containerFotosCarrossel: { gap: 12, paddingRight: 20 },
  cardFotoWrapper: { position: 'relative', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1E293B' },
  imagemCarrossel: { width: 280, height: 170, borderRadius: 14 },
  badgeIndicadorFoto: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(15, 23, 42, 0.8)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  textoIndicadorFoto: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  btnAdicionarFoto: { marginTop: 12, backgroundColor: '#121824', borderWidth: 1, borderColor: '#1E293B', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  textoAdicionarFoto: { color: '#0066FF', fontWeight: '600', fontSize: 13 },
  linhaTagsDetalhes: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badgeFormato: { backgroundColor: '#0066FF22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#0066FF' },
  textoBadge: { color: '#0066FF', fontSize: 11, fontWeight: 'bold' },
  techTagDetalhes: { color: '#7C3AED', fontWeight: 'bold', fontSize: 13 },
  tituloDetalhes: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  subDetalhes: { color: '#8F9CAE', fontSize: 14, marginBottom: 6 },
  secaoDetalhes: { marginTop: 20, marginBottom: 20 },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  textoDescricao: { color: '#CBD5E1', fontSize: 14, lineHeight: 22 },
  btnInscricaoDetalhes: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  textoBtnInscricao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  secaoComentarios: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 20 },
  boxNovoComentario: { marginBottom: 20 },
  inputComentario: { backgroundColor: '#121824', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, padding: 12, color: '#FFFFFF', minHeight: 80, textAlignVertical: 'top', marginBottom: 10 },
  btnEnviarComentario: { backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: 20 },
  textoBtnEnviar: { color: '#FFFFFF', fontWeight: 'bold' },
  cardComentario: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', marginBottom: 12 },
  headerComentario: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  nomeComentario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  notaComentario: { color: '#7C3AED', fontWeight: 'bold', fontSize: 12 },
  textoCardComentario: { color: '#8F9CAE', fontSize: 13, lineHeight: 18 },
});
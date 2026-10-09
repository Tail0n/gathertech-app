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
    { id: '1', usuario: 'Lucas Andrade', texto: 'Evento sensacional na edição passada! Valeu muito a pena.', nota: 5 },
    { id: '2', usuario: 'Maria Julia', texto: 'Ótima organização e o conteúdo foi super prático.', nota: 4 },
  ]);
  
  const [novoComentario, setNovoComentario] = useState('');
  const [novaNota, setNovaNota] = useState(5); // Estado para controlar as estrelas selecionadas

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
      nota: novaNota, // Usa a nota selecionada nas estrelas
    };

    setComentarios([item, ...comentarios]);
    setNovoComentario('');
    setNovaNota(5); // Reseta as estrelas para 5
    Alert.alert('Sucesso!', 'Sua avaliação foi publicada.');
  };

  if (!evento) return null;

  return (
    <SafeAreaView style={styles.containerGeral}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- BOTÃO VOLTAR --- */}
        <TouchableOpacity style={styles.btnVoltarDetalhes} onPress={aoVoltar}>
          <Text style={styles.textoBtnVoltar}>← Voltar</Text>
        </TouchableOpacity>

        {/* --- CARROSSEL DE FOTOS --- */}
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

        {/* --- CABEÇALHO DO EVENTO --- */}
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

        {/* --- BOTÃO INSCRIÇÃO EXTERNA --- */}
        <TouchableOpacity 
          style={styles.btnInscricaoDetalhes}
          onPress={() => Alert.alert('Inscrição Externa', 'Redirecionando para a plataforma externa de inscrição...')}
        >
          <Text style={styles.textoBtnInscricao}>Garantir Minha Vaga 🚀</Text>
        </TouchableOpacity>

        {/* --- AVALIAÇÕES E COMENTÁRIOS --- */}
        <View style={styles.secaoComentarios}>
          <Text style={styles.tituloSecao}>💬 Avaliações e Comentários</Text>

          <View style={styles.boxNovoComentario}>
            
            {/* SELETOR DE ESTRELAS INTERATIVO */}
            <View style={styles.containerEstrelasInterativas}>
              <Text style={styles.labelAvaliacao}>Sua nota para o evento:</Text>
              <View style={styles.rowEstrelas}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    onPress={() => setNovaNota(star)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.estrelaClick, novaNota >= star ? styles.estrelaAtiva : styles.estrelaInativa]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CAMPO DE TEXTO DO COMENTÁRIO */}
            <TextInput
              style={styles.inputComentario}
              placeholder="Escreva o que você achou do evento..."
              placeholderTextColor="#64748B"
              multiline
              value={novoComentario}
              onChangeText={setNovoComentario}
            />
            
            <TouchableOpacity style={styles.btnEnviarComentario} onPress={handleAdicionarComentario}>
              <Text style={styles.textoBtnEnviar}>Publicar Avaliação</Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE AVALIAÇÕES (MOCK) */}
          {comentarios.map((item) => (
            <View key={item.id} style={styles.cardComentario}>
              <View style={styles.headerComentario}>
                <Text style={styles.nomeComentario}>{item.usuario}</Text>
                
                {/* Mostra as estrelas da nota daquele comentário */}
                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={{ color: item.nota >= s ? '#FBBF24' : '#1E2430', fontSize: 12 }}>★</Text>
                  ))}
                </View>

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
  containerGeral: { 
    flex: 1, 
    backgroundColor: '#090C10', 
    paddingHorizontal: 20 
  },
  btnVoltarDetalhes: { 
    marginBottom: 16, 
    paddingTop: 16 
  },
  textoBtnVoltar: { 
    color: '#8B5CF6', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  secaoGaleria: { 
    marginBottom: 20 
  },
  containerFotosCarrossel: { 
    gap: 12, 
    paddingRight: 20 
  },
  cardFotoWrapper: { 
    position: 'relative', 
    borderRadius: 14, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#1E2430' 
  },
  imagemCarrossel: { 
    width: 280, 
    height: 170, 
    borderRadius: 14 
  },
  badgeIndicadorFoto: { 
    position: 'absolute', 
    bottom: 8, 
    right: 8, 
    backgroundColor: 'rgba(9, 12, 16, 0.8)', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6 
  },
  textoIndicadorFoto: { 
    color: '#FFFFFF', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  btnAdicionarFoto: { 
    marginTop: 12, 
    backgroundColor: '#121620', 
    borderWidth: 1, 
    borderColor: '#1E2430', 
    paddingVertical: 10, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  textoAdicionarFoto: { 
    color: '#0066FF', 
    fontWeight: '600', 
    fontSize: 13 
  },
  linhaTagsDetalhes: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 12 
  },
  badgeFormato: { 
    backgroundColor: '#7C3AED22', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#7C3AED' 
  },
  textoBadge: { 
    color: '#7C3AED', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  techTagDetalhes: { 
    color: '#8B5CF6', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  tituloDetalhes: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 12 
  },
  subDetalhes: { 
    color: '#94A3B8', 
    fontSize: 14, 
    marginBottom: 6 
  },
  secaoDetalhes: { 
    marginTop: 20, 
    marginBottom: 20 
  },
  tituloSecao: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 10 
  },
  textoDescricao: { 
    color: '#CBD5E1', 
    fontSize: 14, 
    lineHeight: 22 
  },
  btnInscricaoDetalhes: { 
    backgroundColor: '#8B5CF6', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 30 
  },
  textoBtnInscricao: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // ESTILOS DA SEÇÃO DE AVALIAÇÕES E ESTRELAS
  secaoComentarios: { 
    borderTopWidth: 1, 
    borderTopColor: '#1E2430', 
    paddingTop: 20 
  },
  boxNovoComentario: { 
    marginBottom: 24,
    backgroundColor: '#121620',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2430'
  },
  containerEstrelasInterativas: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  labelAvaliacao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  rowEstrelas: {
    flexDirection: 'row',
    gap: 8,
  },
  estrelaClick: {
    fontSize: 32,
  },
  estrelaAtiva: {
    color: '#FBBF24', // Amarelo/Dourado para estrelas ativas
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  estrelaInativa: {
    color: '#1E2430', // Cinza escuro do tema
  },
  inputComentario: { 
    backgroundColor: '#090C10', 
    borderWidth: 1, 
    borderColor: '#1E2430', 
    borderRadius: 10, 
    padding: 12, 
    color: '#FFFFFF', 
    minHeight: 80, 
    textAlignVertical: 'top', 
    marginBottom: 12 
  },
  btnEnviarComentario: { 
    backgroundColor: '#0066FF', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    alignSelf: 'flex-end', 
    paddingHorizontal: 20 
  },
  textoBtnEnviar: { 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },

  // LISTA DE COMENTÁRIOS MOCKADOS
  cardComentario: { 
    backgroundColor: '#121620', 
    padding: 14, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#1E2430', 
    marginBottom: 12 
  },
  headerComentario: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6 
  },
  nomeComentario: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  textoCardComentario: { 
    color: '#94A3B8', 
    fontSize: 13, 
    lineHeight: 18 
  },
});
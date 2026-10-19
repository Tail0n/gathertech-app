import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Share, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TelaDetalhesEvento({ evento, aoVoltar }) {
  
  const [novoComentario, setNovoComentario] = useState('');
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(0); 
  
  // Adicionada a propriedade 'nota' aos comentários iniciais
  const [listaComentarios, setListaComentarios] = useState(evento?.comentarios || [
    { id: '1', nome: 'Maria Silva', texto: 'Muito ansiosa para este evento! Vai ser incrível.', avatar: 'https://i.pravatar.cc/100?img=5', nota: 5 },
    { id: '2', nome: 'João Pedro', texto: 'Alguém sabe se vai ter emissão de certificado no final?', avatar: 'https://i.pravatar.cc/100?img=11', nota: 4 }
  ]);

  const compartilharEvento = async () => {
    try {
      await Share.share({
        message: `Olha este evento incrível no GatherTech: ${evento.titulo} - ${evento.data || 'Data a definir'}. Participa!`,
      });
    } catch (error) {
      console.log('Erro ao partilhar', error);
    }
  };

  const adicionarComentario = () => {
    if (novoComentario.trim() === '') return;
    const novo = {
      id: Math.random().toString(),
      nome: 'Você (Aluno)',
      texto: novoComentario,
      avatar: 'https://i.pravatar.cc/100?img=3',
      nota: minhaAvaliacao > 0 ? minhaAvaliacao : null // Atrela a sua nota ao comentário!
    };
    setListaComentarios([...listaComentarios, novo]);
    setNovoComentario('');
  };

  if (!evento) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.headerAbsolute}>
            <TouchableOpacity onPress={aoVoltar} style={styles.btnHeader}>
                <Feather name="arrow-left" size={24} color="#F8FAFC" />
            </TouchableOpacity>
         </View>
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Evento não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fotosCarrossel = evento.fotos || [
    evento.imagem || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=600'
  ];

  const renderizarEstrelasMedia = (nota) => {
    const estrelas = [];
    const notaArredondada = Math.round(nota || 5); 
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Feather key={i} name="star" size={16} color={i <= notaArredondada ? "#FBBF24" : "#475569"} style={{ marginRight: 2 }} />
      );
    }
    return estrelas;
  };

  // Nova função para gerar estrelinhas pequenas nos comentários
  const renderizarEstrelasComentario = (nota) => {
    if (!nota) return null; // Se a pessoa não avaliou, não mostra as estrelas
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Feather key={i} name="star" size={12} color={i <= nota ? "#FBBF24" : "#475569"} style={{ marginLeft: 2 }} />
      );
    }
    return <View style={styles.comentarioEstrelasContainer}>{estrelas}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.headerAbsolute}>
        <TouchableOpacity onPress={aoVoltar} style={styles.btnHeader}>
          <Feather name="arrow-left" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <TouchableOpacity onPress={compartilharEvento} style={styles.btnHeader}>
          <Feather name="share-2" size={24} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {fotosCarrossel.map((foto, index) => (
            <Image key={index} source={{ uri: foto }} style={styles.imagemCapa} />
          ))}
        </ScrollView>

        <View style={styles.contentBody}>
          
          <View style={styles.rowTagsAvaliacao}>
              <View style={styles.tagContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{evento.formato || 'Indefinido'}</Text>
                </View>
                <View style={[styles.tag, evento.preco === 'Gratuito' || !evento.preco ? styles.tagFree : styles.tagPaid]}>
                  <Text style={[styles.tagText, evento.preco === 'Gratuito' || !evento.preco ? styles.tagTextFree : {}]}>
                    {evento.preco || 'Gratuito'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.avaliacaoContainer}>
                 {renderizarEstrelasMedia(evento.nota)}
                 <Text style={styles.notaTexto}>{evento.nota || '5.0'}</Text>
              </View>
          </View>

          <Text style={styles.titulo}>{evento.titulo}</Text>

          <View style={styles.infoCard}>
             <View style={styles.infoRow}>
                <View style={styles.infoIconBg}>
                   <Feather name="calendar" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Data e Hora</Text>
                    <Text style={styles.infoValue}>{evento.data || 'Data a definir'}</Text>
                </View>
             </View>
             
             <View style={styles.infoDivider} />

             <View style={styles.infoRow}>
                <View style={styles.infoIconBg}>
                   <Ionicons name="location-outline" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Localização</Text>
                    <Text style={styles.infoValue}>{evento.cidade || evento.localExato || 'Local a definir'}</Text>
                </View>
             </View>

             {evento.tech && (
                 <>
                   <View style={styles.infoDivider} />
                   <View style={styles.infoRow}>
                        <View style={styles.infoIconBg}>
                        <Feather name="code" size={20} color="#8B5CF6" />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Tecnologias / Stack</Text>
                            <Text style={styles.infoValue}>{evento.tech}</Text>
                        </View>
                    </View>
                 </>
             )}
          </View>

          <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle}>Sobre o evento</Text>
             <Text style={styles.descricao}>
               {evento.descricao || 'Nenhuma descrição detalhada foi fornecida para este evento.'}
             </Text>
          </View>

          <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Avalie este evento</Text>
              <View style={styles.estrelasInterativasContainer}>
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <TouchableOpacity 
                    key={estrela} 
                    onPress={() => setMinhaAvaliacao(estrela)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name="star"
                      size={36}
                      color={estrela <= minhaAvaliacao ? "#FBBF24" : "#1E2430"}
                      style={styles.estrelaClicavel}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {minhaAvaliacao > 0 && (
                <Text style={styles.textoAgradecimentoAvaliacao}>
                  Obrigado! Você avaliou com {minhaAvaliacao} estrela{minhaAvaliacao > 1 ? 's' : ''}.
                </Text>
              )}
          </View>

          <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Comentários</Text>
              
              {listaComentarios.map((comentario) => (
                  <View key={comentario.id} style={styles.comentarioItem}>
                      <Image source={{ uri: comentario.avatar }} style={styles.avatarComentario} />
                      <View style={styles.comentarioConteudo}>
                          {/* CABEÇALHO DO COMENTÁRIO COM NOME E ESTRELAS */}
                          <View style={styles.comentarioHeader}>
                              <Text style={styles.comentarioNome}>{comentario.nome}</Text>
                              {renderizarEstrelasComentario(comentario.nota)}
                          </View>
                          <Text style={styles.comentarioTexto}>{comentario.texto}</Text>
                      </View>
                  </View>
              ))}

              <View style={styles.inputComentarioContainer}>
                  <TextInput 
                      style={styles.inputComentario}
                      placeholder="Faça uma pergunta ou comente..."
                      placeholderTextColor="#475569"
                      value={novoComentario}
                      onChangeText={setNovoComentario}
                  />
                  <TouchableOpacity style={styles.btnEnviarComentario} onPress={adicionarComentario}>
                      <Feather name="send" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
              </View>
          </View>

        </View>
      </ScrollView>

      <View style={styles.footerAbsolute}>
         <TouchableOpacity style={styles.btnInscrever} onPress={() => alert('Inscrição confirmada!')}>
            <Text style={styles.textoBtnInscrever}>Participar do Evento</Text>
         </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  headerAbsolute: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  btnHeader: { backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  
  imagemCapa: { width: width, height: 280, resizeMode: 'cover' }, 
  
  contentBody: { padding: 24, paddingBottom: 100 }, 
  
  rowTagsAvaliacao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tagContainer: { flexDirection: 'row', gap: 10 },
  tag: { backgroundColor: '#1E2430', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: '#8F9CAE', fontSize: 12, fontWeight: 'bold' },
  tagFree: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  tagPaid: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  tagTextFree: { color: '#10B981' },
  
  avaliacaoContainer: { flexDirection: 'row', alignItems: 'center' },
  notaTexto: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  
  titulo: { color: '#F8FAFC', fontSize: 24, fontWeight: 'bold', marginBottom: 24, lineHeight: 32 },
  
  infoCard: { backgroundColor: '#121620', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#1E2430' },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoIconBg: { backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: 12, borderRadius: 12, marginRight: 16 },
  infoTextContainer: { flex: 1 },
  infoLabel: { color: '#8F9CAE', fontSize: 12, marginBottom: 4 },
  infoValue: { color: '#F8FAFC', fontSize: 15, fontWeight: '500' },
  infoDivider: { height: 1, backgroundColor: '#1E2430', marginVertical: 12 },

  sectionContainer: { marginBottom: 24 },
  sectionTitle: { color: '#E2E8F0', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  descricao: { color: '#8F9CAE', fontSize: 15, lineHeight: 24 },

  estrelasInterativasContainer: { flexDirection: 'row', marginTop: 4, marginBottom: 8 },
  estrelaClicavel: { marginRight: 12 },
  textoAgradecimentoAvaliacao: { color: '#10B981', fontSize: 14, fontWeight: '600', marginTop: 8 },

  comentarioItem: { flexDirection: 'row', marginBottom: 16 },
  avatarComentario: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  comentarioConteudo: { flex: 1, backgroundColor: '#121620', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1E2430' },
  comentarioHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  comentarioEstrelasContainer: { flexDirection: 'row', marginLeft: 8 },
  comentarioNome: { color: '#E2E8F0', fontSize: 13, fontWeight: 'bold' },
  comentarioTexto: { color: '#8F9CAE', fontSize: 14, lineHeight: 20 },

  inputComentarioContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  inputComentario: { flex: 1, backgroundColor: '#121620', borderWidth: 1, borderColor: '#1E2430', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, color: '#F8FAFC', fontSize: 14, marginRight: 8 },
  btnEnviarComentario: { backgroundColor: '#8B5CF6', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#F8FAFC', fontSize: 18 },

  footerAbsolute: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#090C10', padding: 20, borderTopWidth: 1, borderTopColor: '#1E2430' },
  btnInscrever: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnInscrever: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
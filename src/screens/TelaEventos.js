import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaEventos({ eventos, aoSelecionarEvento }) {
  const [busca, setBusca] = useState('');
  const [filtroTech, setFiltroTech] = useState('Todos');
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const eventosFiltrados = eventos.filter((item) => {
    const atendeBusca = 
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.cidade.toLowerCase().includes(busca.toLowerCase());
    const atendeTech = filtroTech === 'Todos' || item.tech === filtroTech;
    return atendeBusca && atendeTech;
  });

  const eventoDestaque = eventos[0];

  return (
    <SafeAreaView style={styles.containerFeed}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        <View style={styles.headerFeed}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={require('../../assets/logo.png')} style={styles.logoHeaderFeed} resizeMode="contain" />
            <View>
              <Text style={styles.saudacaoUser}>Olá, Dev! 👋</Text>
              <Text style={styles.headerTitleFeed}>Gather<Text style={styles.headerPurple}>Tech</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.boxBusca}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.inputBuscaFeed}
            placeholder="Buscar eventos, locais, temas..."
            placeholderTextColor="#8F9CAE"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollCategorias}>
          {['Todos', 'React', 'Python', 'IA', 'Cloud', 'Cyber'].map((tech) => (
            <TouchableOpacity 
              key={tech} 
              style={[styles.chipTech, filtroTech === tech && styles.chipTechAtivo]}
              onPress={() => setFiltroTech(tech)}
            >
              <Text style={[styles.textoChipTech, filtroTech === tech && styles.textoChipTechAtivo]}>
                {tech}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!busca && filtroTech === 'Todos' && eventoDestaque && (
          <View style={styles.secaoDestaque}>
            <Text style={styles.tituloSecaoFeed}>🔥 Em Destaque em Salvador</Text>
            <TouchableOpacity 
              style={styles.cardDestaque} 
              activeOpacity={0.9}
              onPress={() => aoSelecionarEvento(eventoDestaque)}
            >
              <Image source={{ uri: eventoDestaque.imagem || 'https://picsum.photos/400/200' }} style={styles.imgDestaque} />
              <View style={styles.overlayDestaque}>
                <View style={styles.badgeFormatoDestaque}>
                  <Text style={styles.textoBadgeDestaque}>{eventoDestaque.formato}</Text>
                </View>
                <Text style={styles.tituloDestaque}>{eventoDestaque.titulo}</Text>
                <Text style={styles.subDestaque}>📅 {eventoDestaque.data || 'Em breve'} • 📍 {eventoDestaque.cidade}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.secaoFeedList}>
          <Text style={styles.tituloSecaoFeed}>
            {filtroTech === 'Todos' ? 'Próximos Eventos' : `Eventos de ${filtroTech}`}
          </Text>

          {eventosFiltrados.length === 0 ? (
            <Text style={styles.textoVazioFeed}>Nenhum evento encontrado para esta busca.</Text>
          ) : (
            eventosFiltrados.map((item) => {
              const isFav = favoritos.includes(item.id);
              return (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.cardFeedItem} 
                  activeOpacity={0.85}
                  onPress={() => aoSelecionarEvento(item)}
                >
                  <Image source={{ uri: item.imagem || 'https://picsum.photos/400/200' }} style={styles.imgCardFeed} />
                  
                  <View style={styles.bodyCardFeed}>
                    <View style={styles.rowCardTop}>
                      <View style={styles.badgeTagFormato}>
                        <Text style={styles.textoBadgeTag}>{item.formato}</Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                        <Text style={{ fontSize: 18 }}>{isFav ? '❤️' : '🤍'}</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.tituloCardFeed}>{item.titulo}</Text>
                    <Text style={styles.dataCardFeed}>📅 {item.data || 'Data a definir'}</Text>
                    <Text style={styles.localCardFeed}>📍 {item.cidade}</Text>

                    <View style={styles.footerCardFeed}>
                      <Text style={styles.precoCardFeed}>{item.preco || 'Gratuito'}</Text>
                      <Text style={styles.participantesCardFeed}>👥 {item.participantes || 50} inscritos</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerFeed: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 20 },
  headerFeed: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 16 },
  logoHeaderFeed: { width: 36, height: 36 },
  saudacaoUser: { color: '#8F9CAE', fontSize: 12 },
  headerTitleFeed: { fontSize: 20, fontWeight: 'bold', color: '#0066FF' },
  headerPurple: { color: '#7C3AED' },
  boxBusca: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121824', borderWidth: 1, borderColor: '#1E293B', borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
  inputBuscaFeed: { flex: 1, height: 46, color: '#FFFFFF', fontSize: 14 },
  scrollCategorias: { marginBottom: 20 },
  chipTech: { backgroundColor: '#121824', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', marginRight: 8 },
  chipTechAtivo: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  textoChipTech: { color: '#8F9CAE', fontSize: 13, fontWeight: '600' },
  textoChipTechAtivo: { color: '#FFFFFF' },
  secaoDestaque: { marginBottom: 24 },
  tituloSecaoFeed: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  cardDestaque: { height: 190, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  imgDestaque: { width: '100%', height: '100%' },
  overlayDestaque: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(11, 14, 20, 0.85)', padding: 14 },
  badgeFormatoDestaque: { backgroundColor: '#0066FF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 6 },
  textoBadgeDestaque: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  tituloDestaque: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  subDestaque: { color: '#CBD5E1', fontSize: 12, marginTop: 4 },
  secaoFeedList: { gap: 16 },
  cardFeedItem: { backgroundColor: '#121824', borderRadius: 14, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden', marginBottom: 12 },
  imgCardFeed: { width: '100%', height: 130 },
  bodyCardFeed: { padding: 14 },
  rowCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeTagFormato: { backgroundColor: '#0066FF22', borderWidth: 1, borderColor: '#0066FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  textoBadgeTag: { color: '#0066FF', fontSize: 11, fontWeight: 'bold' },
  tituloCardFeed: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  dataCardFeed: { color: '#7C3AED', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  localCardFeed: { color: '#8F9CAE', fontSize: 13, marginBottom: 10 },
  footerCardFeed: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 10 },
  precoCardFeed: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
  participantesCardFeed: { color: '#8F9CAE', fontSize: 12 },
  textoVazioFeed: { color: '#8F9CAE', textAlign: 'center', marginTop: 20 },
});
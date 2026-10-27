import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

const CIDADES_DISPONIVEIS = [
  'Brasil (Todos)',
  'Salvador',
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Online'
];

export default function TelaEventos({ 
  tipoUsuario, 
  eventos = [], 
  irParaCriarEvento, 
  aoSelecionarEvento, 
  irParaPerfil, 
  irParaFavoritos, 
  irParaAgenda 
}) {
  const [busca, setBusca] = useState('');
  const [localizacao, setLocalizacao] = useState('Brasil (Todos)');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filtroModalidade, setFiltroModalidade] = useState(null); // 'Presencial' | 'Online' | null
  const [filtroPreco, setFiltroPreco] = useState(null); // 'Gratuito' | 'Pago' | null
  const [favoritos, setFavoritos] = useState([]);

  // Alternar estado de favorito
  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(item => item !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  // Filtragem dinâmica dos eventos reais vindos do banco de dados
  const eventosFiltrados = (eventos || []).filter((evento) => {
    const atendeBusca = (evento.nome_evento || evento.titulo || '').toLowerCase().includes(busca.toLowerCase()) ||
                       (evento.descricao_evento || evento.descricao || '').toLowerCase().includes(busca.toLowerCase());
    
    // Filtro por Localização
    const atendeLocalizacao = localizacao === 'Brasil (Todos)'
      ? true
      : localizacao === 'Online'
        ? (evento.modalidade || evento.formato || '').toLowerCase() === 'online'
        : (evento.cidade || '').toLowerCase().includes(localizacao.toLowerCase());

    // Filtro por Modalidade
    const atendeModalidade = filtroModalidade 
      ? (evento.modalidade || evento.formato || '').toLowerCase() === filtroModalidade.toLowerCase() 
      : true;

    // Filtro por Preço
    const atendePreco = filtroPreco 
      ? (filtroPreco === 'Gratuito' ? (evento.tipo_ingresso || evento.preco || '').toLowerCase().includes('gratuit') : !(evento.tipo_ingresso || evento.preco || '').toLowerCase().includes('gratuit')) 
      : true;

    return atendeBusca && atendeLocalizacao && atendeModalidade && atendePreco;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={irParaPerfil}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>

          <Text style={styles.logoGT}>GT</Text>

          <TouchableOpacity style={styles.menuBtn}>
            <Feather name="menu" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SELETOR DE LOCALIZAÇÃO */}
        <TouchableOpacity 
          style={styles.localizacaoArea} 
          onPress={() => setModalVisivel(true)}
        >
          <Ionicons name="location-outline" size={18} color="#8B5CF6" />
          <Text style={styles.localizacaoTexto}>{localizacao}</Text>
          <Feather name="chevron-down" size={16} color="#FFFFFF" />
        </TouchableOpacity>

        {/* BARRA DE PESQUISA */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#8F9CAE" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar eventos..."
            placeholderTextColor="#8F9CAE"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Feather name="x" size={18} color="#8F9CAE" />
            </TouchableOpacity>
          )}
        </View>

        {/* FILTROS RÁPIDOS */}
        <Text style={styles.secaoTitulo}>Filtros rápidos</Text>
        <View style={styles.filtrosContainer}>
          <TouchableOpacity 
            style={[styles.filtroItem, filtroModalidade === 'Presencial' && styles.filtroAtivo]}
            onPress={() => setFiltroModalidade(filtroModalidade === 'Presencial' ? null : 'Presencial')}
          >
            <View style={[styles.iconCircle, filtroModalidade === 'Presencial' && styles.iconCircleAtivo]}>
              <Feather name="shield" size={20} color={filtroModalidade === 'Presencial' ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={styles.filtroLabel}>Modalidade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filtroItem, filtroPreco === 'Gratuito' && styles.filtroAtivo]}
            onPress={() => setFiltroPreco(filtroPreco === 'Gratuito' ? null : 'Gratuito')}
          >
            <View style={[styles.iconCircle, filtroPreco === 'Gratuito' && styles.iconCircleAtivo]}>
              <Feather name="layers" size={20} color={filtroPreco === 'Gratuito' ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={styles.filtroLabel}>Gratuito</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.filtroItem}
            onPress={() => {
              setFiltroModalidade(null);
              setFiltroPreco(null);
              setLocalizacao('Brasil (Todos)');
              setBusca('');
            }}
          >
            <View style={styles.iconCircle}>
              <Feather name="refresh-cw" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.filtroLabel}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÃO DE EVENTOS */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Eventos em destaque</Text>
        </View>

        {/* FEED VAZIO OU COM EVENTOS REAIS */}
        {eventosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={48} color="#334155" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitulo}>Nenhum evento cadastrado</Text>
            <Text style={styles.emptyText}>
              Assim que os organizadores publicarem novos eventos, eles aparecerão aqui.
            </Text>
          </View>
        ) : (
          eventosFiltrados.map((item) => {
            const idEvento = item.id_evento || item.id;
            const isFav = favoritos.includes(idEvento);
            
            return (
              <TouchableOpacity 
                key={idEvento} 
                style={styles.cardEvento}
                onPress={() => aoSelecionarEvento(item)}
              >
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={{ uri: item.imagem || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600' }} 
                    style={styles.cardImage} 
                  />
                  <View style={styles.badgeModalidade}>
                    <Text style={styles.badgeText}>{item.modalidade || item.formato || 'Presencial'}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitulo} numberOfLines={2}>{item.nome_evento || item.titulo}</Text>
                    <TouchableOpacity onPress={() => toggleFavorito(idEvento)}>
                      <Ionicons 
                        name={isFav ? "heart" : "heart-outline"} 
                        size={22} 
                        color={isFav ? "#8B5CF6" : "#FFFFFF"} 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Ionicons name="location-outline" size={14} color="#8F9CAE" />
                    <Text style={styles.cardInfoText}>{item.cidade || 'Salvador'}</Text>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Feather name="calendar" size={14} color="#8F9CAE" />
                    <Text style={styles.cardInfoText}>{item.data_inicio || item.data || 'Em breve'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

      </ScrollView>

      {/* MODAL DE SELEÇÃO DE LOCALIZAÇÃO */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisivel(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Selecione a Localização</Text>
            {CIDADES_DISPONIVEIS.map((cidade) => (
              <TouchableOpacity
                key={cidade}
                style={[
                  styles.opcaoCidade,
                  localizacao === cidade && styles.opcaoCidadeSelecionada
                ]}
                onPress={() => {
                  setLocalizacao(cidade);
                  setModalVisivel(false);
                }}
              >
                <Text style={[
                  styles.textoCidade,
                  localizacao === cidade && styles.textoCidadeSelecionado
                ]}>
                  {cidade}
                </Text>
                {localizacao === cidade && (
                  <Ionicons name="checkmark" size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* BOTÃO FLUTUANTE PARA CRIAR EVENTO (Exibido para perfil Admin / Organizador) */}
      {tipoUsuario === 'admin' && (
        <TouchableOpacity style={styles.fabBtn} onPress={irParaCriarEvento}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={22} color="#8B5CF6" />
          <Text style={[styles.tabLabel, styles.tabActive]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={irParaFavoritos}>
          <Ionicons name="heart-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={irParaAgenda}>
          <Ionicons name="calendar-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={irParaPerfil}>
          <Ionicons name="person-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  logoGT: { fontSize: 24, fontWeight: '900', color: '#0066FF', letterSpacing: 1 },
  menuBtn: { padding: 4 },
  localizacaoArea: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  localizacaoTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#121824', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    marginBottom: 24 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  secaoTitulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  filtrosContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  filtroItem: { alignItems: 'center', flex: 1 },
  iconCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#121824', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    marginBottom: 8 
  },
  iconCircleAtivo: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  filtroAtivo: { opacity: 0.9 },
  filtroLabel: { color: '#8F9CAE', fontSize: 12, fontWeight: '500' },
  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardEvento: { 
    flexDirection: 'row', 
    backgroundColor: '#121824', 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#1E293B' 
  },
  cardImageContainer: { position: 'relative', width: 110, height: 110, borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%' },
  badgeModalidade: { 
    position: 'absolute', 
    bottom: 6, 
    left: 6, 
    backgroundColor: '#8B5CF6', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6 
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  cardContent: { flex: 1, marginLeft: 14, justifyContent: 'space-around' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardInfoText: { color: '#8F9CAE', fontSize: 13 },
  emptyContainer: { 
    paddingVertical: 40, 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#121824', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    marginTop: 10 
  },
  emptyTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyText: { color: '#8F9CAE', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  fabBtn: { 
    position: 'absolute', 
    bottom: 80, 
    right: 20, 
    backgroundColor: '#8B5CF6', 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 65, 
    backgroundColor: '#090C10', 
    borderTopWidth: 1, 
    borderTopColor: '#1E293B', 
    flexDirection: 'row', 
    justifycontent: 'space-around', 
    alignItems: 'center' 
  },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#8F9CAE', fontSize: 11, marginTop: 4 },
  tabActive: { color: '#8B5CF6', fontWeight: 'bold' },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 24 
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: '#121824', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#1E293B' 
  },
  modalTitulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  opcaoCidade: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1E293B' 
  },
  opcaoCidadeSelecionada: { backgroundColor: '#1A2333', borderRadius: 8, paddingHorizontal: 10 },
  textoCidade: { color: '#8F9CAE', fontSize: 15 },
  textoCidadeSelecionado: { color: '#FFFFFF', fontWeight: 'bold' }
});
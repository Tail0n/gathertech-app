import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, TextInput, 
  ScrollView, Image, Modal, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; 

export default function TelaEventos({ 
  eventos = [], 
  aoSelecionarEvento, 
  irParaFavoritos, 
  irParaIngressos, 
  irParaPerfil 
}) {
  const [busca, setBusca] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  
  // Estados para controlar o Modal de Filtros
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filtroAberto, setFiltroAberto] = useState(''); // 'Modalidade', 'Stack', 'Preço', 'Localização'
  
  // Estado para armazenar as opções exatas escolhidas pelo utilizador
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    Modalidade: null,
    Stack: null,
    Preço: null,
    Localização: null
  });

  // Opções disponíveis baseadas no MER do banco de dados
  const opcoesFiltro = {
    Modalidade: ['Presencial', 'Online', 'Híbrido'],
    Stack: ['Python', 'Inteligência Artificial', 'React', 'DevOps'],
    Preço: ['Gratuito', 'Pago'],
    Localização: ['São Paulo, SP', 'Salvador, BA', 'Remoto']
  };

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) setFavoritos(favoritos.filter(favId => favId !== id));
    else setFavoritos([...favoritos, id]);
  };

  const abrirMenuFiltro = (tipoFiltro) => {
    setFiltroAberto(tipoFiltro);
    setModalVisivel(true);
  };

  const selecionarOpcao = (opcao) => {
    // Se clicar na mesma opção que já estava ativa, ele limpa o filtro. Se não, aplica a nova.
    const estaAtiva = filtrosAtivos[filtroAberto] === opcao;
    setFiltrosAtivos({
      ...filtrosAtivos,
      [filtroAberto]: estaAtiva ? null : opcao
    });
    setModalVisivel(false);
  };

  const eventosFiltrados = eventos.filter((item) => {
    const titulo = item?.titulo ? item.titulo.toLowerCase() : '';
    const termo = busca.toLowerCase();
    
    // Filtro 1: Barra de Pesquisa
    if (!titulo.includes(termo)) return false;

    // Filtro 2: Modalidade
    if (filtrosAtivos.Modalidade && item.formato !== filtrosAtivos.Modalidade) return false;
    
    // Filtro 3: Stack / Tecnologia
    if (filtrosAtivos.Stack && !item.tech.includes(filtrosAtivos.Stack)) return false;
    
    // Filtro 4: Preço (tipo_ingresso)
    if (filtrosAtivos.Preço) {
      const ehGratis = item.preco.toLowerCase() === 'gratuito';
      if (filtrosAtivos.Preço === 'Gratuito' && !ehGratis) return false;
      if (filtrosAtivos.Preço === 'Pago' && ehGratis) return false;
    }

    // Filtro 5: Localização
    if (filtrosAtivos.Localização && !item.cidade.includes(filtrosAtivos.Localização)) return false;

    return true; 
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} style={{ flex: 1 }}>
        
        {/* CABEÇALHO SUPERIOR */}
        <View style={styles.headerTop}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=32' }} style={styles.avatarUser} />
          <View style={styles.logoContainer}>
            <Text style={styles.logoG}>G<Text style={styles.logoT}>T</Text></Text>
          </View>
          <TouchableOpacity style={styles.btnMenu}>
            <Feather name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SELETOR DE LOCALIZAÇÃO */}
        <TouchableOpacity style={styles.selectorLocal}>
          <Feather name="map-pin" size={14} color="#8B5CF6" style={styles.iconPinLocal} />
          <Text style={styles.textoLocal}>Brasil</Text>
          <Feather name="chevron-down" size={16} color="#8F9CAE" />
        </TouchableOpacity>

        {/* CAMPO DE PESQUISA */}
        <View style={styles.rowBusca}>
          <View style={styles.inputBuscaBox}>
            <Feather name="search" size={18} color="#8F9CAE" style={styles.iconBusca} />
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar eventos..."
              placeholderTextColor="#8F9CAE"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity style={styles.btnAjusteFiltro}>
            <Feather name="sliders" size={18} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* FILTROS RÁPIDOS */}
        <Text style={styles.tituloSecao}>Filtros rápidos</Text>
        <View style={styles.rowFiltrosRapidos}>
          
          <TouchableOpacity style={styles.itemFiltroRapido} onPress={() => abrirMenuFiltro('Modalidade')}>
            <View style={[styles.circuloIconFiltro, filtrosAtivos.Modalidade && styles.circuloFiltroAtivo]}>
              <Feather name="shield" size={22} color={filtrosAtivos.Modalidade ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={[styles.labelFiltro, filtrosAtivos.Modalidade && styles.labelFiltroAtiva]} numberOfLines={1}>
              {filtrosAtivos.Modalidade || 'Modalidade'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido} onPress={() => abrirMenuFiltro('Stack')}>
            <View style={[styles.circuloIconFiltro, filtrosAtivos.Stack && styles.circuloFiltroAtivo]}>
              <Feather name="layers" size={22} color={filtrosAtivos.Stack ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={[styles.labelFiltro, filtrosAtivos.Stack && styles.labelFiltroAtiva]} numberOfLines={1}>
              {filtrosAtivos.Stack || 'Stack'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido} onPress={() => abrirMenuFiltro('Preço')}>
            <View style={[styles.circuloIconFiltro, filtrosAtivos.Preço && styles.circuloFiltroAtivo]}>
              <Feather name="lock" size={22} color={filtrosAtivos.Preço ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={[styles.labelFiltro, filtrosAtivos.Preço && styles.labelFiltroAtiva]} numberOfLines={1}>
              {filtrosAtivos.Preço || 'Preço'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido} onPress={() => abrirMenuFiltro('Localização')}>
            <View style={[styles.circuloIconFiltro, filtrosAtivos.Localização && styles.circuloFiltroAtivo]}>
              <Feather name="map-pin" size={22} color={filtrosAtivos.Localização ? '#FFFFFF' : '#8B5CF6'} />
            </View>
            <Text style={[styles.labelFiltro, filtrosAtivos.Localização && styles.labelFiltroAtiva]} numberOfLines={1}>
              {filtrosAtivos.Localização || 'Local'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* LISTA DE CARDS DE EVENTO */}
        <View style={styles.headerSecao}>
          <Text style={styles.tituloSecao}>Eventos em destaque</Text>
          <TouchableOpacity><Text style={styles.linkVerTodos}>Ver todos</Text></TouchableOpacity>
        </View>

        <View style={styles.listaCards}>
          {eventosFiltrados.length === 0 ? (
             <Text style={styles.textoVazio}>Nenhum evento encontrado para as opções selecionadas.</Text>
          ) : (
            eventosFiltrados.map((item) => {
              const isFav = favoritos.includes(item.id);
              const isPresencial = item.formato === 'Presencial';

              return (
                <TouchableOpacity key={item.id} style={styles.cardEvento} activeOpacity={0.85} onPress={() => aoSelecionarEvento && aoSelecionarEvento(item)}>
                  <View style={styles.boxImagemCard}>
                    <Image source={{ uri: item.imagem || 'https://picsum.photos/300/200' }} style={styles.imgCard} />
                    <View style={[styles.badgeModalidade, isPresencial ? styles.bgPresencial : styles.bgOnline]}>
                      <Text style={styles.textoBadgeModalidade}>{item.formato}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.topCardInfo}>
                      <Text style={styles.tituloEventoCard} numberOfLines={2}>{item.titulo}</Text>
                      <TouchableOpacity onPress={() => toggleFavorito(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={isFav ? "#8B5CF6" : "#8F9CAE"} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.rowSubInfo}>
                      <Feather name="map-pin" size={12} color="#8F9CAE" />
                      <Text style={styles.subInfoCard}>{item.cidade}</Text>
                    </View>
                    <View style={styles.rowSubInfo}>
                      <Feather name="calendar" size={12} color="#8F9CAE" />
                      <Text style={styles.subInfoCard}>{item.data || 'Em breve'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* MODAL BOTTOM SHEET DE SELEÇÃO */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalClickableBg} onPress={() => setModalVisivel(false)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>Selecione {filtroAberto}</Text>
            
            {filtroAberto ? opcoesFiltro[filtroAberto].map((opcao, index) => {
              const selecionado = filtrosAtivos[filtroAberto] === opcao;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.modalOptionButton, selecionado && styles.modalOptionButtonAtivo]}
                  onPress={() => selecionarOpcao(opcao)}
                >
                  <Text style={[styles.modalOptionText, selecionado && styles.modalOptionTextAtivo]}>{opcao}</Text>
                  {selecionado && <Feather name="check" size={20} color="#FFFFFF" />}
                </TouchableOpacity>
              );
            }) : null}
            
          </View>
        </View>
      </Modal>

      {/* MENU INFERIOR FIXO */}
      <View style={styles.menuInferior}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="home" size={24} color="#8B5CF6" />
          <Text style={[styles.menuTexto, { color: '#8B5CF6' }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={irParaFavoritos}>
          <Ionicons name="heart-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={irParaIngressos}>
          <Ionicons name="ticket-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Ingressos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={irParaPerfil}>
          <Feather name="user" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16, paddingHorizontal: 20 },
  selectorLocal: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  rowBusca: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, paddingHorizontal: 20 },
  tituloSecao: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 20 },
  rowFiltrosRapidos: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, paddingHorizontal: 20 },
  headerSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 20 },
  listaCards: { gap: 16, paddingHorizontal: 20 },
  
  avatarUser: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#2D3748' },
  logoContainer: { alignItems: 'center' },
  logoG: { fontSize: 26, fontWeight: '900', color: '#0066FF' },
  logoT: { color: '#8B5CF6' },
  btnMenu: { padding: 6 },
  iconPinLocal: { marginRight: 6 },
  textoLocal: { color: '#E2E8F0', fontSize: 14, fontWeight: 'bold', marginRight: 6 },
  inputBuscaBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#121620', borderRadius: 14, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: '#1E2430' },
  iconBusca: { marginRight: 10 },
  inputBusca: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  btnAjusteFiltro: { width: 50, height: 50, backgroundColor: '#121620', borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1E2430' },
  
  itemFiltroRapido: { alignItems: 'center', width: '22%' },
  circuloIconFiltro: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#121620', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#261C3B' },
  circuloFiltroAtivo: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  labelFiltro: { color: '#E2E8F0', fontSize: 12, fontWeight: '500', textAlign: 'center' },
  labelFiltroAtiva: { color: '#8B5CF6', fontWeight: 'bold' },
  textoVazio: { color: '#8F9CAE', textAlign: 'center', marginTop: 20, fontSize: 14 },

  linkVerTodos: { color: '#8B5CF6', fontSize: 13, fontWeight: 'bold' },
  cardEvento: { flexDirection: 'row', backgroundColor: '#121620', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: '#1E2430' },
  boxImagemCard: { position: 'relative', width: 110, height: 100, borderRadius: 12, overflow: 'hidden' },
  imgCard: { width: '100%', height: '100%' },
  badgeModalidade: { position: 'absolute', bottom: 6, left: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  bgPresencial: { backgroundColor: '#7C3AED' },
  bgOnline: { backgroundColor: '#2563EB' },
  textoBadgeModalidade: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  infoCard: { flex: 1, marginLeft: 14, justifyContent: 'space-between', paddingVertical: 2 },
  topCardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  tituloEventoCard: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8, lineHeight: 20 },
  rowSubInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  subInfoCard: { color: '#94A3B8', fontSize: 13 },

  // ESTILOS DO MODAL BOTTOM SHEET
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalClickableBg: { flex: 1, width: '100%' },
  modalContent: { backgroundColor: '#121620', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12, borderWidth: 1, borderColor: '#1E2430' },
  modalDragIndicator: { width: 40, height: 4, backgroundColor: '#2D3748', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalOptionButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E2430' },
  modalOptionButtonAtivo: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, borderRadius: 12, borderBottomWidth: 0, marginTop: 4 },
  modalOptionText: { color: '#E2E8F0', fontSize: 16 },
  modalOptionTextAtivo: { color: '#FFFFFF', fontWeight: 'bold' },

  menuInferior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#090C10', paddingVertical: 12, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: '#1E2430' },
  menuItem: { alignItems: 'center', justifyContent: 'center' },
  menuTexto: { fontSize: 11, marginTop: 4, color: '#8F9CAE', fontWeight: '500' }
});
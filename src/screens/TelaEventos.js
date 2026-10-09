import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, TextInput, 
  ScrollView, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaEventos({ eventos, aoSelecionarEvento }) {
  const [busca, setBusca] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const eventosFiltrados = eventos.filter((item) => {
    return (
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.cidade.toLowerCase().includes(busca.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* --- HEADER SUPERIOR --- */}
        <View style={styles.headerTop}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=32' }} 
            style={styles.avatarUser} 
          />
          
          <View style={styles.logoContainer}>
            <Text style={styles.logoG}>G<Text style={styles.logoT}>T</Text></Text>
          </View>

          <TouchableOpacity style={styles.btnMenu}>
            <Text style={styles.iconMenu}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* --- SELETOR DE LOCALIZAÇÃO --- */}
        <TouchableOpacity style={styles.selectorLocal}>
          <Text style={styles.iconPinLocal}>📍</Text>
          <Text style={styles.textoLocal}>Salvador, BA</Text>
          <Text style={styles.setaLocal}>˅</Text>
        </TouchableOpacity>

        {/* --- CAMPO DE BUSCA & FILTRO --- */}
        <View style={styles.rowBusca}>
          <View style={styles.inputBuscaBox}>
            <Text style={styles.iconBusca}>🔍</Text>
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar eventos..."
              placeholderTextColor="#8F9CAE"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity style={styles.btnAjusteFiltro}>
            <Text style={styles.iconAjuste}>🎛️</Text>
          </TouchableOpacity>
        </View>

        {/* --- FILTROS RÁPIDOS --- */}
        <Text style={styles.tituloSecao}>Filtros rápidos</Text>
        <View style={styles.rowFiltrosRapidos}>
          
          <TouchableOpacity style={styles.itemFiltroRapido}>
            <View style={styles.circuloIconFiltro}>
              <Text style={styles.emojiFiltro}>🛡️</Text>
            </View>
            <Text style={styles.labelFiltro}>Modalidade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido}>
            <View style={styles.circuloIconFiltro}>
              <Text style={styles.emojiFiltro}>📚</Text>
            </View>
            <Text style={styles.labelFiltro}>Stack</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido}>
            <View style={styles.circuloIconFiltro}>
              <Text style={styles.emojiFiltro}>🔒</Text>
            </View>
            <Text style={styles.labelFiltro}>Preço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemFiltroRapido}>
            <View style={styles.circuloIconFiltro}>
              <Text style={styles.emojiFiltro}>📍</Text>
            </View>
            <Text style={styles.labelFiltro}>Localização</Text>
          </TouchableOpacity>

        </View>

        {/* --- EVENTOS EM DESTAQUE --- */}
        <View style={styles.headerSecao}>
          <Text style={styles.tituloSecao}>Eventos em destaque</Text>
          <TouchableOpacity>
            <Text style={styles.linkVerTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* --- LISTA DE CARDS DE EVENTO (LAYOUT DA IMAGEM) --- */}
        <View style={styles.listaCards}>
          {eventosFiltrados.map((item) => {
            const isFav = favoritos.includes(item.id);
            const isPresencial = item.formato === 'Presencial';

            return (
              <TouchableOpacity 
                key={item.id}
                style={styles.cardEvento} 
                activeOpacity={0.85}
                onPress={() => aoSelecionarEvento(item)}
              >
                {/* Imagem + Badge */}
                <View style={styles.boxImagemCard}>
                  <Image source={{ uri: item.imagem || 'https://picsum.photos/300/200' }} style={styles.imgCard} />
                  <View style={[styles.badgeModalidade, isPresencial ? styles.bgPresencial : styles.bgOnline]}>
                    <Text style={styles.textoBadgeModalidade}>{item.formato}</Text>
                  </View>
                </View>

                {/* Conteúdo do Card */}
                <View style={styles.infoCard}>
                  <View style={styles.topCardInfo}>
                    <Text style={styles.tituloEventoCard} numberOfLines={2}>{item.titulo}</Text>
                    <TouchableOpacity onPress={() => toggleFavorito(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={{ fontSize: 18 }}>{isFav ? '💜' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subInfoCard}>📍 {item.cidade}</Text>
                  <Text style={styles.subInfoCard}>📅 {item.data || '24 Mai • 09:00'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#090C10', 
    paddingHorizontal: 20 
  },
  
  // HEADER SUPERIOR
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12,
    marginBottom: 8 
  },
  avatarUser: { 
    width: 38, 
    height: 38, 
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#2D3748'
  },
  logoContainer: { 
    alignItems: 'center' 
  },
  logoG: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#0066FF' 
  },
  logoT: { 
    color: '#8B5CF6' 
  },
  btnMenu: { 
    padding: 6 
  },
  iconMenu: { 
    color: '#FFFFFF', 
    fontSize: 22 
  },

  // LOCALIZAÇÃO
  selectorLocal: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  iconPinLocal: { 
    fontSize: 14, 
    color: '#8B5CF6', 
    marginRight: 6 
  },
  textoLocal: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginRight: 6 
  },
  setaLocal: { 
    color: '#8F9CAE', 
    fontSize: 12 
  },

  // CAMPO DE BUSCA & FILTRO
  rowBusca: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 20 
  },
  inputBuscaBox: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#121620', 
    borderRadius: 14, 
    paddingHorizontal: 14, 
    height: 48,
    borderWidth: 1,
    borderColor: '#1E2430'
  },
  iconBusca: { 
    fontSize: 16, 
    marginRight: 10 
  },
  inputBusca: { 
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: 14 
  },
  btnAjusteFiltro: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#121620', 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2430'
  },
  iconAjuste: { 
    fontSize: 18 
  },

  // FILTROS RÁPIDOS
  tituloSecao: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 14 
  },
  rowFiltrosRapidos: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 24 
  },
  itemFiltroRapido: { 
    alignItems: 'center', 
    width: '22%' 
  },
  circuloIconFiltro: { 
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    backgroundColor: '#121620', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#261C3B'
  },
  emojiFiltro: { 
    fontSize: 20 
  },
  labelFiltro: { 
    color: '#94A3B8', 
    fontSize: 11, 
    fontWeight: '500',
    textAlign: 'center' 
  },

  // EVENTOS EM DESTAQUE
  headerSecao: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  linkVerTodos: { 
    color: '#8B5CF6', 
    fontSize: 13, 
    fontWeight: 'bold' 
  },

  // CARDS DE EVENTO
  listaCards: { 
    gap: 14 
  },
  cardEvento: { 
    flexDirection: 'row', 
    backgroundColor: '#121620', 
    borderRadius: 16, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#1E2430',
    marginBottom: 10
  },
  boxImagemCard: { 
    position: 'relative', 
    width: 110, 
    height: 100, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  imgCard: { 
    width: '100%', 
    height: '100%' 
  },
  badgeModalidade: { 
    position: 'absolute', 
    bottom: 6, 
    left: 6, 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6 
  },
  bgPresencial: { 
    backgroundColor: '#7C3AED' 
  },
  bgOnline: { 
    backgroundColor: '#2563EB' 
  },
  textoBadgeModalidade: { 
    color: '#FFFFFF', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },

  infoCard: { 
    flex: 1, 
    marginLeft: 12, 
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  topCardInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  tituloEventoCard: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    flex: 1, 
    marginRight: 6 
  },
  subInfoCard: { 
    color: '#94A3B8', 
    fontSize: 12, 
    marginTop: 2 
  },
});
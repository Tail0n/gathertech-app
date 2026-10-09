import React, { useState, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Image, FlatList, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Pega a largura exata da tela do celular para cada "slide"
const { width } = Dimensions.get('window');

// --- DADOS DOS SLIDES DO CARROSSEL ---
const SLIDES = [
  {
    id: '1',
    linha1: 'Bem-vindo ao',
    destaqueAzul: 'Gather',
    destaqueRoxo: 'Tech',
    subtitulo: 'Encontre eventos de tecnologia de forma centralizada, prática e inteligente.',
  },
  {
    id: '2',
    linha1: 'Filtre o seu',
    destaqueAzul: 'Evento ',
    destaqueRoxo: 'Ideal',
    subtitulo: 'Pesquise por tecnologia, modalidade ou preço e encontre as melhores oportunidades.',
  },
  {
    id: '3',
    linha1: 'A sua nova',
    destaqueAzul: 'Comunidade ',
    destaqueRoxo: 'Tech',
    subtitulo: 'Avalie eventos, salve os seus favoritos e garanta sua presença nos meetups proximos.',
  }
];

export default function TelaOnboarding({ aoContinuar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  // Função que detecta qual slide está visível na tela para mudar a bolinha
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Função do botão "Continuar"
  const handleProximo = () => {
    if (currentIndex < SLIDES.length - 1) {
      // Se não for o último slide, passa para o próximo
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Se for o último slide, vai para a tela de Login
      aoContinuar();
    }
  };

  return (
    <SafeAreaView style={styles.containerGeral}>
      
      {/* --- ÁREA DO CARROSSEL DE SLIDES --- */}
      <View style={styles.areaCarrossel}>
        <FlatList 
          data={SLIDES}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled // Faz o efeito de "travar" no slide
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              
              {/* Logo Central (Usa a mesma logo para todos os slides) */}
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logoOnboarding} 
                resizeMode="contain"
              />
              
              {/* Textos formatados */}
              <Text style={styles.tituloSecundario}>{item.linha1}</Text>
              <Text style={styles.tituloPrincipal}>
                <Text style={styles.textoAzul}>{item.destaqueAzul}</Text>
                <Text style={styles.textoRoxo}>{item.destaqueRoxo}</Text>
              </Text>

              <Text style={styles.subtitulo}>{item.subtitulo}</Text>
            </View>
          )}
        />
      </View>

      {/* --- ÁREA INFERIOR (BOTÃO E BOLINHAS) --- */}
      <View style={styles.areaFooter}>
        
        <TouchableOpacity style={styles.btnContinuar} onPress={handleProximo}>
          <Text style={styles.textoBtnContinuar}>
            {currentIndex === SLIDES.length - 1 ? 'Começar' : 'Continuar'}
          </Text>
        </TouchableOpacity>

        {/* Bolinhas de navegação (Dots) */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index.toString()} 
              style={[
                styles.dot, 
                currentIndex === index ? styles.dotAtivo : styles.dotInativo
              ]} 
            />
          ))}
        </View>

      </View>

    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  containerGeral: { 
    flex: 1, 
    backgroundColor: '#090C10', 
  },
  areaCarrossel: {
    flex: 1,
  },
  slide: {
    width: width, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoOnboarding: { 
    width: 160, 
    height: 160, 
    marginBottom: 40 
  },
  tituloSecundario: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center', 
  },
  tituloPrincipal: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 16,
  },
  textoAzul: { 
    color: '#0066FF' 
  },
  textoRoxo: { 
    color: '#8B5CF6' 
  },
  subtitulo: { 
    fontSize: 14, 
    color: '#94A3B8', 
    textAlign: 'center', 
    lineHeight: 22, 
  },
  
  // FOOTER (BOTÃO E BOLINHAS)
  areaFooter: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  btnContinuar: { 
    backgroundColor: '#0052CC', 
    width: '100%',
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 24,
  },
  textoBtnContinuar: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  
  // CONFIGURAÇÃO EXATA DAS BOLINHAS
  dotsContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  dotAtivo: { 
    backgroundColor: '#8B5CF6', 
  },
  dotInativo: { 
    backgroundColor: '#334155', 
  },
});
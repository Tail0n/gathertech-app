import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Importação das Telas
import TelaCriarEvento from './src/screens/TelaCriarEvento';
import TelaFavoritos from './src/screens/TelaFavoritos';
import TelaOnboarding from './src/screens/TelaOnboarding';
import TelaLogin from './src/screens/TelaLogin';
import TelaRecuperarSenha from './src/screens/TelaRecuperarSenha';
import TelaCadastro from './src/screens/TelaCadastro';
import TelaEventos from './src/screens/TelaEventos';
import TelaDetalhesEvento from './src/screens/TelaDetalhesEvento';
import TelaPerfil from './src/screens/TelaPerfil';
import TelaAgenda from './src/screens/TelaAgenda';

// ⚠️ SUBSTiTUA '192.168.X.X' PELO SEU IPV4 OBTIDO NO IPCONFIG
const API_URL = 'http://10.0.0.100:3000/api/eventos';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('Onboarding');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  
  // Estado para armazenar os eventos que vêm do PostgreSQL
  const [listaEventos, setListaEventos] = useState([]);
  
  // Estado de carregamento inicial
  const [carregandoEventos, setCarregandoEventos] = useState(true);

  // Função para buscar eventos na API Node.js / PostgreSQL
  const buscarEventosDaAPI = async () => {
    try {
      setCarregandoEventos(true);
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();

      // Mapeia os campos da tabela PostgreSQL para a estrutura que a TelaEventos espera
      const eventosDaApi = dados.map((item) => ({
        id: item.id_evento.toString(),
        titulo: item.nome_evento,
        descricao: item.descricao_evento,
        imagem: item.imagem,
        preco: item.tipo_ingresso,
        formato: item.modalidade,
        data: item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : 'A definir',
        cidade: 'Salvador',
        tech: 'Python', // Ou campo dinâmico caso a API envie a stack
        nota: 5.0
      }));

      // Inicia a lista apenas com os eventos do banco
      setListaEventos(eventosDaApi);
      return eventosDaApi;
      
    } catch (erro) {
      console.error('Erro ao ligar à API:', erro);
      Alert.alert('Aviso', 'Não foi possível carregar eventos do servidor. Verifique o servidor Node.');
      return [];
    } finally {
      setCarregandoEventos(false);
    }
  };

  useEffect(() => {
    // Função principal que orquestra o carregamento na inicialização
    const carregarTudo = async () => {
      // 1. Primeiro busca do banco (PostgreSQL via API)
      const eventosBackend = await buscarEventosDaAPI();
      
      // 2. Depois carrega os eventos que o Admin criou e salvou localmente no telemóvel
      try {
        const eventosSalvosLocalmente = await AsyncStorage.getItem('@GatherTech:eventosCriados');
        if (eventosSalvosLocalmente) {
          const arrayEventosSalvos = JSON.parse(eventosSalvosLocalmente);
          
          // Junta os eventos da API com os criados localmente
          setListaEventos([...eventosBackend, ...arrayEventosSalvos]);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos criados localmente:', error);
      }
    };
    
    carregarTudo();
  }, []);

  // Telas de Navegação (mantidas exatamente como as suas originais)
  if (telaAtual === 'Onboarding') {
    return (
      <SafeAreaProvider>
        <TelaOnboarding aoContinuar={() => setTelaAtual('Login')} />
      </SafeAreaProvider>
    );
  }

if (telaAtual === 'Login') {
    return (
      <SafeAreaProvider>
        <TelaLogin 
          aoEntrar={(usuarioLogado) => {
            // Define o tipo de utilizador baseado na resposta do banco PostgreSQL
            if (usuarioLogado && usuarioLogado.tipo_usuario) {
              setTipoUsuario(usuarioLogado.tipo_usuario);
            } else {
              setTipoUsuario('aluno'); // Padrão seguro
            }
            setTelaAtual('Feed');
          }} 
          irParaCadastro={() => setTelaAtual('Cadastro')} 
          irParaRecuperarSenha={() => setTelaAtual('RecuperarSenha')} 
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'RecuperarSenha') {
    return (
      <SafeAreaProvider>
        <TelaRecuperarSenha aoVoltar={() => setTelaAtual('Login')} />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Cadastro') {
    return (
      <SafeAreaProvider>
        <TelaCadastro 
          aoVoltar={() => setTelaAtual('Login')} 
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Detalhes' && eventoSelecionado) {
    return (
      <SafeAreaProvider>
        <TelaDetalhesEvento 
          evento={eventoSelecionado} 
          aoVoltar={() => setTelaAtual('Feed')} 
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Perfil') {
    return (
      <SafeAreaProvider>
        <TelaPerfil 
          aoSair={() => setTelaAtual('Login')} 
          irParaInicio={() => setTelaAtual('Feed')} 
          irParaFavoritos={() => setTelaAtual('Favoritos')}
          irParaAgenda={() => setTelaAtual('Agenda')}
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Favoritos') {
    return (
      <SafeAreaProvider>
        <TelaFavoritos 
          eventos={listaEventos}
          irParaInicio={() => setTelaAtual('Feed')} 
          irParaAgenda={() => setTelaAtual('Agenda')}
          irParaPerfil={() => setTelaAtual('Perfil')} 
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Agenda') {
    return (
      <SafeAreaProvider>
        <TelaAgenda 
          irParaInicio={() => setTelaAtual('Feed')} 
          irParaFavoritos={() => setTelaAtual('Favoritos')}
          irParaPerfil={() => setTelaAtual('Perfil')} 
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'CriarEvento') {
    return (
      <SafeAreaProvider>
        <TelaCriarEvento 
          aoVoltar={() => setTelaAtual('Feed')} 
          aoSalvar={async (novoEvento) => { 
            try {
              setListaEventos([...listaEventos, novoEvento]);
              
              const eventosSalvos = await AsyncStorage.getItem('@GatherTech:eventosCriados');
              let arrayEventosSalvos = eventosSalvos ? JSON.parse(eventosSalvos) : [];
              arrayEventosSalvos.push(novoEvento);
              
              await AsyncStorage.setItem('@GatherTech:eventosCriados', JSON.stringify(arrayEventosSalvos));
              
              Alert.alert('Sucesso!', 'Evento criado com sucesso.');
              setTelaAtual('Feed');
            } catch (error) {
              console.error('Erro ao salvar novo evento', error);
              Alert.alert('Erro', 'Não foi possível salvar o evento.');
            }
          }}
        />
      </SafeAreaProvider>
    );
  }

  // Se o carregamento da API ainda não terminou, mostra o loading
  if (carregandoEventos && telaAtual === 'Feed') {
    return (
      <SafeAreaProvider style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>A carregar eventos do banco de dados...</Text>
      </SafeAreaProvider>
    );
  }

  // Tela principal do Feed
  return (
    <SafeAreaProvider>
      <TelaEventos 
        tipoUsuario={tipoUsuario}
        eventos={listaEventos} 
        irParaCriarEvento={() => setTelaAtual('CriarEvento')}
        aoSelecionarEvento={(evento) => {
          setEventoSelecionado(evento);
          setTelaAtual('Detalhes');
        }} 
        irParaPerfil={() => setTelaAtual('Perfil')}
        irParaFavoritos={() => setTelaAtual('Favoritos')}
        irParaAgenda={() => setTelaAtual('Agenda')}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    backgroundColor: '#090C10', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    color: '#8F9CAE', 
    marginTop: 12, 
    fontSize: 14 
  }
});
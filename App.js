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
import TelaValidarCodigo from './src/screens/TelaValidarCodigo';
import TelaRedefinirSenha from './src/screens/TelaRedefinirSenha';
import TelaCadastro from './src/screens/TelaCadastro';
import TelaEventos from './src/screens/TelaEventos';
import TelaDetalhesEvento from './src/screens/TelaDetalhesEvento';
import TelaPerfil from './src/screens/TelaPerfil';
import TelaAgenda from './src/screens/TelaAgenda';
import TelaAdmin from './src/screens/TelaAdmin';

// ⚠️ SUBSTiTUA '10.0.0.102' PELO SEU IPV4 SE NECESSÁRIO
const API_URL = 'http://10.0.0.102:3000/api/eventos';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('Onboarding');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  
  // Estados para o fluxo de Recuperação de Senha
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoValidado, setCodigoValidado] = useState('');

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

      if (Array.isArray(dados)) {
        const eventosDaApi = dados.map((item) => ({
          id: item.id_evento?.toString(),
          id_evento: item.id_evento,
          titulo: item.nome_evento,
          nome_evento: item.nome_evento,
          descricao: item.descricao_evento,
          imagem: item.imagem,
          preco: item.tipo_ingresso,
          formato: item.modalidade,
          modalidade: item.modalidade,
          data: item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : 'A definir',
          data_inicio: item.data_inicio,
          cidade: item.cidade || 'Salvador'
        }));

        setListaEventos(eventosDaApi);
        return eventosDaApi;
      }
      return [];
    } catch (erro) {
      console.error('Erro ao ligar à API:', erro);
      Alert.alert('Aviso', 'Não foi possível carregar eventos do servidor. Verifique o servidor Node.');
      return [];
    } finally {
      setCarregandoEventos(false);
    }
  };

  useEffect(() => {
    const carregarTudo = async () => {
      const eventosBackend = await buscarEventosDaAPI();
      
      try {
        const eventosSalvosLocalmente = await AsyncStorage.getItem('@GatherTech:eventosCriados');
        if (eventosSalvosLocalmente) {
          const arrayEventosSalvos = JSON.parse(eventosSalvosLocalmente);
          setListaEventos([...eventosBackend, ...arrayEventosSalvos]);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos criados localmente:', error);
      }
    };
    
    carregarTudo();
  }, []);

  // Telas de Navegação
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
          aoEntrar={(usuario) => {
            setUsuarioLogado(usuario);
            if (usuario && usuario.tipo_usuario) {
              setTipoUsuario(usuario.tipo_usuario);
            } else {
              setTipoUsuario('aluno');
            }
            setTelaAtual('Feed');
          }} 
          irParaCadastro={() => setTelaAtual('Cadastro')} 
          irParaRecuperarSenha={() => setTelaAtual('RecuperarSenha')} 
        />
      </SafeAreaProvider>
    );
  }

  // FLUXO DE RECUPERAÇÃO DE SENHA (3 ETAPAS)
  if (telaAtual === 'RecuperarSenha') {
    return (
      <SafeAreaProvider>
        <TelaRecuperarSenha 
          aoVoltar={() => setTelaAtual('Login')} 
          aoAvancar={(email) => {
            setEmailRecuperacao(email);
            setTelaAtual('ValidarCodigo');
          }}
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'ValidarCodigo') {
    return (
      <SafeAreaProvider>
        <TelaValidarCodigo 
          email={emailRecuperacao}
          aoVoltar={() => setTelaAtual('RecuperarSenha')}
          aoSucesso={(codigo) => {
            setCodigoValidado(codigo);
            setTelaAtual('RedefinirSenha');
          }}
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'RedefinirSenha') {
    return (
      <SafeAreaProvider>
        <TelaRedefinirSenha 
          email={emailRecuperacao}
          codigo={codigoValidado}
          aoConcluir={() => {
            setEmailRecuperacao('');
            setCodigoValidado('');
            setTelaAtual('Login');
          }}
        />
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
          usuario={usuarioLogado}
          aoSair={() => {
            setUsuarioLogado(null);
            setTipoUsuario('aluno');
            setTelaAtual('Login');
          }} 
          irParaAdmin={() => setTelaAtual('Admin')}
          irParaInicio={() => setTelaAtual('Feed')} 
          irParaFavoritos={() => setTelaAtual('Favoritos')}
          irParaAgenda={() => setTelaAtual('Agenda')}
        />
      </SafeAreaProvider>
    );
  }

  if (telaAtual === 'Admin') {
    return (
      <SafeAreaProvider>
        <TelaAdmin 
          irParaCriarEvento={() => setTelaAtual('CriarEvento')}
          irParaEditarEvento={(evento) => {
            setEventoSelecionado(evento);
            setTelaAtual('CriarEvento');
          }}
          irParaVoltar={() => setTelaAtual('Perfil')}
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
              buscarEventosDaAPI(); // Atualiza a lista vinda da API
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

  if (carregandoEventos && telaAtual === 'Feed') {
    return (
      <SafeAreaProvider style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>A carregar eventos do banco de dados...</Text>
      </SafeAreaProvider>
    );
  }

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
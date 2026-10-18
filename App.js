import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

// Importação das Telas...

// Importação das Telas
import TelaCriarEvento from './src/screens/TelaCriarEvento';
import TelaFavoritos from './src/screens/TelaFavoritos';
import TelaOnboarding from './src/screens/TelaOnboarding';
import TelaLogin from './src/screens/TelaLogin';
import TelaRecuperarSenha from './src/screens/TelaRecuperarSenha';
import TelaCadastroUsuario from './src/screens/TelaCadastroUsuario';
import TelaEventos from './src/screens/TelaEventos';
import TelaDetalhesEvento from './src/screens/TelaDetalhesEvento';
import TelaPerfil from './src/screens/TelaPerfil';
import TelaAgenda from './src/screens/TelaAgenda';

export default function App() {
  // Estado que controla qual tela está ativa no momento
  const [telaAtual, setTelaAtual] = useState('Onboarding');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  
  // Transformamos a lista num Estado! Começa com os dois eventos fixos, mas aceitará novos.
  const [listaEventos, setListaEventos] = useState([
    {
      id: '1',
      titulo: 'Python Brasil [Conference]',
      formato: 'Presencial',
      cidade: 'Salvador, BA',
      tech: 'Python / Backend',
      preco: 'R$ 50,00',
      nota: 4.8,
      localExato: 'Centro de Convenções de Salvador',
      descricao: 'O maior evento de Python do país reunindo especialistas e entusiastas para palestras e networking.',
      imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '2',
      titulo: 'IA Generativa na Prática',
      formato: 'Online',
      cidade: 'Remoto',
      tech: 'Inteligência Artificial',
      preco: 'Gratuito',
      nota: 4.9,
      localExato: 'Transmissão ao vivo via YouTube',
      descricao: 'Aprenda a aplicar modelos de linguagem e IA generativa em projetos reais do dia a dia.',
      imagem: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    },
  ]);

  // Carrega eventos criados pelo Admin que estão salvos no telemóvel
  useEffect(() => {
    const carregarEventosCriados = async () => {
      try {
        const eventosSalvos = await AsyncStorage.getItem('@GatherTech:eventosCriados');
        if (eventosSalvos) {
          const arrayEventosSalvos = JSON.parse(eventosSalvos);
          // Junta os eventos padrão com os eventos salvos no telemóvel
          setListaEventos(listaAntiga => [...listaAntiga, ...arrayEventosSalvos]);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos criados:', error);
      }
    };
    
    carregarEventosCriados();
  }, []);

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
          aoEntrar={(emailDigitado) => {
            // "Porta Secreta": Simulando o banco de dados
            if (emailDigitado === 'admin@gathertech.com') {
              setTipoUsuario('admin');
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
        <TelaCadastroUsuario 
          aoVoltar={() => setTelaAtual('Login')} 
          aoCadastrar={() => setTelaAtual('Feed')} 
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
          aoSalvar={async (novoEvento) => { // <-- Adicionei async aqui
            try {
              // 1. Atualiza a lista na tela instantaneamente
              setListaEventos([...listaEventos, novoEvento]);
              
              // 2. Prepara o evento para guardar no disco
              const eventosSalvos = await AsyncStorage.getItem('@GatherTech:eventosCriados');
              let arrayEventosSalvos = eventosSalvos ? JSON.parse(eventosSalvos) : [];
              arrayEventosSalvos.push(novoEvento);
              
              // 3. Salva efetivamente na memória do telemóvel
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

  // AQUI SÓ HÁ UM RETURN FINAL!
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
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

// Importação das Telas
import TelaOnboarding from './src/screens/TelaOnboarding';
import TelaLogin from './src/screens/TelaLogin';
import TelaRecuperarSenha from './src/screens/TelaRecuperarSenha';
import TelaCadastroUsuario from './src/screens/TelaCadastroUsuario';
import TelaEventos from './src/screens/TelaEventos';
import TelaDetalhesEvento from './src/screens/TelaDetalhesEvento';
import TelaPerfil from './src/screens/TelaPerfil';

export default function App() {
  // Estado que controla qual tela está ativa no momento
  const [telaAtual, setTelaAtual] = useState('Onboarding');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const listaEventos = [
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
  ];

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
          aoEntrar={() => setTelaAtual('Feed')} 
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
        />
      </SafeAreaProvider>
    );
  }

  // AQUI SÓ HÁ UM RETURN FINAL!
  return (
    <SafeAreaProvider>
      <TelaEventos 
        eventos={listaEventos} 
        aoSelecionarEvento={(evento) => {
          setEventoSelecionado(evento);
          setTelaAtual('Detalhes');
        }} 
        irParaPerfil={() => setTelaAtual('Perfil')}
        irParaFavoritos={() => Alert.alert('Aviso', 'Tela de Favoritos em breve!')}
        irParaIngressos={() => Alert.alert('Aviso', 'Tela de Ingressos em breve!')}
      />
    </SafeAreaProvider>
  );
}
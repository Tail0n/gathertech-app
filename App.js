import React, { useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importações dos arquivos criados na pasta src/
import { EVENTOS_INICIAIS } from './src/data/eventosData';
import TelaOnboarding from './src/screens/TelaOnboarding';
import TelaLogin from './src/screens/TelaLogin';
import TelaCadastroUsuario from './src/screens/TelaCadastroUsuario';
import TelaEventos from './src/screens/TelaEventos';
import TelaDetalhesEvento from './src/screens/TelaDetalhesEvento';
import TelaCadastro from './src/screens/TelaCadastro';

const Tab = createBottomTabNavigator();

export default function App() {
  const [etapaFluxo, setEtapaFluxo] = useState('onboarding');
  const [listaEventos, setListaEventos] = useState(EVENTOS_INICIAIS);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const renderConteudo = () => {
    if (etapaFluxo === 'onboarding') {
      return <TelaOnboarding aoContinuar={() => setEtapaFluxo('login')} />;
    }

    if (etapaFluxo === 'login') {
      return (
        <TelaLogin 
          aoEntrar={() => setEtapaFluxo('app')} 
          irParaCadastro={() => setEtapaFluxo('cadastro')} 
        />
      );
    }

    if (etapaFluxo === 'cadastro') {
      return (
        <TelaCadastroUsuario 
          aoCadastrar={() => setEtapaFluxo('app')} 
          irParaLogin={() => setEtapaFluxo('login')} 
        />
      );
    }

    if (eventoSelecionado) {
      return (
        <TelaDetalhesEvento 
          evento={eventoSelecionado} 
          aoVoltar={() => setEventoSelecionado(null)} 
        />
      );
    }

    return (
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{ 
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#121824',
              borderTopColor: '#1E293B',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#0066FF',
            tabBarInactiveTintColor: '#8F9CAE',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            }
          }}
        >
          <Tab.Screen 
            name="Eventos"
            options={{
              tabBarLabel: 'Eventos',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 18, color }}>🏠</Text>
              )
            }}
          >
            {(props) => (
              <TelaEventos 
                {...props} 
                eventos={listaEventos} 
                aoSelecionarEvento={(evento) => setEventoSelecionado(evento)}
              />
            )}
          </Tab.Screen>

          <Tab.Screen 
            name="Novo Evento"
            options={{
              tabBarLabel: 'Novo Evento',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 18, color }}>➕</Text>
              )
            }}
          >
            {(props) => (
              <TelaCadastro 
                {...props} 
                adicionarEvento={(novo) => setListaEventos([novo, ...listaEventos])} 
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  };

  return (
    <SafeAreaProvider>
      {renderConteudo()}
    </SafeAreaProvider>
  );
}
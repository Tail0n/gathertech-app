import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TelaPerfil({ 
  usuario, 
  aoSair, 
  irParaAdmin, 
  irParaInicio, 
  irParaFavoritos, 
  irParaAgenda 
}) {
  const eAdmin = usuario?.tipo_usuario === 'admin';

  const handleSair = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja encerrar a sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: aoSair }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO DO PERFIL */}
        <View style={styles.headerPerfil}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }} 
            style={styles.fotoPerfil} 
          />
          <Text style={styles.nomeUsuario}>{usuario?.nome_usuario || 'Utilizador GatherTech'}</Text>
          <Text style={styles.emailUsuario}>{usuario?.email || 'email@exemplo.com'}</Text>
          
          <View style={[styles.badgeTipo, eAdmin ? styles.badgeAdmin : styles.badgeAluno]}>
            <Text style={styles.textoBadge}>
              {eAdmin ? 'ADMINISTRADOR' : 'ALUNO'}
            </Text>
          </View>
        </View>

        {/* SECÇÃO EXCLUSIVA DE ADMINISTRAÇÃO */}
        {eAdmin && (
          <View style={styles.secaoAdmin}>
            <Text style={styles.secaoTitulo}>Painel de Controlo</Text>
            <TouchableOpacity style={styles.btnAdminCard} onPress={irParaAdmin}>
              <View style={styles.iconAdminContainer}>
                <Feather name="shield" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.infoAdminCard}>
                <Text style={styles.tituloAdminCard}>Painel Administrativo</Text>
                <Text style={styles.subAdminCard}>Gerir métricas, utilizadores e eventos</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        )}

        {/* OPÇÕES DA CONTA */}
        <Text style={styles.secaoTitulo}>Definições da Conta</Text>

        <View style={styles.opcoesGroup}>
          <TouchableOpacity style={styles.opcaoItem}>
            <View style={styles.opcaoLeft}>
              <Feather name="user" size={20} color="#8F9CAE" />
              <Text style={styles.opcaoTexto}>Editar Perfil</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcaoItem}>
            <View style={styles.opcaoLeft}>
              <Feather name="lock" size={20} color="#8F9CAE" />
              <Text style={styles.opcaoTexto}>Alterar Palavra-passe</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcaoItem}>
            <View style={styles.opcaoLeft}>
              <Feather name="bell" size={20} color="#8F9CAE" />
              <Text style={styles.opcaoTexto}>Notificações</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>
        </View>

        {/* BOTÃO DE TERMINAR SESSÃO */}
        <TouchableOpacity style={styles.btnSair} onPress={handleSair}>
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.textoBtnSair}>Terminar Sessão</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={irParaInicio}>
          <Ionicons name="home-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={irParaFavoritos}>
          <Ionicons name="heart-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={irParaAgenda}>
          <Ionicons name="calendar-outline" size={22} color="#8F9CAE" />
          <Text style={styles.tabLabel}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person" size={22} color="#8B5CF6" />
          <Text style={[styles.tabLabel, styles.tabActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 },
  headerPerfil: { alignItems: 'center', marginBottom: 28 },
  fotoPerfil: { width: 90, height: 90, borderRadius: 45, marginBottom: 12, borderWidth: 2, borderColor: '#8B5CF6' },
  nomeUsuario: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  emailUsuario: { color: '#8F9CAE', fontSize: 14, marginBottom: 10 },
  badgeTipo: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeAdmin: { backgroundColor: '#8B5CF6' },
  badgeAluno: { backgroundColor: '#1E293B' },
  textoBadge: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  secaoTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 14 },
  secaoAdmin: { marginBottom: 24 },
  btnAdminCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#121824', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#8B5CF6' 
  },
  iconAdminContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: '#8B5CF6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  infoAdminCard: { flex: 1 },
  tituloAdminCard: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  subAdminCard: { color: '#8F9CAE', fontSize: 12, marginTop: 2 },
  opcoesGroup: { backgroundColor: '#121824', borderRadius: 16, borderWidth: 1, borderColor: '#1E293B', marginBottom: 28 },
  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1E293B' 
  },
  opcaoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opcaoTexto: { color: '#FFFFFF', fontSize: 15 },
  btnSair: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#121824', 
    paddingVertical: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#EF4444', 
    gap: 8 
  },
  textoBtnSair: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
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
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#8F9CAE', fontSize: 11, marginTop: 4 },
  tabActive: { color: '#8B5CF6', fontWeight: 'bold' }
});
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; 

export default function TelaPerfil({ aoSair, irParaInicio }) {
  
  // Dados simulados para visualizar como o perfil ficará quando estiver ligado ao Banco de Dados
  const usuario = {
    nome: "Tailon Santana",
    email: "tailon@email.com",
    telefone: "(71) 99999-9999",
    avatar: "https://i.pravatar.cc/150?img=11"
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView para permitir rolagem caso sejam adicionadas muitas opções no futuro */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} style={{ flex: 1 }}>
        
        {/* --- CABEÇALHO --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity style={styles.btnConfig} onPress={() => Alert.alert('Aviso', 'Configurações em breve!')}>
            <Feather name="settings" size={22} color="#8F9CAE" />
          </TouchableOpacity>
        </View>

        {/* --- INFO DO USUÁRIO --- */}
        <View style={styles.userInfoSection}>
          <Image source={{ uri: usuario.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{usuario.nome}</Text>
          <Text style={styles.userEmail}>{usuario.email}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Membro GatherTech</Text>
            </View>
          </View>
        </View>

        {/* --- OPÇÕES DE CONTA --- */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconBg}>
              <Feather name="user" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.optionText}>Editar Dados Pessoais</Text>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconBg}>
              <Feather name="bell" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.optionText}>Notificações</Text>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconBg}>
              <Feather name="moon" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.optionText}>Tema Escuro</Text>
            <Text style={styles.optionStatus}>Ativado</Text>
          </TouchableOpacity>
        </View>

        {/* --- OUTRAS OPÇÕES --- */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Outros</Text>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconBg}>
              <Feather name="help-circle" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.optionText}>Central de Ajuda</Text>
            <Feather name="chevron-right" size={18} color="#8F9CAE" />
          </TouchableOpacity>

          {/* --- BOTÃO DE SAIR DA CONTA --- */}
          <TouchableOpacity style={[styles.optionItem, styles.logoutItem]} onPress={aoSair}>
            <View style={[styles.optionIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Feather name="log-out" size={18} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* --- MENU INFERIOR FIXO --- */}
      <View style={styles.menuInferior}>
        <TouchableOpacity style={styles.menuItem} onPress={irParaInicio}>
          <Ionicons name="home-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aviso', 'Ecrã de Favoritos em breve!')}>
          <Ionicons name="heart-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aviso', 'Ecrã de Ingressos em breve!')}>
          <Ionicons name="ticket-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Ingressos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="user" size={24} color="#8B5CF6" />
          <Text style={[styles.menuTexto, { color: '#8B5CF6' }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#090C10' 
  },
  
  // CABEÇALHO
  header: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginTop: 12, 
    marginBottom: 24,
    position: 'relative'
  },
  headerTitle: { 
    color: '#F8FAFC', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  btnConfig: { 
    position: 'absolute', 
    right: 20, 
    padding: 6 
  },

  // INFO DO USUÁRIO
  userInfoSection: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#8B5CF6', 
    marginBottom: 16 
  },
  userName: { 
    color: '#F8FAFC', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  userEmail: { 
    color: '#8F9CAE', 
    fontSize: 14, 
    marginBottom: 12 
  },
  badgeContainer: { 
    flexDirection: 'row' 
  },
  badge: { 
    backgroundColor: '#1E2430', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#2D3748' 
  },
  badgeText: { 
    color: '#E2E8F0', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  // SEÇÕES DE MENU
  menuSection: { 
    paddingHorizontal: 20, 
    marginBottom: 24 
  },
  sectionTitle: { 
    color: '#F8FAFC', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  optionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#121620', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#1E2430' 
  },
  optionIconBg: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#1E2430', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  optionText: { 
    flex: 1, 
    color: '#E2E8F0', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  optionStatus: { 
    color: '#8F9CAE', 
    fontSize: 13, 
    marginRight: 8 
  },

  // BOTÃO DE SAIR
  logoutItem: { 
    borderColor: 'rgba(239, 68, 68, 0.2)' 
  },
  logoutText: { 
    flex: 1, 
    color: '#EF4444', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },

  // MENU INFERIOR
  menuInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#090C10',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#1E2430',
  },
  menuItem: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  menuTexto: { 
    fontSize: 11, 
    marginTop: 4, 
    color: '#8F9CAE', 
    fontWeight: '500' 
  }
});
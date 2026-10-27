import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const API_BASE = 'http://10.0.0.102:3000/api';

export default function TelaAdmin({ irParaCriarEvento, irParaEditarEvento, irParaVoltar }) {
  const [abaAtiva, setAbaAtiva] = useState('metricas'); // 'metricas' | 'eventos' | 'usuarios'
  const [carregando, setCarregando] = useState(false);
  
  // Dados do Dashboard
  const [metricas, setMetricas] = useState({ totalUsuarios: 0, totalEventos: 0, statusSistema: 'Online' });
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [buscaUsuario, setBuscaUsuario] = useState('');

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      if (abaAtiva === 'metricas') {
        const res = await fetch(`${API_BASE}/admin/metricas`);
        const dados = await res.json();
        if (res.ok) setMetricas(dados);
      } else if (abaAtiva === 'eventos') {
        const res = await fetch(`${API_BASE}/eventos`);
        const dados = await res.json();
        if (res.ok) setEventos(dados);
      } else if (abaAtiva === 'usuarios') {
        const res = await fetch(`${API_BASE}/admin/usuarios`);
        const dados = await res.json();
        if (res.ok) setUsuarios(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados admin:', erro);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  // EXCLUIR EVENTO
  const handleExcluirEvento = (idEvento, nomeEvento) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente apagar o evento "${nomeEvento}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE}/eventos/${idEvento}`, { method: 'DELETE' });
              if (res.ok) {
                Alert.alert('Sucesso', 'Evento removido!');
                carregarDados();
              }
            } catch (err) {
              Alert.alert('Erro', 'Erro ao excluir o evento.');
            }
          } 
        }
      ]
    );
  };

  // ALTERAR PERMISSÃO DE USUÁRIO (Admin <-> Aluno)
  const handleAlternarTipoUsuario = async (usuario) => {
    const novoTipo = usuario.tipo_usuario === 'admin' ? 'aluno' : 'admin';
    try {
      const res = await fetch(`${API_BASE}/admin/usuarios/${usuario.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_usuario: novoTipo,
          nome_usuario: usuario.nome_usuario,
          email: usuario.email
        }),
      });

      if (res.ok) {
        Alert.alert('Atualizado', `Usuário alterado para ${novoTipo.toUpperCase()}`);
        carregarDados();
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a permissão.');
    }
  };

  // EXCLUIR USUÁRIO
  const handleExcluirUsuario = (idUsuario, nome) => {
    Alert.alert(
      'Excluir Conta',
      `Tem certeza que deseja apagar o usuário "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE}/admin/usuarios/${idUsuario}`, { method: 'DELETE' });
              if (res.ok) {
                Alert.alert('Sucesso', 'Usuário removido!');
                carregarDados();
              }
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível apagar o usuário.');
            }
          }
        }
      ]
    );
  };

  const usuariosFiltrados = usuarios.filter(u => 
    (u.nome_usuario || '').toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(buscaUsuario.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO DA TELA */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={irParaVoltar}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Painel Admin</Text>
        <TouchableOpacity style={styles.btnReload} onPress={carregarDados}>
          <Feather name="refresh-cw" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* ABAS DE NAVEGAÇÃO DO PAINEL */}
      <View style={styles.abasContainer}>
        <TouchableOpacity 
          style={[styles.abaItem, abaAtiva === 'metricas' && styles.abaAtiva]} 
          onPress={() => setAbaAtiva('metricas')}
        >
          <Feather name="bar-chart-2" size={18} color={abaAtiva === 'metricas' ? '#8B5CF6' : '#8F9CAE'} />
          <Text style={[styles.textoAba, abaAtiva === 'metricas' && styles.textoAbaAtiva]}>Métricas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.abaItem, abaAtiva === 'eventos' && styles.abaAtiva]} 
          onPress={() => setAbaAtiva('eventos')}
        >
          <Feather name="calendar" size={18} color={abaAtiva === 'eventos' ? '#8B5CF6' : '#8F9CAE'} />
          <Text style={[styles.textoAba, abaAtiva === 'eventos' && styles.textoAbaAtiva]}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.abaItem, abaAtiva === 'usuarios' && styles.abaAtiva]} 
          onPress={() => setAbaAtiva('usuarios')}
        >
          <Feather name="users" size={18} color={abaAtiva === 'usuarios' ? '#8B5CF6' : '#8F9CAE'} />
          <Text style={[styles.textoAba, abaAtiva === 'usuarios' && styles.textoAbaAtiva]}>Usuários</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
          
          {/* ABA 1: MÉTRICAS E ACOMPANHAMENTO DO APP */}
          {abaAtiva === 'metricas' && (
            <View>
              <Text style={styles.secaoTitulo}>Visão Geral do GatherTech</Text>
              
              <View style={styles.cardsRow}>
                <View style={styles.cardStat}>
                  <Feather name="users" size={28} color="#0066FF" />
                  <Text style={styles.valorStat}>{metricas.totalUsuarios}</Text>
                  <Text style={styles.labelStat}>Usuários Cadastrados</Text>
                </View>

                <View style={styles.cardStat}>
                  <Feather name="calendar" size={28} color="#8B5CF6" />
                  <Text style={styles.valorStat}>{metricas.totalEventos}</Text>
                  <Text style={styles.labelStat}>Eventos Criados</Text>
                </View>
              </View>

              <View style={styles.cardInfoGeral}>
                <View style={styles.statusRow}>
                  <View style={styles.pontoStatus} />
                  <Text style={styles.statusTexto}>Status da API: {metricas.statusSistema}</Text>
                </View>
                <Text style={styles.subInfoGeral}>
                  O servidor PostgreSQL e o serviço de e-mails Nodemailer estão em operação normal.
                </Text>
              </View>
            </View>
          )}

          {/* ABA 2: GESTÃO DE EVENTOS (CRIAR / EDITAR / EXCLUIR) */}
          {abaAtiva === 'eventos' && (
            <View>
              <TouchableOpacity style={styles.btnCriar} onPress={irParaCriarEvento}>
                <Feather name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.textoBtnCriar}>Cadastrar Novo Evento</Text>
              </TouchableOpacity>

              <Text style={styles.secaoTitulo}>Lista de Eventos ({eventos.length})</Text>

              {eventos.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum evento para gerir.</Text>
              ) : (
                eventos.map((item) => (
                  <View key={item.id_evento} style={styles.cardItem}>
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardTituloItem}>{item.nome_evento}</Text>
                      <Text style={styles.cardSubItem}>{item.modalidade} • {item.data_inicio || 'Sem data'}</Text>
                    </View>

                    <View style={styles.acoesRow}>
                      <TouchableOpacity 
                        style={styles.btnAcao} 
                        onPress={() => irParaEditarEvento && irParaEditarEvento(item)}
                      >
                        <Feather name="edit" size={18} color="#0066FF" />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.btnAcao} 
                        onPress={() => handleExcluirEvento(item.id_evento, item.nome_evento)}
                      >
                        <Feather name="trash-2" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* ABA 3: GESTÃO DE USUÁRIOS E CORREÇÃO DE ERROS */}
          {abaAtiva === 'usuarios' && (
            <View>
              <View style={styles.searchContainer}>
                <Feather name="search" size={18} color="#8F9CAE" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar por nome ou e-mail..."
                  placeholderTextColor="#8F9CAE"
                  value={buscaUsuario}
                  onChangeText={setBuscaUsuario}
                />
              </View>

              <Text style={styles.secaoTitulo}>Usuários ({usuariosFiltrados.length})</Text>

              {usuariosFiltrados.map((u) => (
                <View key={u.id_usuario} style={styles.cardItem}>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardTituloItem}>{u.nome_usuario}</Text>
                    <Text style={styles.cardSubItem}>{u.email}</Text>
                    <View style={[styles.badgeTipo, u.tipo_usuario === 'admin' ? styles.badgeAdmin : styles.badgeAluno]}>
                      <Text style={styles.badgeTipoTexto}>{u.tipo_usuario ? u.tipo_usuario.toUpperCase() : 'ALUNO'}</Text>
                    </View>
                  </View>

                  <View style={styles.acoesRow}>
                    <TouchableOpacity 
                      style={styles.btnPermissao} 
                      onPress={() => handleAlternarTipoUsuario(u)}
                    >
                      <Feather name="shield" size={16} color="#8B5CF6" />
                      <Text style={styles.textoPermissao}>Mudar Cargo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.btnAcao} 
                      onPress={() => handleExcluirUsuario(u.id_usuario, u.nome_usuario)}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  btnVoltar: { padding: 4 },
  tituloHeader: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  btnReload: { padding: 4 },
  abasContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#121824', 
    marginHorizontal: 20, 
    marginTop: 16, 
    borderRadius: 12, 
    padding: 4 
  },
  abaItem: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    gap: 6, 
    borderRadius: 8 
  },
  abaAtiva: { backgroundColor: '#1E293B' },
  textoAba: { color: '#8F9CAE', fontSize: 13, fontWeight: '600' },
  textoAbaAtiva: { color: '#FFFFFF' },
  conteudo: { padding: 20, paddingBottom: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  secaoTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginTop: 8 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  cardStat: { 
    flex: 1, 
    backgroundColor: '#121824', 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    alignItems: 'center' 
  },
  valorStat: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginVertical: 6 },
  labelStat: { color: '#8F9CAE', fontSize: 12, textAlign: 'center' },
  cardInfoGeral: { 
    backgroundColor: '#121824', 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#1E293B' 
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  pontoStatus: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  statusTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  subInfoGeral: { color: '#8F9CAE', fontSize: 13, lineHeight: 18 },
  btnCriar: { 
    flexDirection: 'row', 
    backgroundColor: '#8B5CF6', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    marginBottom: 20 
  },
  textoBtnCriar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cardItem: { 
    backgroundColor: '#121824', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  cardDetails: { flex: 1, marginRight: 10 },
  cardTituloItem: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cardSubItem: { color: '#8F9CAE', fontSize: 13, marginTop: 2 },
  acoesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnAcao: { padding: 8, backgroundColor: '#1E293B', borderRadius: 8 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#121824', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    marginBottom: 16 
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  badgeTipo: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 6 },
  badgeAdmin: { backgroundColor: '#8B5CF6' },
  badgeAluno: { backgroundColor: '#334155' },
  badgeTipoTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  btnPermissao: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E293B', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  textoPermissao: { color: '#8B5CF6', fontSize: 12, fontWeight: '600' },
  emptyText: { color: '#8F9CAE', textAlign: 'center', marginTop: 20 }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; 

export default function TelaAgenda({ irParaInicio, irParaFavoritos, irParaPerfil }) {
  // Dados simulados da agenda do utilizador (Eventos em que ele se inscreveu)
  const [agenda] = useState([
    {
      id: '1',
      mes: 'OUT',
      dia: '15',
      titulo: 'Workshop de React Native',
      horario: '14:00 - 18:00',
      local: 'Laboratório 3 - Campus',
      formato: 'Presencial',
      sincronizado: false,
    },
    {
      id: '2',
      mes: 'OUT',
      dia: '22',
      titulo: 'Palestra: Arquitetura de Nuvem e AWS',
      horario: '19:00 - 21:00',
      local: 'Link do Google Meet',
      formato: 'Online',
      sincronizado: true, // Simula um evento que já foi para o Google Agenda
    }
  ]);

  const adicionarAoCalendario = (evento) => {
    // No futuro, aqui entrará o código do expo-calendar
    Alert.alert(
      'Sincronizar Agenda',
      `Deseja adicionar "${evento.titulo}" ao seu calendário do Google?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Adicionar', onPress: () => Alert.alert('Sucesso', 'Evento adicionado à sua agenda!') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Agenda</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1, paddingHorizontal: 20 }}>
        
        {agenda.length === 0 ? (
          // ESTADO VAZIO
          <View style={styles.emptyState}>
            <View style={styles.iconBgVazio}>
              <Feather name="calendar" size={48} color="#8F9CAE" />
            </View>
            <Text style={styles.emptyTitle}>Agenda livre!</Text>
            <Text style={styles.emptyDesc}>Você ainda não se inscreveu em nenhum evento ou aula extra.</Text>
            <TouchableOpacity style={styles.btnExplorar} onPress={irParaInicio}>
              <Text style={styles.textoBtnExplorar}>Encontrar Eventos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // LINHA DO TEMPO (TIMELINE)
          <View style={styles.timelineContainer}>
            {agenda.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                
                {/* Coluna da Esquerda: Data e Linha */}
                <View style={styles.dateColumn}>
                  <Text style={styles.dateMes}>{item.mes}</Text>
                  <Text style={styles.dateDia}>{item.dia}</Text>
                  {/* Linha conectora (não renderiza no último item) */}
                  {index !== agenda.length - 1 && <View style={styles.timelineLine} />}
                </View>

                {/* Coluna da Direita: Card do Evento */}
                <View style={styles.cardAgenda}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.badgeModalidade, item.formato === 'Presencial' ? styles.bgPresencial : styles.bgOnline]}>
                      <Text style={styles.textoBadgeModalidade}>{item.formato}</Text>
                    </View>
                    
                    {/* Indicador visual se já está no Google Agenda */}
                    {item.sincronizado && (
                      <Feather name="check-circle" size={16} color="#10B981" title="Sincronizado" />
                    )}
                  </View>

                  <Text style={styles.tituloEvento} numberOfLines={2}>{item.titulo}</Text>
                  
                  <View style={styles.infoRow}>
                    <Feather name="clock" size={14} color="#8F9CAE" />
                    <Text style={styles.textoInfo}>{item.horario}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Feather name="map-pin" size={14} color="#8F9CAE" />
                    <Text style={styles.textoInfo} numberOfLines={1}>{item.local}</Text>
                  </View>

                  {/* Botão de Integração com Calendário */}
                  <TouchableOpacity 
                    style={[styles.btnCalendario, item.sincronizado && styles.btnCalendarioInativo]} 
                    disabled={item.sincronizado}
                    onPress={() => adicionarAoCalendario(item)}
                  >
                    <Ionicons name="calendar-outline" size={16} color={item.sincronizado ? "#8F9CAE" : "#FFFFFF"} />
                    <Text style={[styles.textoBtnCalendario, item.sincronizado && styles.textoBtnCalendarioInativo]}>
                      {item.sincronizado ? 'Na sua Agenda' : 'Adicionar ao Calendário'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MENU INFERIOR FIXO */}
      <View style={styles.menuInferior}>
        <TouchableOpacity style={styles.menuItem} onPress={irParaInicio}>
          <Ionicons name="home-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={irParaFavoritos}>
          <Ionicons name="heart-outline" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="calendar" size={24} color="#8B5CF6" />
          <Text style={[styles.menuTexto, { color: '#8B5CF6' }]}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={irParaPerfil}>
          <Feather name="user" size={24} color="#8F9CAE" />
          <Text style={styles.menuTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090C10' },
  header: { alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E2430', marginBottom: 20 },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },

  // ESTADO VAZIO
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, marginTop: 40 },
  iconBgVazio: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#121620', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1E2430' },
  emptyTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyDesc: { color: '#8F9CAE', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  btnExplorar: { backgroundColor: '#8B5CF6', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  textoBtnExplorar: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  // LINHA DO TEMPO
  timelineContainer: { marginTop: 10 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  
  dateColumn: { width: 50, alignItems: 'center', marginRight: 12 },
  dateMes: { color: '#8B5CF6', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  dateDia: { color: '#F8FAFC', fontSize: 22, fontWeight: 'bold', marginTop: 2 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#1E2430', marginTop: 12, borderRadius: 1 },

  cardAgenda: { flex: 1, backgroundColor: '#121620', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2430' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badgeModalidade: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  bgPresencial: { backgroundColor: 'rgba(124, 58, 237, 0.15)' }, // Roxo translúcido
  bgOnline: { backgroundColor: 'rgba(37, 99, 235, 0.15)' }, // Azul translúcido
  textoBadgeModalidade: { color: '#F8FAFC', fontSize: 10, fontWeight: 'bold' },
  
  tituloEvento: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 12, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  textoInfo: { color: '#94A3B8', fontSize: 13, marginLeft: 8 },

  btnCalendario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6', paddingVertical: 10, borderRadius: 10, marginTop: 14 },
  btnCalendarioInativo: { backgroundColor: '#1E2430' },
  textoBtnCalendario: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  textoBtnCalendarioInativo: { color: '#8F9CAE' },

  // MENU INFERIOR
  menuInferior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#090C10', paddingVertical: 12, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: '#1E2430' },
  menuItem: { alignItems: 'center', justifyContent: 'center' },
  menuTexto: { fontSize: 11, marginTop: 4, color: '#8F9CAE', fontWeight: '500' }
});
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaOnboarding({ aoContinuar }) {
  return (
    <SafeAreaView style={styles.containerOnboarding}>
      <View style={styles.contentOnboarding}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoOnboarding} 
          resizeMode="contain"
        />
        
        <Text style={styles.tituloOnboarding}>
          Bem-vindo ao{'\n'}
          <Text style={styles.headerBlue}>Gather</Text>
          <Text style={styles.headerPurple}>Tech</Text>
        </Text>

        <Text style={styles.subtituloOnboarding}>
          Encontre eventos de tecnologia de forma centralizada, prática e inteligente.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotAtivo]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <TouchableOpacity style={styles.btnContinuar} onPress={aoContinuar}>
        <Text style={styles.textoBtnContinuar}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerOnboarding: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 40 },
  contentOnboarding: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoOnboarding: { width: 140, height: 140, marginBottom: 32 },
  tituloOnboarding: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
  subtituloOnboarding: { fontSize: 15, color: '#8F9CAE', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  headerBlue: { color: '#0066FF' },
  headerPurple: { color: '#7C3AED' },
  dotsContainer: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1E293B' },
  dotAtivo: { backgroundColor: '#0066FF', width: 20 },
  btnContinuar: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  textoBtnContinuar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
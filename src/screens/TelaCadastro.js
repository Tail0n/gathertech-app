import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, TextInput, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.0.0.100:3000/api/cadastro';

// --- FUNÇÕES DE MÁSCARA E VALIDAÇÃO ---

// Máscara Data: DD/MM/AAAA
const aplicarMascaraData = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 8);
  if (apenasNumeros.length <= 2) return apenasNumeros;
  if (apenasNumeros.length <= 4) return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
  return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4)}`;
};

// Máscara Telefone: 99 9 9999-9999
const aplicarMascaraTelefone = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);
  if (apenasNumeros.length <= 2) return apenasNumeros;
  if (apenasNumeros.length <= 3) return `${apenasNumeros.slice(0, 2)} ${apenasNumeros.slice(2)}`;
  if (apenasNumeros.length <= 7) return `${apenasNumeros.slice(0, 2)} ${apenasNumeros.slice(2, 3)} ${apenasNumeros.slice(3)}`;
  return `${apenasNumeros.slice(0, 2)} ${apenasNumeros.slice(2, 3)} ${apenasNumeros.slice(3, 7)}-${apenasNumeros.slice(7)}`;
};

// Máscara CPF / CNPJ
const aplicarMascaraCpfCnpj = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 14);
  if (apenasNumeros.length <= 11) {
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return apenasNumeros
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

// Validador CPF
const validarCPF = (cpf) => {
  const str = cpf.replace(/\D/g, '');
  if (str.length !== 11 || /^(\d)\1{10}$/.test(str)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(str.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(str.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(str.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(str.substring(10, 11));
};

// Validador CNPJ
const validarCNPJ = (cnpj) => {
  const str = cnpj.replace(/\D/g, '');
  if (str.length !== 14 || /^(\d)\1{13}$/.test(str)) return false;
  let tamanho = str.length - 2;
  let numeros = str.substring(0, tamanho);
  const digitos = str.substring(tamanho);
  let soma = 0, pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho += 1;
  numeros = str.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
};

const validarDocumento = (valor) => {
  const limpo = valor.replace(/\D/g, '');
  if (limpo.length === 11) return validarCPF(limpo);
  if (limpo.length === 14) return validarCNPJ(limpo);
  return false;
};

// Validador Formato de E-mail
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Avaliador da Força de Senha
const avaliarSenha = (senha) => {
  const regras = {
    tamanho: senha.length >= 12,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>\-_]/.test(senha)
  };

  let pontos = 0;
  if (regras.tamanho) pontos++;
  if (regras.maiuscula) pontos++;
  if (regras.minuscula) pontos++;
  if (regras.especial) pontos++;

  const ehForte = regras.tamanho && regras.maiuscula && regras.minuscula && regras.especial;

  return { pontos, regras, ehForte };
};

export default function TelaCadastro({ aoVoltar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estados de Validação em Tempo Real
  const emailValido = email.length === 0 || validarEmail(email);
  const documentoValido = cpfCnpj.length === 0 || validarDocumento(cpfCnpj);
  const infoSenha = avaliarSenha(senha);
  const senhasCoincidem = confirmarSenha.length === 0 || senha === confirmarSenha;

  const handleCadastro = async () => {
    // 1. Validação de preenchimento dos campos
    if (!nome || !sobrenome || !apelido || !email || !dataNascimento || !telefone || !cpfCnpj || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('E-mail Inválido', 'Insira um e-mail no formato correto (ex: nome@dominio.com).');
      return;
    }

    if (dataNascimento.length < 10) {
      Alert.alert('Data Inválida', 'Preencha a data de nascimento completa no formato DD/MM/AAAA.');
      return;
    }

    if (!validarDocumento(cpfCnpj)) {
      Alert.alert('Documento Inválido', 'O CPF ou CNPJ digitado é inválido.');
      return;
    }

    if (!infoSenha.ehForte) {
      Alert.alert('Senha Fraca', 'A senha deve conter no mínimo 12 caracteres, incluindo letras maiúsculas, minúsculas e um caractere especial.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'A confirmação de senha não coincide com a senha digitada.');
      return;
    }

    // Converter data de DD/MM/AAAA para YYYY-MM-DD para o PostgreSQL
    const [dia, mes, ano] = dataNascimento.split('/');
    const dataFormatadaBanco = `${ano}-${mes}-${dia}`;

    try {
      setCarregando(true);

      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_usuario: apelido.trim(), // Apelido único enviado como identificador
          email: email.toLowerCase().trim(),
          senha: senha,
          data_nascimento: dataFormatadaBanco,
          telefone: telefone,
          cpf_cnpj: cpfCnpj.replace(/\D/g, '')
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.usuario) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
        aoVoltar();
      } else {
        Alert.alert('Falha no Cadastro', dados.erro || 'Não foi possível criar a conta.');
      }
    } catch (erro) {
      console.error('Erro no cadastro:', erro);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar com o servidor da API.');
    } finally {
      setCarregando(false);
    }
  };

  // Cor da Barra de Força de Senha
  const getCorBarraSenha = () => {
    if (infoSenha.pontos === 0) return '#1E293B';
    if (infoSenha.pontos <= 2) return '#EF4444'; // Vermelho
    if (infoSenha.pontos === 3) return '#F59E0B'; // Amarelo
    return '#10B981'; // Verde
  };

  return (
    <SafeAreaView style={styles.containerAuth}>
      <ScrollView contentContainerStyle={styles.authBody} showsVerticalScrollIndicator={false}>

        <View style={styles.headerAuthArea}>
          <Text style={styles.welcomeTitle}>Crie a sua conta</Text>
          <Text style={styles.welcomeSub}>Preencha os dados abaixo para se juntar ao GatherTech.</Text>
        </View>

        <View style={styles.formArea}>

          {/* Nome e Sobrenome lado a lado */}
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.labelInput}>Nome *</Text>
              <TextInput style={styles.inputAuth} placeholder="João" placeholderTextColor="#8F9CAE" value={nome} onChangeText={setNome} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.labelInput}>Sobrenome *</Text>
              <TextInput style={styles.inputAuth} placeholder="Silva" placeholderTextColor="#8F9CAE" value={sobrenome} onChangeText={setSobrenome} />
            </View>
          </View>

          {/* Apelido / Username */}
          <Text style={styles.labelInput}>Apelido (único) *</Text>
          <TextInput style={styles.inputAuth} placeholder="@joaosilva" placeholderTextColor="#8F9CAE" autoCapitalize="none" value={apelido} onChangeText={setApelido} />

          {/* E-mail com Validação */}
          <Text style={styles.labelInput}>E-mail *</Text>
          <TextInput 
            style={[styles.inputAuth, !emailValido && styles.inputErro]} 
            placeholder="nome@dominio.com" 
            placeholderTextColor="#8F9CAE" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setEmail} 
          />
          {!emailValido && <Text style={styles.textoErro}>E-mail inválido. Utilize o formato nome@dominio.com</Text>}

          {/* Data de Nascimento */}
          <Text style={styles.labelInput}>Data de Nascimento *</Text>
          <TextInput 
            style={styles.inputAuth} 
            placeholder="DD/MM/AAAA" 
            placeholderTextColor="#8F9CAE" 
            keyboardType="numeric" 
            maxLength={10} 
            value={dataNascimento} 
            onChangeText={(txt) => setDataNascimento(aplicarMascaraData(txt))} 
          />

          {/* Telefone */}
          <Text style={styles.labelInput}>Telefone *</Text>
          <TextInput 
            style={styles.inputAuth} 
            placeholder="71 9 9999-9999" 
            placeholderTextColor="#8F9CAE" 
            keyboardType="numeric" 
            maxLength={14} 
            value={telefone} 
            onChangeText={(txt) => setTelefone(aplicarMascaraTelefone(txt))} 
          />

          {/* CPF / CNPJ */}
          <Text style={styles.labelInput}>CPF ou CNPJ *</Text>
          <TextInput 
            style={[styles.inputAuth, !documentoValido && styles.inputErro]} 
            placeholder="000.000.000-00 ou 00.000.000/0000-00" 
            placeholderTextColor="#8F9CAE" 
            keyboardType="numeric" 
            maxLength={18} 
            value={cpfCnpj} 
            onChangeText={(txt) => setCpfCnpj(aplicarMascaraCpfCnpj(txt))} 
          />
          {!documentoValido && <Text style={styles.textoErro}>CPF/CNPJ inválido.</Text>}

          {/* Senha */}
          <Text style={styles.labelInput}>Senha *</Text>
          <TextInput 
            style={styles.inputAuth} 
            placeholder="Crie uma senha forte" 
            placeholderTextColor="#8F9CAE" 
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
          />

          {/* Medidor de Força da Senha */}
          {senha.length > 0 && (
            <View style={styles.medidorArea}>
              <View style={styles.barraFundo}>
                <View style={[styles.barraProgresso, { width: `${(infoSenha.pontos / 4) * 100}%`, backgroundColor: getCorBarraSenha() }]} />
              </View>
              <View style={styles.regrasArea}>
                <Text style={infoSenha.regras.tamanho ? styles.regraOk : styles.regraPendente}>• Mínimo 12 caracteres</Text>
                <Text style={infoSenha.regras.maiuscula ? styles.regraOk : styles.regraPendente}>• Letra maiúscula (A-Z)</Text>
                <Text style={infoSenha.regras.minuscula ? styles.regraOk : styles.regraPendente}>• Letra minúscula (a-z)</Text>
                <Text style={infoSenha.regras.especial ? styles.regraOk : styles.regraPendente}>• Caractere especial (@, #, $, etc)</Text>
              </View>
            </View>
          )}

          {/* Confirmar Senha */}
          <Text style={styles.labelInput}>Confirmar Senha *</Text>
          <TextInput 
            style={[styles.inputAuth, !senhasCoincidem && styles.inputErro]} 
            placeholder="Repita a sua senha" 
            placeholderTextColor="#8F9CAE" 
            secureTextEntry 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
          />
          {!senhasCoincidem && <Text style={styles.textoErro}>As senhas não coincidem.</Text>}

          {/* Botão Cadastrar */}
          <TouchableOpacity style={styles.btnPrimarioAuth} onPress={handleCadastro} disabled={carregando}>
            {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.textoBtnPrimario}>Concluir Cadastro</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={aoVoltar} style={styles.linkCadastro}>
          <Text style={styles.textoLink}>Já tem uma conta? <Text style={styles.textDestaque}>Entre aqui</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerAuth: { flex: 1, backgroundColor: '#0B0E14', paddingHorizontal: 24 },
  authBody: { paddingTop: 40, paddingBottom: 40 },
  headerAuthArea: { alignItems: 'center', marginBottom: 24 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  welcomeSub: { fontSize: 14, color: '#8F9CAE', textAlign: 'center', lineHeight: 20 },
  formArea: { marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  labelInput: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  inputAuth: { backgroundColor: '#121824', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', color: '#FFFFFF', fontSize: 15 },
  inputErro: { borderColor: '#EF4444' },
  textoErro: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  medidorArea: { marginTop: 8 },
  barraFundo: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  barraProgresso: { height: '100%', borderRadius: 3 },
  regrasArea: { marginTop: 8, gap: 2 },
  regraOk: { color: '#10B981', fontSize: 12 },
  regraPendente: { color: '#8F9CAE', fontSize: 12 },
  btnPrimarioAuth: { backgroundColor: '#0066FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 28, marginBottom: 20 },
  textoBtnPrimario: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkCadastro: { alignItems: 'center' },
  textoLink: { color: '#8F9CAE', fontSize: 14 },
  textDestaque: { color: '#7C3AED', fontWeight: 'bold' },
});
import React from 'react';
import { SafeAreaView, ScrollView, Text, View, Image, TextInput, TouchableHighlight, Alert, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { setEmail, setSenha, cleanSenha } from '../slices/loginSlice'
import { setCustomer } from '../slices/customerSlice'
import { useNavigation } from '@react-navigation/native'

import { M_COLOR, C_COLOR1, C_COLOR2, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global';

import Social from '../components/Social';

export default function Entry() {

    const navigation = useNavigation()

    const email = useSelector((state) => state.login.email)
    const senha = useSelector((state) => state.login.senha)
    const customer = useSelector((state) => state.customer.customer)
    const dispatch = useDispatch()

    const handleEmailChange = (text) => {
        dispatch(setEmail(text))
    }

    const handleSenhaChange = (text) => {
        dispatch(setSenha(text))
    }

    function Logar() {
      fetch (`${URL_API}/customer/login`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({clientNumber: CLIENT_NUMBER, email: email, password: senha}),
        })
        .then(resp => resp.json())
        .then((data) => {
            dispatch(setCustomer(data.content))
            if (data.msg === "Login realizado com sucesso") {
              dispatch(cleanSenha())
              navigation.navigate("Boston Esfiharia")
            }
          Alert.alert(data.msg)
        })
        .catch((err) => console.log(err))
    }

    return(
      <SafeAreaView style={styles.container}>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={require("../../assets/logo.png")}
          />
        </View>
        <ScrollView>
          <Text style={styles.txttitulo}>Para pedir pelo App, faça seu login!</Text>
          <View style={styles.corpo}>
            <View style = {styles.email}>
              <Text style = {styles.txtCampos}>E-mail:</Text>
              <TextInput
                style={styles.txtbx}
                keyboardAppearance='dark'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={handleEmailChange}
                value={email}
              />
            </View>
            <View style = {styles.senha}>
              <Text style = {styles.txtCampos}>Senha:</Text>
              <TextInput
                style={styles.txtbx}
                textContentType='password'
                keyboardAppearance='dark'
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={handleSenhaChange}
                value={senha}
              />
            </View>
            <View style={styles.reSenha}>
              <TouchableHighlight
                style={styles.botaoRecup}
                onPress={()=>navigation.navigate("Recuperação de Senha")}
              >
                <Text style = {styles.txtRecup}>Esqueceu a senha?</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.entrar}>
              <TouchableHighlight
                style={styles.botaoEntra}
                onPress={()=>Logar()}
              >
                <Text style = {styles.txtEntra}>Entrar</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.cadastro}>
              <TouchableHighlight
                style={styles.botaoCadastro}
                onPress={()=>navigation.navigate("Cadastre-se")}
              >
                <Text style = {styles.txtCadastro}>Ainda não sou cadastrado?</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: M_COLOR,
      alignItems: 'center',
      width: '100%',
      padding: 5,
    },
    imageView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    image: {
      resizeMode: 'contain',
      width: 300,
      height: 200,
    },
    corpo: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding:5,
    },
    txtCampos: {
      flex:1,
      color: C_TEXT_COLOR
    },
    txtRecup: {
      fontSize: 17,
      color: C_TEXT_COLOR,
      fontWeight: 'bold'
    },
    txtEntra: {
      backgroundColor: C_COLOR1,
      fontSize: 20,
      fontWeight: 'bold'
    },
    txtbx: {
      flex:2,
      backgroundColor: 'white',
      borderRadius: 10,
      padding:10,
    },
    txttitulo: {
        marginTop: 30,
        color: C_TEXT_COLOR,
        fontSize: 20,
        fontWeight: 'bold'
    },
    txtCadastro: {
        color: C_COLOR2,
        fontSize: 20,
        paddingBottom: 40,
        fontWeight: 'bold'
    },
    email: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
    },
    senha: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding:5,
    },
    reSenha: {
      alignItems: 'center',
      justifyContent: 'center',
      padding:10,
    },
    cadastro: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:50,
    },
    entrar: {
      padding:10,
      alignSelf:'flex-end'
    },
    botaoEntra: {
      backgroundColor: C_COLOR1,
      borderRadius: 10,
      padding: 10,
      width: 250,
      alignItems: 'center',
    },
    botaoRecup: {
      marginLeft: 100
    },
    botaoCadastro: {
      },
  });
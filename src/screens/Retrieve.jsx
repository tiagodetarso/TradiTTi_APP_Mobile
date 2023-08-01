import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableHighlight, Image, StyleSheet, Alert } from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { setEmail } from '../slices/loginSlice'

import { useNavigation } from '@react-navigation/native'

import { C_COLOR1, D_COLOR1, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global'

export default function Retrieve() {

    const navigation = useNavigation()

    const email = useSelector((state) => state.login.email)
    const dispatch = useDispatch()

    const handleEmailChange = (text) => {
        dispatch(setEmail(text))
    }

    function Enviar() {
        fetch (`${URL_API}/customer/sendcode`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ clientNumber:CLIENT_NUMBER, email: email })
        })
        .then(resp => resp.json())
        .then((data) => {
          if (data.msg === `Código enviado para ${email}`) {
            navigation.navigate('Redefinição de Senha')
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
                source={require("../../assets/logo2.png")}
              />
            </View>
          <View style={styles.corpo}>
            <View style ={styles.email}>
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
            <View style={styles.enviar}>
              <TouchableHighlight
                style={styles.botaoEnviar}
                onPress={()=>Enviar()}
              >
                  <Text style = {styles.txtEnviar}>Enviar Cód. de Recup.</Text>
              </TouchableHighlight>
            </View>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
      image: {
        resizeMode: 'stretch',
      },
      container: {
        flex: 1,
        backgroundColor: C_COLOR1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
      },
      corpo: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding:5,
      },
      email: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      },
      txtbx: {
        flex:2,
        backgroundColor: 'white',
        borderRadius: 10,
        padding:10,
      },
      txtCampos: {
        flex:1,
      },
      txtEnviar: {
        backgroundColor: D_COLOR1,
        color: C_TEXT_COLOR,
        fontSize: 20,
        fontWeight: 'bold'
      },
      enviar: {
        padding:10,
        alignSelf:'flex-end'
      },
      botaoEnviar: {
        backgroundColor: D_COLOR1,
        borderRadius: 10,
        padding: 10,
        width: 250,
        alignItems: 'center',
      },
})
import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableHighlight, Image, Alert, StyleSheet} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'

import { setConfirmationCode, clean } from '../slices/confirmationSlice'
import { cleanAll } from '../slices/signupSlice'
import { useNavigation } from '@react-navigation/native'

import { C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global'


export default function Validate() {

    const navigation = useNavigation()

    const email = useSelector((state) => state.signup.email)
    const confirmationCode = useSelector((state) => state.confirmation.confirmationCode)
    const dispatch = useDispatch()

    const handleConfirmationCodeChange = (text) => {
        dispatch(setConfirmationCode(text))
    }

    function submit() {
      fetch (`${URL_API}/customer/validate`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ clientNumber: CLIENT_NUMBER, email: email, confirmationRetrieveCode: confirmationCode })
      })
      .then(resp => resp.json())
      .then((data) => {
        if (data.msg === "Cadastro validado com sucesso!") {
          dispatch(clean())
          dispatch(cleanAll())
          navigation.navigate('Login')
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
                source={require("../../assets/logo3.png")}
              />
            </View>
          <Text style={styles.txtTitulo}>
            {`O código foi enviado para: ${email}`}
          </Text>
          <View style={styles.corpo}>
            <View style ={styles.code}>
                <Text style = {styles.txtCampos}>Código de Validação:</Text>
                <TextInput
                  style={styles.txtbx}
                  keyboardAppearance='dark'
                  keyboardType='numeric'
                  onChangeText={handleConfirmationCodeChange}
                  value={confirmationCode}
                />
            </View>
            <View style={styles.submeter}>
              <TouchableHighlight
                style={styles.botaoSubmeter}
                onPress={()=>submit()}
              >
                  <Text style = {styles.txtSubmeter}>Submeter</Text>
              </TouchableHighlight>
            </View>
          </View>
      </SafeAreaView>
    );
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
      backgroundColor: D_COLOR2,
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
    txtCampos: {
      flex:1,
      color: C_TEXT_COLOR
    },
    txtSubmeter: {
      backgroundColor: D_COLOR1,
      color: C_COLOR2,
      fontSize: 20,
      fontWeight: 'bold'
    },
    txtbx: {
      flex:2,
      backgroundColor: 'white',
      borderRadius: 10,
      padding:10,
    },
    txtTitulo: {
        paddingTop: 30,
        color: C_TEXT_COLOR,
        fontSize: 20,
        textAlign: 'center',
    },
    code: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    submeter: {
      padding:10,
      alignSelf:'flex-end'
    },
    botaoSubmeter: {
      backgroundColor: D_COLOR1,
      borderRadius: 10,
      padding: 10,
      width: 250,
      alignItems: 'center',
    },
  });

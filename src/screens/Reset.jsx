import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableHighlight, Image, StyleSheet, Alert } from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { setPassword, setConfirmPassword, cleanPasses } from '../slices/signupSlice'
import { setConfirmationCode, clean} from '../slices/confirmationSlice'

import { useNavigation } from '@react-navigation/native'

import { C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global'

export default function Reset() {

    const navigation = useNavigation()

    const email = useSelector((state) => state.login.email)
    const code = useSelector((state) => state.confirmation.confirmationCode)
    const newPass = useSelector((state) => state.signup.password)
    const newPassConfirm = useSelector((state) => state.signup.confirmPassword)
    const dispatch = useDispatch()

    const handleCodeChange = (text) => {
        dispatch(setConfirmationCode(text))
    }
    const handlePasswordChange = (text) => {
        dispatch(setPassword(text))
    }
    const handleConfirmPasswordChange = (text) => {
        dispatch(setConfirmPassword(text))
    }

    function Redefinir() {

        const patch = {
            clientNumber: CLIENT_NUMBER,
            email: email,
            retrieveCode: code,
            password: newPass,
            confirmPassword: newPassConfirm
        }

        fetch (`${URL_API}/customer/reset`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(patch)
            })
            .then(resp => resp.json())
            .then((data) => {
                if (data.msg === "Senha redefinida com sucesso!") {
                    dispatch(clean())
                    dispatch(cleanPasses())
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
            <View style={styles.corpo}>
            <View style ={styles.senha}>
                    <Text style = {styles.txtCampos}>Codigo de Redefinição:</Text>
                    <TextInput
                        style={styles.txtbx}
                        keyboardAppearance='dark'
                        keyboardType='numeric'
                        onChangeText={handleCodeChange}
                        value={code}
                    />
                </View>
                <View style ={styles.senha}>
                    <Text style = {styles.txtCampos}>Nova Senha:</Text>
                    <TextInput
                        style={styles.txtbx}
                        keyboardAppearance='dark'
                        keyboardType='default'
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={handlePasswordChange}
                        value={newPass}
                    />
                </View>
                <View style ={styles.senha}>
                    <Text style = {styles.txtCampos}>Repetir Senha:</Text>
                    <TextInput
                        style={styles.txtbx}
                        keyboardAppearance='dark'
                        keyboardType='default'
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={handleConfirmPasswordChange}
                        value={newPassConfirm}
                    />
                </View>
                <View style={styles.redefinir}>
                    <TouchableHighlight
                        style={styles.botaoRedefinir}
                        onPress={()=>Redefinir()}
                    >
                  <Text style = {styles.txtRedefinir}>Redefinir Senha</Text>
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
    txtRedefinir: {
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
    senha: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    redefinir: {
      padding:10,
      alignSelf:'flex-end'
    },
    botaoRedefinir: {
      backgroundColor: D_COLOR1,
      borderRadius: 10,
      padding: 10,
      width: 250,
      alignItems: 'center',
    },
  });
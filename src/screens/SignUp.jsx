import React from 'react';
import { SafeAreaView, View, Image, Text, TextInput, ScrollView, TouchableHighlight, Alert, StyleSheet, Dimensions } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import SelectDropdown from 'react-native-select-dropdown'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import {
    setEmail,
    setFirstName,
    setLastName,
    setPhoneWP,
    setPhoneOther,
    setStreet,
    setNumber,
    setComplement,
    setReference,
    setNeighborhood,
    setCity,
    setState,
    setPostalCode,
    setPassword,
    setConfirmPassword } from '../slices/signupSlice'

import { C_COLOR1, D_COLOR1, C_TEXT_COLOR, URL_API, CLIENT_NUMBER, NEIGHBORHOOD } from '../../global';

const signupWidth = Dimensions.get('screen').width
const signupHeight = Dimensions.get('screen').height

export default function SignUp() {

    const navigation = useNavigation()

    const email = useSelector((state) => state.signup.email)
    const firstName = useSelector((state) => state.signup.firstName)
    const lastName = useSelector((state) => state.signup.lastName)
    const phoneWP = useSelector((state) => state.signup.phoneWP)
    const phoneOther = useSelector((state) => state.signup.phoneOther)
    const street = useSelector((state) => state.signup.street)
    const number = useSelector((state) => state.signup.number)
    const complement = useSelector((state) => state.signup.complement)
    const reference = useSelector((state) => state.signup.reference)
    const neighborhood = useSelector((state) => state.signup.neighborhood)
    const city = useSelector((state) => state.signup.city)
    const state = useSelector((state) => state.signup.state)
    const postalCode = useSelector((state) => state.signup.postalCode)
    const password = useSelector((state) => state.signup.password)
    const confirmPassword = useSelector((state) => state.signup.confirmPassword)

    const dispatch = useDispatch()

    const handleEmailChange = (text) => {
        dispatch(setEmail(text))
    }
    const handleFirstNameChange = (text) => {
        dispatch(setFirstName(text))
    }
    const handleLastNameChange = (text) => {
        dispatch(setLastName(text))
    }
    const handlePhoneWPChange = (text) => {
        dispatch(setPhoneWP(text))
    }
    const handlePhoneOtherChange = (text) => {
        dispatch(setPhoneOther(text))
    }
    const handleStreetChange = (text) => {
        dispatch(setStreet(text))
    }
    const handleNumberChange = (text) => {
        dispatch(setNumber(text))
    }
    const handleComplementChange = (text) => {
        dispatch(setComplement(text))
    }
    const handleReferenceChange = (text) => {
        dispatch(setReference(text))
    }
    const handleNeighborhoodChange = (text) => {
        dispatch(setNeighborhood(text))
    }
    const handleCityChange = (text) => {
        dispatch(setCity(text))
    }
    const handleStateChange = (text) => {
        dispatch(setState(text))
    }
    const handlePostalCodeChange = (text) => {
        dispatch(setPostalCode(text))
    }
    const handlePasswordChange = (text) => {
        dispatch(setPassword(text))
    }
    const handleConfirmPasswordChange = (text) => {
        dispatch(setConfirmPassword(text))
    }

    function submit() {

        const post = {
            clientNumber: CLIENT_NUMBER,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneWP: phoneWP,
            phoneOther: phoneOther,
            street: street,
            number: number,
            complement: complement,
            reference: reference,
            neighborhood: neighborhood,
            city: city,
            state: state,
            postalCode: postalCode,
            password: password,
            confirmPassword: confirmPassword
        }

        fetch (`${URL_API}/customer/register`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(post),
        })
        .then(resp => resp.json())
        .then((data) => {
            Alert.alert(data.msg)
            if (data.msg === `Código de confirmação enviado para ${email}` ) {
                navigation.navigate("Validação de Cadastro")
            }
            if (data.msg === `E-mail já cadastrado. Código de confirmação reenviado`) {
                navigation.navigate("Validação de Cadastro")
            }
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
            <ScrollView style={styles.corpo}>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Nome:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleFirstNameChange}
                    value={firstName}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Sobrenome:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleLastNameChange}
                    value={lastName}
                    />
                </View>
                <View style={styles.rowTxtBox}>
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
                <Text style={styles.subTitle}>Preencha, ao menos, um dos campos abaixo:</Text>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Telefone (WhatsApp):</Text>
                    <TextInputMask
                    style={styles.txtbx}
                    type = {'cel-phone'}
                    keyboardAppearance='dark'
                    keyboardType='phone-pad'
                    onChangeText={handlePhoneWPChange}
                    value={phoneWP}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Telefone (outro):</Text>
                    <TextInputMask
                    style={styles.txtbx}
                    type = {'cel-phone'}
                    keyboardAppearance='dark'
                    keyboardType='phone-pad'
                    onChangeText={handlePhoneOtherChange}
                    value={phoneOther}
                    />
                </View>
                <Text style={styles.subTitle}>Endereço (*Preenchimento Obrigatório):</Text>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Rua/Avenida:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleStreetChange}
                    value={street}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Número:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='numeric'
                    onChangeText={handleNumberChange}
                    value={number}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Complemento:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleComplementChange}
                    value={complement}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>Referência:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleReferenceChange}
                    value={reference}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Bairro ou Distrito:</Text>
                    <SelectDropdown
                        dropdownStyle={styles.dropdown}
                        buttonStyle={styles.dropdownButton}
                        defaultButtonText='Aperte aqui para escolher'
                        data={NEIGHBORHOOD}
                        onSelect={(selectedItem) => dispatch(setNeighborhood(selectedItem))}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Cidade:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='words'
                    onChangeText={handleCityChange}
                    value={city}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Estado (sigla):</Text>
                    <TextInput
                    style={styles.txtbx}
                    maxLength={2}
                    keyboardAppearance='dark'
                    keyboardType='default'
                    autoCapitalize='characters'
                    onChangeText={handleStateChange}
                    value={state}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>CEP:</Text>
                    <TextInputMask
                    style={styles.txtbx}
                    type={'zip-code'}
                    keyboardAppearance='dark'
                    keyboardType='numeric'
                    onChangeText={handlePostalCodeChange}
                    value={postalCode}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Senha:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    value={password}
                    />
                </View>
                <View style={styles.rowTxtBox}>
                    <Text style = {styles.txtCampos}>*Repete Senha:</Text>
                    <TextInput
                    style={styles.txtbx}
                    keyboardAppearance='dark'
                    secureTextEntry={true}
                    onChangeText={handleConfirmPasswordChange}
                    value={confirmPassword}
                    />
                </View>
                <View style={styles.cadastrar}>
                    <TouchableHighlight
                        style={styles.botao}
                        onPress={() => submit()}
                    >
                        <Text style = {styles.txtBotao}>Cadastrar Cliente</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
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
        width: signupWidth,
        padding: signupWidth/45,
    },
    corpo: {
        flex:1,
        width: signupWidth,
        padding:signupWidth/90,
    },
    txtCampos: {
        flex:1,
    },
    txtbx: {
        flex:2,
        backgroundColor: 'white',
        borderRadius: signupWidth/30,
        padding:signupWidth/45,
    },
    rowTxtBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: signupWidth/45,
    },
    subTitle: {
        paddingTop: signupWidth/20,
        fontWeight: 'bold',
    },
    txtBotao: {
        backgroundColor: D_COLOR1,
        fontSize: signupWidth/20,
        fontWeight: 'bold',
        color: C_TEXT_COLOR,
    },
    cadastrar: {
        padding:signupWidth/45,
        alignSelf:'center'
    },
    botao: {
        backgroundColor: D_COLOR1,
        borderRadius: signupWidth/30,
        padding: signupWidth/45,
        width: signupWidth/1.5,
        alignItems: 'center',
    },
    dropdownButton: {
        flex:2,
        backgroundColor: 'white',
        borderRadius: signupWidth/45,
        padding:signupWidth/150,
        height: signupHeight/25,
    },
    dropdown: {
        flex:2,
        backgroundColor: 'white',
        borderRadius:signupWidth/45,
        padding:signupWidth/45,
        width: signupWidth/1.7,
        justifyContent: 'center'
    },
})


import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import email from 'react-native-email'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR } from '../../global';

export default function Status() {

    const url_github = 'https://github.com/tiagodetarso'
    const url_linkedin = 'https://www.linkedin.com/in/tiago-de-tarso-raggiotto-goncalves-6375223b/'
    const whatsapp_number = '+5541999098911'
    const email1 = 'ttrgoncalves@gmail.com'
    const email2 = 'titarso@yahoo.com.br'

    function handleGithubPress() {
        Linking.openURL(url_github)
    }

    function handleLinkedinPress() {
        Linking.openURL(url_linkedin)
    }
    
    function handleWhatsAppPress() {
        const message = 'Olá...!'
        const url = `whatsapp://send?phone=${whatsapp_number}&text=${encodeURIComponent(message)}`

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url)
                } else {
                    throw new Error("O WhatsApp não esta instalado neste telefone.")
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function handleEmail () {
        const to = [email1, email2]
        email(to, {
            subject:"Contato a partir do App Boston Esfiharia",
            checkCanOpen: false
        }).catch(console.error)
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.onlyView}>
                <Text style={styles.txtTitle}>DESENVOLVIDO POR:</Text>
                <Text style={styles.txtNome}>Tiago de Tarso Raggiotto Gonçalves</Text>
                <Text style={styles.txtQuali}>Técnico em Desenvolvimento de Sistemas</Text>
                <Text style={styles.txtQuali}>Engenheiro Mecânico</Text>
                <View style={styles.contact}>
                    <TouchableOpacity 
                        onPress={handleGithubPress}
                        style={styles.btn}
                    >
                        <Icon 
                            name='github'
                            color={C_COLOR1}
                            size={50}

                        />
                        <Text style={styles.txtContact}>github</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={handleLinkedinPress}
                        style={styles.btn}
                    >
                        <Icon 
                            name='linkedin'
                            color={C_COLOR1}
                            size={50}

                        />
                        <Text style={styles.txtContact}>linkedin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={handleWhatsAppPress}
                        style={styles.btn}
                    >
                        <Icon 
                            name='whatsapp'
                            color={C_COLOR1}
                            size={50}

                        />
                        <Text style={styles.txtContact}>whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={handleEmail}
                        style={styles.btn}
                    >
                        <Icon 
                            name='envelope'
                            color={C_COLOR1}
                            size={50}

                        />
                        <Text style={styles.txtContact}>e-mail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: D_COLOR2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
        textAlign: 'left'
    },
    onlyView: {
        marginLeft: 40,
    },
    txtTitle: {
        color: C_TEXT_COLOR,
        fontSize: 30,
        fontWeight: 'bold',
        paddin:5,
    },
    txtNome: {
        color: M_COLOR,
        fontSize: 18,
        padding:5,
    },
    txtQuali: {
        fontSize:15,
        color: C_COLOR2,
        paddingLeft:5,
    },
    contact: {
        flexDirection: 'row',
        marginTop:10,
        padding:5,
        justifyContent: 'space-between'
    },
    txtContact: {
        fontSize:15,
        color: C_COLOR1,
        textAlign: 'center'
    },
    btn: {
        alignItems: 'center'
    }
})
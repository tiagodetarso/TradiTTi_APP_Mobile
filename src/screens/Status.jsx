import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import email from 'react-native-email'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR } from '../../global';

const statusWidth = Dimensions.get('screen').width
const statusHeight = Dimensions.get('screen').height

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
                <View style={styles.contact}>
                    <TouchableOpacity 
                        onPress={handleGithubPress}
                        style={styles.btn}
                    >
                        <Icon 
                            name='github'
                            color={C_COLOR1}
                            size={statusWidth/8}

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
                            size={statusWidth/8}

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
                            size={statusWidth/8}

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
                            size={statusWidth/8}

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
        width: statusWidth,
        padding: statusWidth/45,
        textAlign: 'left'
    },
    onlyView: {
        marginLeft: statusWidth/12,
    },
    txtTitle: {
        color: C_TEXT_COLOR,
        fontSize: statusWidth/15,
        fontWeight: 'bold',
        padding:statusWidth/90,
    },
    txtNome: {
        color: M_COLOR,
        fontSize: statusWidth/25,
        padding:statusWidth/90,
    },
    txtQuali: {
        fontSize:statusWidth/30,
        color: C_COLOR2,
        paddingLeft:statusWidth/90,
    },
    contact: {
        flexDirection: 'row',
        marginTop:statusWidth/45,
        padding:statusWidth/90,
        justifyContent: 'space-between'
    },
    txtContact: {
        fontSize:statusWidth/30,
        color: C_COLOR1,
        textAlign: 'center'
    },
    btn: {
        alignItems: 'center'
    }
})
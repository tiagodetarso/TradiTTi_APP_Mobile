import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { C_TEXT_COLOR } from '../../global';

const socialWidth = Dimensions.get('screen').width

export default function Social({color, corTexto}) {

    const url_facebook = 'https://www.facebook.com/Bostonesfihariaastorga/'
    const url_instagram = 'https://www.instagram.com/bostonesfihariaastorga/'
    const url_map = 'https://www.google.com/maps/d/u/0/edit?mid=1in_my5LjDJoWUq8d4wUub76A5UN5xoE&hl=pt-PT&ll=-23.225880450611243%2C-51.66405368570667&z=17'
    const whatsapp_number = '+5544997006598'

    function handleFacebookPress() {
        Linking.openURL(url_facebook)
    }
    function handleInstagramPress() {
        Linking.openURL(url_instagram)
    }
    function handleMapPress() {
        Linking.openURL(url_map)
    }
    function handleWhatsAppPress() {
        const message = 'Escreva aqui sua mensagem!'
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

    return(
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.botao}
                onPress={handleFacebookPress}
            >
                <Icon 
                    name='facebook'
                    color={color}
                    size={socialWidth/10}

                />
                <Text style={{color:corTexto, fontSize:socialWidth/40, fontWeight:'bold'}}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.botao}
                onPress={handleInstagramPress}
            >
                <Icon 
                    name='instagram' 
                    color={color}
                    size={socialWidth/10}
                />
                <Text style={{color:corTexto, fontSize:socialWidth/40, fontWeight:'bold'}}>Instagram</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.botao}
                onPress={handleWhatsAppPress}
            >
                <Icon 
                    name='whatsapp' 
                    color={color}
                    size={socialWidth/10}
                />
                <Text style={{color:corTexto, fontSize:socialWidth/40, fontWeight:'bold'}}>(44) 9 9700-6598</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.botao}
                onPress={handleMapPress}
            >
                <Icon 
                    name='map' 
                    color={color}
                    size={socialWidth/10}
                />
                <Text style={{color:corTexto, fontSize:socialWidth/40, fontWeight:'bold'}}>Localização</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding:socialWidth/45,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    botao: {
        paddingHorizontal: socialWidth/50,
        alignItems: 'center'
    }
})
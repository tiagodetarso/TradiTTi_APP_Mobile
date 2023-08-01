import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Carousel from '../components/Carousel'

import { C_COLOR1, M_COLOR, D_COLOR2, D_TEXT_COLOR, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global';

import Social from '../components/Social';

export default function Opegning() {

    const navigation = useNavigation()

    const [currentDay, setCurrentDay] = useState("")
    const [promotionImage, setPromotionImage] = useState("")
    const [product, setProduct] = useState("")
    const [price, setPrice] = useState("")
    const [unity, setUnity] = useState("")

    const numberWeekDay = {
        0:"Domingo",
        1:"Segunda-Feira",
        2:"Terça-Feira",
        3:"Quarta-Feira",
        4:"Quinta-Feira",
        5:"Sexta-Feira",
        6:"Sábado"
    }

    useEffect(() => {
        let fullDate = new Date()
        setCurrentDay(fullDate.getDay())
        if (currentDay !== 1) {
            PromoImage(currentDay)
        }
        
    },)
      
    function PromoImage(day) {
        fetch (`${URL_API}/product/promotionlist`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({clientNumber: CLIENT_NUMBER})
        })
        .then(resp => resp.json())
        .then((data) => {
            if (data.msg === "Pesquisa bem sucedida!") {
                const content = data.content
                for ( let i = 0; i < content.length; i++) {
                    if (content[i].fixPromotionDay === day) {
                        setPromotionImage(content[i].promotionImage)
                        setProduct(`${content[i].subType} de ${content[i].specification}`)
                        setPrice(`R$ ${content[i].promotionValue.toFixed(2).replace('.',',')}`)
                        setUnity(content[i].unity)
                        return
                    }
                }
            } 
        })
        .catch((err) => console.log(err))
    }

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.corpo}>
                <Image
                    style={styles.image}
                    source={require("../../assets/logoBostonAlt.jpg")}
                />
                <Text style={styles.txtMsg}>TradiTTi App</Text>
                <View style={styles.carousel}>
                    <Carousel />
                </View>
                <View style={styles.vwAcess}>
                    <TouchableHighlight
                        style={styles.btnAcess}
                        onPress={()=>navigation.navigate("Login")}
                    >
                        <Text style = {styles.txtAcess}>Fazer um pedido</Text>
                    </TouchableHighlight>
                </View>
                <Text style={styles.txtCorpo}>Contate-nos</Text>
                <Social />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: M_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    corpo: {
        width: '100%',
      },
    image: {
        resizeMode: 'contain',
        width: 300,
        height: 180,
        alignSelf: 'center',
        borderRadius:20
    },
    txtMsg: {
        marginBottom: 10,
        fontSize: 20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    txtCorpo: {
        padding: 5,
        marginTop: 10,
        fontSize: 20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    txtSub: {
        fontSize: 20,
        color: C_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    txtEsf: {
        fontSize: 18,
        color: D_TEXT_COLOR,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    spam: {
        fontSize: 15,
        color: D_TEXT_COLOR,
        alignSelf: 'center'
    },
    vwSub: {
        width: '100%',
    },
    vwAcess: {
        marginTop:15,
        padding:10,
        alignSelf:'center'
    },
    btnAcess: {
        backgroundColor: C_COLOR1,
        borderRadius: 10,
        padding: 5,
        width: 300,
        height: 40,
        alignItems: 'center',
    },
    txtAcess: {
        backgroundColor: C_COLOR1,
        fontSize: 20,
        fontWeight: 'bold'
    },
    carousel: {
        maxHeight: 300

    }
})

//<ScrollView style={styles.corpo}>
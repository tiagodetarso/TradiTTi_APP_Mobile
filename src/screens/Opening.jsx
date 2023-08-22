import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Carousel from '../components/Carousel'

import { C_COLOR1, C_COLOR2, M_COLOR, D_TEXT_COLOR, C_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global';

import Social from '../components/Social';

const openingWidth = Dimensions.get('screen').width
const openingHeight = Dimensions.get('screen').height

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
                <Social color={C_COLOR2} txtColor={C_TEXT_COLOR}/>
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
        width: openingWidth,
    },
    corpo: {
        width: openingWidth,
      },
    image: {
        resizeMode: 'contain',
        width: openingWidth/1.5,
        height: openingHeight/5,
        alignSelf: 'center',
        borderRadius:openingWidth/90
    },
    txtMsg: {
        marginBottom: openingHeight/150,
        fontSize: openingWidth/20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    txtCorpo: {
        padding: openingWidth/90,
        marginTop: openingWidth/45,
        fontSize: openingWidth/20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    txtSub: {
        fontSize: openingWidth/20,
        color: C_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    txtEsf: {
        fontSize: openingWidth/22,
        color: D_TEXT_COLOR,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    spam: {
        fontSize: openingWidth/30,
        color: D_TEXT_COLOR,
        alignSelf: 'center'
    },
    vwSub: {
        width: openingWidth,
    },
    vwAcess: {
        marginTop:openingWidth/30,
        padding:openingWidth/45,
        alignSelf:'center'
    },
    btnAcess: {
        backgroundColor: C_COLOR1,
        borderRadius: openingWidth/45,
        padding: openingWidth/90,
        width: openingWidth/1.5,
        height: openingHeight/20,
        alignItems: 'center',
    },
    txtAcess: {
        backgroundColor: C_COLOR1,
        fontSize: openingWidth/20,
        fontWeight: 'bold'
    },
    carousel: {
        maxHeight: openingHeight/3

    }
})

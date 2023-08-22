import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, Dimensions } from 'react-native';

import { C_COLOR1, D_COLOR2, D_TEXT_COLOR, URL_API, CLIENT_NUMBER } from '../../global';

import fechados from '../../assets/fechadoBoston.jpg'

import Header from '../components/Header';
import Social from '../components/Social';

const homeWidth = Dimensions.get('screen').width
const homeHeight = Dimensions.get('screen').height

export default function Home() {

    const [currentDay, setCurrentDay] = useState("")
    const [promotionImage, setPromotionImage] = useState("")
    const [product, setProduct] = useState("")
    const [price, setPrice] = useState("")
    const [unity, setUnity] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    numberWeekDay = {
        0:"Domingo",
        1:"Segunda-Feira",
        2:"Terça-Feira",
        3:"Quarta-Feira",
        4:"Quinta-Feira",
        5:"Sexta-Feira",
        6:"Sábado"
    }

    useEffect(() => {
        const interval = setInterval(() => {
            IsOpen(CLIENT_NUMBER)
        },30000)
        return () => clearInterval(interval)
    },[])
    
    
    useEffect(() => {
        IsOpen(CLIENT_NUMBER)
        let fullDate = new Date()
        setCurrentDay(fullDate.getDay())
        if (currentDay !== 1) {
            PromoImage(currentDay)
        } else {
            setPromotionImage(fechados)
        }
    })

    function IsOpen(numberClient) {
        fetch (`${URL_API}/client/isopen`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({clientNumber: numberClient})
            })
            .then(resp => resp.json())
            .then((data) => {
                if (data.msg === `Pesquisa realizada com sucesso!`) {
                    setIsOpen(data.content.isOpen)
                }
            })
            .catch((err) => console.log(err))
    }

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
            <View style={styles.upView}>
                <Header />
                <Text style={styles.txtMsg}>Seja bem-vindo(a)!</Text>
            </View>
            <ScrollView style={styles.corpo}>
                {
                    (currentDay !== 1)
                    ?
                    <>
                        <Text style={styles.txtCorpo}>ESFIHA DO DIA!</Text>
                        <Text style={styles.txtCorpo}>{numberWeekDay[currentDay]}</Text>
                        <View style={styles.vwSub}>
                            <Text style={styles.txtSub}>{product}</Text>
                            <Text style={styles.txtSub}>{`${price} / ${unity}`}</Text>
                        </View>
                        <View style={styles.image}>
                            <Image
                                style={styles.image}
                                source={{uri:`data:image/jpeg;base64,${promotionImage}`}}
                            />
                        </View>
                    </>
                    :
                    <>
                        <Text style={styles.txtCorpo}>ESTAMOS FECHADOS!</Text>
                        <Text style={styles.txtCorpo}>{numberWeekDay[currentDay]}</Text>
                        <View style={styles.image}>
                            <Image
                                style={styles.image}
                                source={promotionImage}
                            />
                        </View>
                    </>

                }
                <View style={styles.instruction}>
                    {
                        isOpen === true
                        ?
                        <>
                            <Text style={styles.txtAberta}>LOJA ABERTA</Text>
                            <Text style={styles.txtInstruction}>Clique na aba "Escolher" para selecionar os produtos do seu pedido.</Text>
                        </>
                        :
                        <>
                            <Text style={styles.txtFechada}>LOJA FECHADA</Text>
                            <Text style={styles.txtInstruction}>Normalmente, recebemos pedidos entre Terça-feira e Domingo, das 18:30 às 22:30.</Text>
                        </>
                    }
                </View>
                <Text style={styles.txtCorpo}>Contate-nos</Text>
                <Social color={D_COLOR2} txtColor={D_TEXT_COLOR}/>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: C_COLOR1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: homeWidth,
        padding: homeWidth/45,
    },
    upView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: homeWidth,
    },
    corpo: {
        width: homeWidth,
        padding: homeWidth/90,
      },
    image: {
        resizeMode: 'contain',
        width: homeWidth*0.9,
        height: homeHeight/3.75,
        alignSelf: 'center',
        borderRadius: homeWidth/10,
    },
    txtMsg: {
        padding: homeWidth/45,
        fontSize: homeWidth/20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
    },
    txtCorpo: {
        padding: homeWidth/90,
        fontSize: homeWidth/20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    txtSub: {
        padding: homeWidth/90,
        fontSize: homeWidth/25,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    spam: {
        padding: homeWidth/90,
        fontSize: homeWidth/25,
        color: D_TEXT_COLOR,
        alignSelf: 'center',
    },
    vwSub: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        width: homeWidth,
        flexWrap: 'wrap'
    },
    txtInstruction: {
        fontSize: homeWidth/24,
        textAlign: 'justify',
    },
    instruction: {
        alignItems: 'center',
        margin: homeWidth/45,
        padding:homeWidth/45
    },
    txtAberta: {
        color: 'green',
        fontSize: homeWidth/22,
        fontWeight: 'bold',
        textAlign: 'justify',
    },
    txtFechada: {
        color: 'red',
        fontSize: homeWidth/22,
        fontWeight: 'bold',
        textAlign: 'justify',
    }
})


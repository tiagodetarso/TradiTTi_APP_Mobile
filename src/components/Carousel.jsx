import React, { useState, useEffect, useRef}  from 'react'
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native'
import Animated, { Layout, FadeInLeft, FadeOutRight } from 'react-native-reanimated'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR } from '../../global';

import todoDia from '../../assets/todoDiaBoston.jpg'
import esfihaDoce from '../../assets/esfihaChocoBoston.jpg'
import tilapia from '../../assets/tilapiaBoston.jpg'
import alcatra from '../../assets/alcatraBoston.jpg'
import pastel from '../../assets/pastelBoston.jpg'
import frente from '../../assets/bostonFrente.jpg'
import esfihas from '../../assets/maisEsfihasBoston.png'



const carouselWidth = Dimensions.get('screen').width

export default function Carousel() {

    const carouselData = [
        {
            img: todoDia,
        },
        {
            img: esfihas,
        },
        {
            img: esfihaDoce,
        },
        {
            img: tilapia,
        },
        {
            img: alcatra,
        },
        {
            img: pastel,
        },
        {
            img: frente,
        }
    ]

    return (
        <>
            <FlatList
                data={carouselData}
                renderItem = {({item, index}) => (
                    <View style={styles.vwItem}>
                        <Image 
                            source={item.img}
                            style={styles.image}
                        />
                        <Text style={styles.subtitle}>{item.txt}</Text>
                    </View>
                )}
                horizontal
                keyExtractor={(item, index) => index}
            />
        </>
    )
}

const styles = StyleSheet.create({
    vwItem: {
        backgroundColor: M_COLOR,
        width: carouselWidth,
        alignItems: 'center',
        height: 300,
        padding:5,
        marginBottom: 40,
    },
    image: {
        resizeMode:'contain',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: C_TEXT_COLOR
    }
})
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Avatar, MD3LightTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { C_COLOR2, D_TEXT_COLOR } from '../../global';

const headerWidth = Dimensions.get('screen').width

export default function Header() {

    const customer = useSelector((state) => state.customer.customer)

    const name = customer.name.substr(0,customer.name.indexOf(' ')) ? customer.name.substr(0,customer.name.indexOf(' ')) : ""

    let arrayNames = customer.name.split(' ')
    const lastName = arrayNames[arrayNames.length - 1]

    const l1 = name.charAt(0)
    const l2 = lastName.charAt(0)

    const avatarLabel = l1+l2

    return (
        <View style={styles.avatar}>
            <Avatar.Text
                style={styles.avatarText}
                size={headerWidth/10}
                color={C_COLOR2}
                label={avatarLabel}
                labelStyle='bold'
                theme={MD3LightTheme}
            />
            <Text style={styles.txtNome}>Olá, {name}!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        flexDirection:'row',
        padding:headerWidth/45,
    },
    avatarText: {
        justifyContent:'flex-start',
    },
    txtNome: {
        justifyContent:'flex-start',
        padding:headerWidth/45,
        fontStyle:'italic',
        fontWeight:'bold',
        fontSize:headerWidth/30,
        color: D_TEXT_COLOR,
    },
})
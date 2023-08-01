import React, { useEffect, useState, memo } from 'react';
import { SafeAreaView, View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { C_COLOR1, M_COLOR, C_TEXT_COLOR, D_TEXT_COLOR, URL_API, CLIENT_NUMBER} from '../../global';

import Header from '../components/Header';

const Choice = memo(() => {

    const agora = new Date()

    const navigation = useNavigation()

    const [ searchText, setSearchText ] = useState('')
    const [ products, setProducts ] = useState([])
    const [ productsArray, setProductsArray ] = useState([])
    const [ selectedId, setSelectedId ] = useState([])

    function Listar() {
        fetch (`${URL_API}/product/mobilelist`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({clientNumber: CLIENT_NUMBER})
        })
        .then(resp => resp.json())
        .then((data) => {
            if (data.msg === "Pesquisa bem sucedida!") {
                setProducts(data.content)
            } 
        })
        .catch((err) => console.log(err))
    }

    function moveArrayElement(arr, from, to) {
        var el = arr[from]
        arr.splice(from, 1)
        arr.splice(to, 0, el)
    }

    useEffect(() => {
        Listar()
    }, [])

    useEffect(() => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].title === 'esfiha' ) {
                for (let j = 0; j < products[i].data.length; j++) {
                    if (products[i].data[j].fixPromotionDay === agora.getDay()) {
                        moveArrayElement(products[i].data, products[i].data.indexOf(products[i].data[j]), 0)
                    }
                }
            }
        }
        setProductsArray(products)
    }, [products])

    useEffect(() => {
        if (searchText === '') {
            setProductsArray(products)
        } else {
            const list = []
            for (let j=0; j < productsArray.length; j++) {
                for (let i=0; i < productsArray[j].data.length; i++){
                    list.push(productsArray[j].data[i])
                } 
            }
            setProductsArray(
                [{
                    title:"Pesquisando Produto",
                    data: 
                        list.filter(item => {
                            if ((item.specification).indexOf(searchText) > -1 ) {
                                return true
                            } else {
                                return false
                            }
                        })
                }]
            )
        }
    }, [ searchText ])

    const Item = ({item, onPress, backgroundColor, textColor, promoTextColor}) => {
        return (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <View style={styles.vwSub}>
                {
                    (item.type === 'bebida')
                    ?
                    <>
                    <Text style={[styles.txtItem, {color: textColor}]}>{`${item.specification} ${item.unity}`}</Text>
                    <Text style={[styles.txtItem, {color: textColor}]}>{`R$ ${item.value.toFixed(2).replace('.',',')}`}</Text>
                    </>
                    :
                        ((item.fixPromotionDay === agora.getDay()) || (item.promotionFinalDate > agora))
                        ?
                        <>
                        <Text style={[styles.txtItem, {color: promoTextColor}]}>{`${item.subType} - ${item.specification} (PROMO)`}</Text>
                        <Text style={[styles.txtItem, {color: promoTextColor}]}>{`R$ ${item.promotionValue.toFixed(2).replace('.',',')}`}</Text>
                        </>
                        :
                        <>
                        <Text style={[styles.txtItem, {color: textColor}]}>{`${item.subType} - ${item.specification}`}</Text>
                        <Text style={[styles.txtItem, {color: textColor}]}>{`R$ ${item.value.toFixed(2).replace('.',',')}`}</Text>
                        </>
                }
            </View>
        </TouchableOpacity>
    )}

    function handleItemPress (item) {
        setSelectedId(item._id)
        navigation.navigate("Produto Selecionado",{paramKey: item})
    }

    const renderItem = ({item}) => {
        const backgroundColor = item.fixPromotionDay === agora.getDay() ? C_COLOR1 : M_COLOR
        const color = item._id === selectedId ? D_TEXT_COLOR : C_TEXT_COLOR

        return (
            <Item
                item={item}
                onPress={() => handleItemPress(item)}
                backgroundColor={backgroundColor}
                textColor={color}
                promoTextColor={'#00FA9A'}
            />
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.upView}>
                <Header />
                <Text style={styles.txtMsg}>Faça sua escolha!</Text>
            </View>
            <View style={styles.searchArea}>
                <TextInput 
                    style={styles.input}
                    placeholder='Pesquise um produto'
                    placeholderTextColor={M_COLOR}
                    value={searchText}
                    autoCapitalize='none'
                    onChangeText={(t) => setSearchText(t)}
                />
            </View>
                <FlatList
                    style={styles.outro}
                    data={productsArray}
                    renderItem={({item: item}) => (
                        <>
                            <Text style={styles.txtMsg}>{item.title}</Text>
                            <FlatList
                                key={item._id}
                                data={item.data}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                extraData={selectedId}
                            />
                        </>
                    )}
                    keyExtractor={item => item.title}
                />
            
        </SafeAreaView>
    )
})

export default Choice;


    
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: M_COLOR,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 10,
    },
    upView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    corpo: {
        padding: 10,
    },
    outro: {
        alignSelf: 'center',
        width: '100%',
        maxHeigth: 100,
    },
    txtMsg: {
        padding: 10,
        fontSize: 20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    txtItem: {
        padding: 5,
        fontSize: 13,
        color: D_TEXT_COLOR,
    },
    vwSub: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        padding: 5
    },
    txtbx: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        width: 30,
    },
    searchArea: {
        margin:10,
        backgroundColor: '#ffffff',
        width: "80%",
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
    },
    input: {
        fontSize: 17,
        padding: 10,
    }
})
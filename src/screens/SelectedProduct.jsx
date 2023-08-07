import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, TextInput, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux'
import { addItem } from '../slices/demandSlice'
import { Button, Dialog, Portal} from 'react-native-paper'
import ModalSelect from '../components/ModalSelect'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR, URL_API } from '../../global';

export default function SelectedProduct ({navigation, route }) {

    const product = route.params.paramKey

    const agora = new Date()

    const dispatch = useDispatch()
    const demandItens = useSelector((state) => state.demand.demandItens)

    const [ image, setImage ] = useState("")
    const [ quantity, setQuantity ] = useState("0")
    const [ subtotal, setSubtotal ] = useState(0)
    const [ visible, setVisible ] = useState(false)
    const [ extras, setExtras ] = useState([])

    function HideDialog() {
        setVisible(false)
    }

    function ShowDialog() {
        setVisible(true)
    }

    function Plus () {
        setQuantity(Number(quantity)+1)
    }

    function Minus () {
        quantity > 0 ? setQuantity(Number(quantity)-1) : quantity
    }

    function GetImage(productId) {
        fetch (`${URL_API}/product/image`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: productId})
        })
        .then(resp => resp.json())
        .then((data) => {
            if (data.msg === "Pesquisa bem sucedida!") {
                setImage(data.content)
            } 
        })
        .catch((err) => console.log(err))
    }

    useEffect(() => {
        GetImage(product._id)
    })
    
    function SubTotal (product) {
        product.fixPromotionDay == agora.getDay()
        ?
        setSubtotal(Number(quantity)*product.promotionValue)
        :
        setSubtotal(Number(quantity)*product.value)
    }

    useEffect(() => {
        SubTotal(product)
    },[quantity])

    function AddToCart() {
        if (quantity == 0) {
            Alert.alert('Você não preencheu a quantidade')
        } else {
            setVisible(true)
            dispatch(addItem({
                id: product._id,
                subType: product.subType,
                specification: product.specification,
                unity: product.unity,
                value: product.value,
                fixPromotionDay: product.fixPromotionDay,
                promotionValue: product.promotionValue,
                quantity: quantity,
                extra: extras
            }))
        }
        console.log(demandItens)
    }

    function ModalToSelected (array) {
        setExtras(array)
        setVisible(false)
    }

    function AdditionalMessage() {
        let message = "Adicionais:\n"
        for (const adicional of extras) {
            let subMessage = `-> 1 x adicional de - `
            let item = ""
            for (const adicionalItem of adicional.add) {
                item += `${adicionalItem} - `
            }
            subMessage += `${item}\n`
            message += `${subMessage}`
        }
        if (message === "Adicionais:\n") {
            message += "Não foram acrescentados adicionais"
        }
        return message
    }

    function Return() {
        navigation.navigate("Boston Esfiharia")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.vwImage}>
                {
                    image
                    ?
                    <Image
                        style={styles.image}
                        source={{uri:`data:image/jpeg;base64,${image}`}}
                    />
                    :
                    <Text style={styles.txtNoImage}>Protudo sem imagem</Text>
                }
            </View>
            <Text style={styles.txtMsg}>{`${product.subType} - ${product.specification}`}</Text>
            <Text style={styles.txtSubMsg}>{`(${product.subSpecification})`}</Text>
            {
                (product.fixPromotionDay === agora.getDay())
                ?
                <Text style={styles.txtMsg}>{`R$ ${product.promotionValue.toFixed(2).replace('.',',')} / ${product.unity}`}</Text>
                :
                <Text style={styles.txtMsg}>{`R$ ${product.value.toFixed(2).replace('.',',')} / ${product.unity}`}</Text>
            }
            <View style={styles.vwSub}>
                <TouchableOpacity
                    style={styles.btnQtt}
                >
                    <Icon 
                        name='minus'
                        color={'red'}
                        size={30}
                        padding={5}
                        onPress={Minus}
                    />
                </TouchableOpacity>
                <TextInput
                    inputmode='nunmeric'
                    keyboardType='numeric'
                    style={styles.txtInput}
                    onChangeText={text => setQuantity(text)}
                    value={quantity.toString()}
                    maxLength={2}
                />
                <TouchableOpacity
                    style={styles.btnQtt}
                >
                    <Icon 
                        name='plus'
                        color={'green'}
                        size={30}
                        padding={5}
                        onPress={Plus}
                    />
                </TouchableOpacity>
            </View>
            {
                product.subType === 'esfiha' || product.subType === 'esfiha massa intg'
                ?
                <ModalSelect produto={'adicional es'} qtt={quantity} modalToSelected={ModalToSelected} txt="Deseja acrescentar adicionais?" />
                :
                    product.subType === 'esfiha doce'
                    ?
                    <ModalSelect produto={'adicional ed'} qtt={quantity} modalToSelected={ModalToSelected} txt="Deseja acrescentar adicionais?" />
                    :
                        product.subType === 'pastel doce'
                        ?
                        <ModalSelect produto={'adicional pd'} qtt={quantity} modalToSelected={ModalToSelected} txt="Deseja acrescentar adicionais?" />
                        :
                        <></>
            }
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={HideDialog}>
                        <Dialog.Title>Sucesso!</Dialog.Title>
                        <Dialog.Content>
                            <Text>{`Adicionado ao pedido:\n ${quantity} x ${product.subType}(s) - ${product.specification}\n\n${AdditionalMessage()}`}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => navigation.navigate("Escolher")}>Continuar Escolhendo</Button>
                            <Button onPress={() => navigation.navigate("Pedido")}>Finalizar Pedido</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
            <View style={styles.vwSbt}>
                <Text style={styles.txtMsg}>{`Subtotal para este item:`}</Text>
                <Text style={styles.txtMsg}>{`R$ ${subtotal.toFixed(2).replace('.',',')}`}</Text>
            </View>
            <View style={styles.vwBtn}>
                <TouchableHighlight
                    style={styles.btnAdd}
                    onPress={AddToCart}
                >
                    <Text style = {styles.txtBtn}>Adicionar ao Pedido</Text>
                </TouchableHighlight>
                <TouchableOpacity
                    style={styles.btnContinue}
                    onPress={Return}
                >
                    <Text style={styles.txtBtnCont}>Voltar para a lista de produtos</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 10,
    },
    txtMsg: {
        padding: 5,
        fontSize: 20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    txtSubMsg: {
        padding: 5,
        fontSize: 15,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
    },
    vwSub: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
    },
    btnQtt: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
    },
    btnContinue: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 20,
    },
    txtInput: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: 60,
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: '#EEE8AA',
        borderRadius: 15,
    },
    vwImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 5,
    },
    image: {
        resizeMode: 'contain',
        width: 300,
        height: 200,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        borderRadius: 20,
    },
    txtNoImage: {
        width: 300,
        height: 200,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    btnAdd: {
        backgroundColor: '#2E8B57',
        borderRadius: 10,
        padding: 10,
        width: 250,
        alignItems: 'center',
    },
    txtBtn: {
        color: C_TEXT_COLOR,
        fontSize: 20,
        fontWeight: 'bold'
    },
    txtBtnCont: {
        color: M_COLOR,
        fontSize: 20,
        fontWeight: 'bold',
        width: '100%'
    },
    vwBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 10
    },
    vwSbt: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 5
    },
})
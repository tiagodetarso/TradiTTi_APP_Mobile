import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, TextInput, Image, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux'
import { addItem } from '../slices/demandSlice'
import { Button, Dialog, Portal} from 'react-native-paper'
import ModalSelect from '../components/ModalSelect'
import ModalCombo from '../components/ModalCombo'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR, URL_API } from '../../global';

selectedWidth = Dimensions.get('screen').width
selectedHeight = Dimensions.get('screen').height

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
    const [ combos, setCombos ] = useState([])

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
        console.log(combos)
        if (quantity == 0) {
            Alert.alert('Você não preencheu a quantidade')
        } else if((combos === Array([])) && (product.specification === "misto" || 'diverso 10' || 'diverso 20' || 'especial 10' || 'especial 20')) {
            Alert.alert('Você não escolheu as esfihas dos seu combo!')
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
                extra: extras,
                combo: combos
            }))
        }
    }

    function ModalToSelected (array) {
        setExtras(array)
        Alert.alert("Agora, aperte o botão 'Adicionar ao Pedido'!")
    }

    function ModalComboToSelected (array) {
        setCombos(array)
        Alert.alert("Agora, aperte o botão 'Adicionar ao Pedido'!")
    }

    function ComboMessage() {
        let message = "Esfihas do combo:\n"
        for (const combo of combos) {
            message += `${combo.quantity} x ${combo.specification}\n`
        }

        if (message === "Esfihas do combo:\n" ) {
            message = ""
        }
        return message
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
            message = ""
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
                        size={selectedWidth/15}
                        padding={selectedWidth/90}
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
                        size={selectedWidth/15}
                        padding={selectedWidth/90}
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
                            product.subType === 'esfiha combos' && product.specification !== ['carne 10', 'carne 20', 'frango10', 'frango20']
                            ?
                            <ModalCombo combo={product.specification} qtt={quantity} txt="Escolher as esfihas do combo" modalComboToSelected={ModalComboToSelected} />
                            :
                            <></>
            }
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={HideDialog}>
                        <Dialog.Title>Sucesso!</Dialog.Title>
                        <Dialog.Content>
                            <Text>{`Adicionado ao pedido:\n ${quantity} x ${product.subType}(s) - ${product.specification}\n${AdditionalMessage()}\n${ComboMessage()}`}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => navigation.navigate("Escolher")}>Continuar Escolhendo</Button>
                            <Button onPress={() => navigation.navigate("Pedido")}>Finalizar Pedido</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
        width: selectedWidth,
        padding: selectedWidth/45,
    },
    txtMsg: {
        padding: selectedWidth/90,
        fontSize: selectedWidth/20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    txtSubMsg: {
        padding: selectedWidth/90,
        fontSize: selectedWidth/30,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
    },
    vwSub: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: selectedWidth,
        padding: selectedWidth/45,
    },
    btnQtt: {
        alignItems: 'center',
        padding: selectedWidth/45,
        borderRadius: selectedWidth/20,
    },
    btnContinue: {
        alignItems: 'center',
        padding: selectedWidth/15,
        borderRadius:selectedWidth/20,
    },
    txtInput: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: selectedWidth/45,
        width: selectedWidth/7.5,
        fontSize: selectedWidth/17,
        fontWeight: 'bold',
        backgroundColor: '#EEE8AA',
        borderRadius: selectedWidth/30,
    },
    vwImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: selectedWidth,
        padding: selectedWidth/90,
    },
    image: {
        resizeMode: 'contain',
        width: selectedWidth/1.5,
        height: selectedHeight/5,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        borderRadius: selectedWidth/20,
    },
    txtNoImage: {
        width: selectedWidth/1.5,
        height: selectedHeight/5,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    btnAdd: {
        backgroundColor: '#2E8B57',
        borderRadius: selectedWidth/45,
        padding: selectedWidth/45,
        width: selectedWidth/1.8,
        alignItems: 'center',
    },
    txtBtn: {
        color: C_TEXT_COLOR,
        fontSize: selectedWidth/20,
        fontWeight: 'bold'
    },
    txtBtnCont: {
        color: M_COLOR,
        fontSize: selectedWidth/20,
        fontWeight: 'bold',
        width: selectedWidth,
        textAlign: 'center'
    },
    vwBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: selectedWidth,
        padding: selectedWidth/45,
    },
    vwSbt: {
        alignItems: 'center',
        justifyContent: 'center',
        width: selectedWidth,
        padding: selectedWidth/90
    },
})
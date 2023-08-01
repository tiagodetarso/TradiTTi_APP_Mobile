import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, TouchableHighlight, ScrollView, Linking } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome'

import Header from '../components/Header'

import { excludeItem, popItens } from '../slices/demandSlice'

import { C_COLOR1, C_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR, URL_API, CLIENT_NUMBER, NEIGHBORHOOD } from '../../global';

export default function Demand() {

    const dispatch = useDispatch()

    const pedido = useSelector((state) => state.demand.demandItens)
    const customer = useSelector((state) => state.customer.customer)

    const [ adress, setAdress ] = useState("")
    const [ newAdress, setNewAdress ] = useState("")
    const [ obs, setObs ] = useState("")
    const [ diaEhora, setDiaEhora ] = useState("")
    const [ meioPagamento, setMeioPagamento ] = useState("")
    const [ meioRecebimento, setMeioRecebimento] = useState("")
    const [ troco, setTroco ] = useState(0)
    const [ totalPedido, setTotalPedido ] = useState(0)
    const [ changeAdress, setChangeAdress ] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ taxaEntrega, setTaxaEntrega ] = useState(0)
    const [ neighborhood, setNeighborhood ] = useState("")
    const [ newNeighborhood, setNewNeighborhood ] = useState("")
    const [ deliveryString, setDeliveryString ] = useState("")
    const [ tempoEntrega, setTempoEntrega ] = useState("")
    const [ tempoBalcao, setTempoBalcao ] = useState("")

    const meiosPagamento =[ "Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito"]
    const meiosRecebimento =[ "Entrega em domicílio", "Retirar no balcão para viagem", "Retirar no balcão p/ comer na Praça"]

    const agora = new Date()

    function DataEHora (date) {
        const day = date.getDate()
        const month = date.getMonth()+1
        const year = date.getFullYear()
        const hour = date.getHours()
        const minute = date.getMinutes()

        const dataEhora = `${('0'+day).slice(-2)}/${('0'+month).slice(-2)}/${year} - ${('0'+hour).slice(-2)}:${('0'+minute).slice(-2)}`
        setDiaEhora(dataEhora)
    }

    function Adress(cliente) {
        setAdress(`${cliente.adress.street}, nº: ${cliente.adress.number}, ${cliente.adress.complement}\nbairro: ${cliente.adress.neighborhood}, cep: ${cliente.adress.postalCode}\ncidade: ${cliente.adress.city}-${cliente.adress.state}`)
        setNeighborhood(cliente.adress.neighborhood)
    }

    function ConfirmAdress() {
        (!newAdress)
        ?
        Alert.alert("Você não digitou um nome de rua ou avenida campo acima!")
        :
            (!newNeighborhood)
            ?
            Alert.alert("Você não escolheu o bairro desse novo endereço")
            :
            setAdress(`${newAdress}, bairro: ${newNeighborhood}`)
            setMeioRecebimento("Retirar no balcão para viagem")
            setMeioRecebimento("Entrega em domicílio")
            setNewAdress("")
    }

    function QtEsfihaSalgada (order) {
        let qtSum = 0
        let discount
        for (const product of order) {
            if (product.fixPromotionDay !== agora.getDay() && product.subType == 'esfiha') {
                qtSum += product.quantity
            }
        }
        if (qtSum >= 10) {
            discount = (-0.5) * qtSum
        } else {
            discount = 0
        }
        return discount
    }

    function Total (pedido, recebimento) {
        let totalArray = []
        for (const item of pedido) {
            item.fixPromotionDay === agora.getDay()
            ?
            totalArray.push(item.promotionValue * item.quantity)
            :
            totalArray.push(item.value * item.quantity)
        }

        const discount = QtEsfihaSalgada(pedido)
        if (discount !== 0) {
            totalArray.push(discount)
        }

        let soma = 0
        for (let i=0; i < totalArray.length; i++) {
            soma += Number(totalArray[i])
        }

        recebimento === "Entrega em domicílio"
        ?
        setTotalPedido(soma+taxaEntrega)
        :
        setTotalPedido(soma)
    }

    function ExcludeItem(element) {
        dispatch(excludeItem(element))
    }

    function ItensPedido(order) {
        var itensPedido = ""
        for (let i = 1; i < order.length; i++) {
            if (order[i].fixPromotionDay === agora.getDay()){
                itensPedido += `${order[i].quantity} x ${order[i].subType} - ${order[i].specification} -> R$ ${(order[i].quantity * order[i].promotionValue).toFixed(2).replace('.',",")}\n`
            } else {
                itensPedido += `${order[i].quantity} x ${order[i].subType} - ${order[i].specification} -> R$ ${(order[i].quantity * order[i].value).toFixed(2).replace('.',',')}\n`
            }
        }
        return itensPedido
    }

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

    function SendOrderByWApp() {

        if (isOpen === false) {
            Alert.alert("Tente novamente entre terça-feira e Domingo, das 18:30 às 22:30")
            Alert.alert("A loja não esta recebendo pedidos no momento.")
        } else {
            const whatsapp_number = '+5544997006598'
            const modoPagamento = (meioPagamento === 'Dinheiro') ? `TROCO p/: R$ ${Number(troco).toFixed(2).replace('.',',')}` : ""
            const entrega = (meioRecebimento === 'Entrega em domicílio') ? 'Taxa de Entrega ---------------------> R$ 5,00' :""

            const message = `Boston Esfiharia TradiTTi App\n` + 
            `-----------------------------------------------------------\n` +
            `Data: ${diaEhora}\n` +
            `-----------------------------------------------------------\n` +
            `Cliente:\n` + 
            `${customer.name}\n` +
            `-----------------------------------------------------------\n` +
            `WhatsApp:\n` + 
            `${customer.phoneWP}\n` +
            `-----------------------------------------------------------\n` +
            `Endereço:\n` + 
            `${adress}\n` +
            `----------------------------------------------------------- \n` + 
            `Recebimento:\n` + 
            `${meioRecebimento.toUpperCase()}\n` +
            `------------------------------------------------------------\n` + 
            `Pagamento:\n` + 
            `${meioPagamento.toUpperCase()}\n` +
            `${modoPagamento}\n` +
            `------------------------------------------------------------\n` + 
            `Itens do Pedido:\n\n` +
            `${ItensPedido(pedido)}\n\n` +
            `${entrega}\n\n` +
            `Desconto Esfihas Salg. -------> R$ ${QtEsfihaSalgada(pedido).toFixed(2).replace('.',',')}\n\n` +
            `TOTAL ----------------------------------> R$ ${totalPedido.toFixed(2).replace('.',',')}\n\n\n`+
            `OBS: ${obs}`

            if (!meioRecebimento) {
                Alert.alert("Você não escolheu o meio de recebimento do pedido")
            } else if (!meioPagamento) {
                Alert.alert("Você não selecionou a forma de pagamento do pedido")
            } else if (pedido.length <= 1) {
                Alert.alert("Pedido vazio! Vá na aba 'Escolher' para adicionar produtos ao pedido")
            } else {
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
        }
    }

    function objectToArray(obj) {
        let arrayFromObject = []

        Object.keys(obj).forEach(function(key) {
            console.log(key, obj[key])
            arrayFromObject.push([key, obj[key]])
        })

        return arrayFromObject
    }

    function DeliveryFee(numberClient) {
        fetch (`${URL_API}/client/getdeliveryfee`, {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
            },
            body: JSON.stringify({clientNumber: numberClient})
        })
        .then(resp => resp.json())
        .then((data) => {
            if(data.msg === 'Pesquisa realizada com sucesso!') {
                (!newNeighborhood)
                ?
                setTaxaEntrega(data.content.deliveryFee[customer.adress.neighborhood])
                :
                setTaxaEntrega(data.content.deliveryFee[newNeighborhood])
            } else {
                setTaxaEntrega("erro")
            }
        })
        .catch((err) => console.log(err))  
    }

    function DeliveryGap(numberClient) {
        fetch (`${URL_API}/client/getdeliverygap`, {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
            },
            body: JSON.stringify({clientNumber: numberClient})
        })
        .then(resp => resp.json())
        .then((data) => {
            if(data.msg === 'Pesquisa realizada com sucesso!') {
                setTempoEntrega(data.content.deliveryGap)
            } else {
                setTempoEntrega("erro")
            }
        })
        .catch((err) => console.log(err))  
    }

    function PickupoGap(numberClient) {
        fetch (`${URL_API}/client/getpickupgap`, {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
            },
            body: JSON.stringify({clientNumber: numberClient})
        })
        .then(resp => resp.json())
        .then((data) => {
            if(data.msg === 'Pesquisa realizada com sucesso!') {
                setTempoBalcao(data.content.pickupGap)
            } else {
                setTempoBalcao("erro")
            }
        })
        .catch((err) => console.log(err))  
    }

    useEffect(() => {
        DataEHora(agora)
        IsOpen(CLIENT_NUMBER)
    },[pedido, adress, diaEhora])

    useEffect(() => {
        Adress(customer)
        setDeliveryString(`taxaEntrega.${neighborhood}`)
    },[])

    useEffect(() => {
        DeliveryFee(CLIENT_NUMBER)
        DeliveryGap(CLIENT_NUMBER)
        PickupoGap(CLIENT_NUMBER)
        Total(pedido, meioRecebimento)
    },[pedido, meioRecebimento])

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.upView}>
                <Header />
                <Text style={styles.txtMsg}>Conclua seu Pedido!</Text>
            </View>
            <ScrollView>
                <Text style={styles.txtEstab}>Boston Esfiharia - TradiTTi App</Text>
                <Text style={styles.divider}>-------------------------------------------------------</Text>
                <Text style={styles.txtDate}>{`Data: ${diaEhora}`}</Text>
                <Text style={styles.divider}>-------------------------------------------------------</Text>
                <View style={styles.dropdownView}>
                    <Text style={styles.txtEstab}>Modo de Recebimento do pedido:</Text>
                    <SelectDropdown
                        dropdownStyle={styles.dropdown}
                        buttonStyle={styles.dropdownButton}
                        defaultButtonText='Aperte aqui para escolher'
                        data={meiosRecebimento}
                        onSelect={(selectedItem) => setMeioRecebimento(selectedItem)}
                    />
                    {
                        meioRecebimento === "Entrega em domicílio"
                        ?
                            Number(taxaEntrega) === 0
                            ?
                            <Text style={styles.txtGap}>Infelizmente não entregamos no seu local. Escolha outra opção ou altere seu endereço, abaixo.</Text>
                            :
                                <Text style={styles.txtGap}>{`Tempo aprox. até a ENTREGA: ${tempoEntrega}`}</Text>
                                :
                                    (meioRecebimento === "Retirar no balcão para viagem")
                                    ?
                                    <Text style={styles.txtGap}>{`Tempo aprox. até a RETIRADA: ${tempoBalcao}`}</Text>
                                    :
                                    <></>
                    }
                </View>
                <Text style={styles.divider}>-------------------------------------------------------</Text>
                <Text style={styles.txtEstab}>Itens do Pedido:</Text>
                <View style={styles.rowView}>
                    <Text style={styles.txt5}>  </Text>
                    <Text style={styles.txt45}>produto</Text>
                    <Text style={styles.txt25}>Qtd. x v. un.</Text>
                    <Text style={styles.txt20}>Subtotal</Text>
                    <Text style={styles.txt5}> x</Text>
                </View>
                {
                    (pedido === "")
                    ? 
                    <Text>Nenhum produto foi selecionado ainda.</Text>
                    : 
                        pedido.map((element, index) => {
                            if(index>0) {
                                return (
                                    <View style={styles.rowView} key={element.id+index}>
                                        <Text style={styles.txt5}>{`${index}: `}</Text>
                                        <Text style={styles.txt45}>{`${element.subType} - ${element.specification}`}</Text>
                                        <Text style={styles.txt25}>{
                                            element.fixPromotionDay === agora.getDay()
                                            ?
                                            `${element.quantity} x R$ ${element.promotionValue.toFixed(2).replace(".",",")}`
                                            :
                                            `${element.quantity} x R$ ${element.value.toFixed(2).replace(".",",")}`
                                        }</Text>
                                        <Text style={styles.txt20}>{
                                            element.fixPromotionDay === agora.getDay()
                                            ?
                                            `R$ ${(element.quantity * element.promotionValue).toFixed(2).replace(".",",")}`
                                            :
                                            `R$ ${(element.quantity * element.value).toFixed(2).replace(".",",")}`
                                        }</Text>
                                        <TouchableOpacity
                                            style={{alignItems:'center'}}
                                        >
                                            <Icon 
                                                name='trash-o'
                                                color={'red'}
                                                size={15}
                                                padding={5}
                                                onPress={() => ExcludeItem(element)}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })
                }
                {
                    meioRecebimento === 'Entrega em domicílio' &&
                    <View style={styles.rowView}>
                        {
                        totalPedido === 0
                        ?
                        <Text></Text>
                        :
                        <>
                            <Text style={styles.txtEntrega80}>Taxa de Entrega</Text>
                            <Text style={styles.txtEntrega20}>{`R$ ${taxaEntrega.toFixed(2).replace(".",",")}`}</Text>
                        </>
                    }
                    </View>
                }
                {
                    QtEsfihaSalgada(pedido) !== 0 &&
                    <View style={styles.rowView}>
                        <Text style={styles.txtEntrega80}>Desconto por quantidade</Text>
                        <Text style={styles.txtEntrega20}>{`R$ ${QtEsfihaSalgada(pedido).toFixed(2).replace(".",",")}`}</Text>
                    </View>
                }
                <View style={styles.rowView}>
                    {
                        totalPedido === 0
                        ?
                        <Text></Text>
                        :
                        <>
                            <Text style={styles.txtTotal80}>Total</Text>
                            <Text style={styles.txtTotal20}>{`R$ ${totalPedido.toFixed(2).replace(".",",")}`}</Text>
                        </>
                    }
                </View>
                <Text style={styles.divider}>-------------------------------------------------------</Text>
                <View style={styles.dropdownView}>
                <Text style={styles.txtEstab}>Modo de Pagamento:</Text>
                    <SelectDropdown
                        dropdownStyle={styles.dropdown}
                        buttonStyle={styles.dropdownButton}
                        defaultButtonText='Aperte aqui para escolher'
                        data={meiosPagamento}
                        onSelect={(selectedItem) => setMeioPagamento(selectedItem)}
                    />
                    {
                        (meioPagamento === "Dinheiro") &&
                        <View style={styles.rowView}>
                            <Text style={styles.txtCorpo}>Troco p/ R$:</Text>
                            <TextInput 
                                style={styles.txtTroco}
                                keyboardType='decimal-pad'
                                keyboardAppearance='dark'
                                value={`${troco}`}
                                onChangeText={(t) => setTroco(t)}
                            />
                        </View>
                    }
                    {
                        (meioPagamento === "Pix") &&
                        <>
                            <Text style={styles.txtGap}> Nossa Chave Pix: 44997006598</Text>
                            <Text style={styles.txtGap}> Beneficiário: PPMG INTERNATIONAL</Text>
                        </>
                    }
                    <Text style={styles.divider}>-------------------------------------------------------</Text>
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.txtCorpo}>Cliente:</Text>
                    <Text style={styles.txtCorpo2}>{customer.name}</Text>
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.txtCorpo}>WhatsApp:</Text>
                    <Text style={styles.txtCorpo2}>{customer.phoneWP}</Text>
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.txtCorpo}>Endereço:</Text>
                    <Text style={styles.txtCorpo2}>{adress}</Text>
                </View>
                <View style={styles.rowView}>
                    <TouchableHighlight
                        style={styles.btnAdress}
                        onPress={() => setChangeAdress(!changeAdress)}
                    >
                        <Text>Clique se quiser alterar o endereço</Text>
                    </TouchableHighlight>
                </View>
                {
                    (changeAdress) && 
                    <>
                        <View style={styles.rowView}>
                            <Text styles={styles.txtCorpo}>{'Entregar em\noutro local\nRua/Av'}:</Text>
                            <TextInput 
                                style={styles.txtNewAdress}
                                keyboardType='default'
                                keyboardAppearance='dark'
                                multiline={true}
                                onChangeText={setNewAdress}
                                value={newAdress}
                                placeholder="Se o endereço para entrega for diferente do endereço acima, insira o nome da rua e o número aqui, escolha o bairro abaixo e clique no botão 'Submeter novo endereço'!"
                                textAlign='left'
                                textAlignVertical='top'
                            />
                        </View>
                        <View style={styles.dropdownView}>
                            <SelectDropdown
                                dropdownStyle={styles.dropdown}
                                buttonStyle={styles.dropdownButton}
                                defaultButtonText='Escolha um bairro ou distrito'
                                data={NEIGHBORHOOD}
                                onSelect={(selectedItem) => setNewNeighborhood(selectedItem)}
                            />
                        </View>
                        <View style={styles.rowView}>
                            <TouchableHighlight
                                style={styles.btnAdress}
                                onPress={ConfirmAdress}
                            >
                                <Text>Submeter novo endereço</Text>
                            </TouchableHighlight>   
                        </View>
                    </>
                }
                <View style={styles.rowView}>
                    <Text styles={styles.txtCorpo}>Observações:</Text>
                    <TextInput 
                        style={styles.txtNewAdress}
                        keyboardType='default'
                        keyboardAppearance='dark'
                        multiline={true}
                        onChangeText={setObs}
                        value={obs}
                        placeholder="Aqui você pode fazer observações. O que estiver escrito aqui, será enviado junto com o pedido ao clicar no botão de envio do pedido por whatsapp."
                        textAlign='left'
                        textAlignVertical='top'
                    />
                </View>
                <View style={styles.sendView}>
                    <TouchableHighlight
                        style={styles.btnSend}
                        onPress={SendOrderByWApp}
                    >
                        <Text>Enviar Pedido por WhatsApp</Text>
                    </TouchableHighlight>   
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#C0C0C0',
        width: '100%',
        padding: 10,
    },
    upView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtMsg: {
        padding: 10,
        fontSize: 20,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    divider: {
        fontSize: 20,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    txtEstab: {
        padding:5,
        fontSize: 18,
        color: D_TEXT_COLOR,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    txtDate: {
        padding:5,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    txtCorpo: {
        alignSelf: 'flex-start',
        marginLeft: 5,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        width: '25%',
    },
    txtCorpo2: {
        alignSelf:'flex-end',
        marginRight:5,
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        width: '75%',
    },
    rowView: {
        flexDirection: 'row',
        padding:5,
        justifyContent: 'space-between'
    },
    sendView : {
        flexDirection: 'row',
        padding:5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtNewAdress: {
        backgroundColor: C_COLOR2,
        borderRadius: 10,
        padding: 10,
        width: '75%',
        height: 120,
    },
    txtTroco: {
        backgroundColor: C_COLOR2,
        borderRadius: 10,
        padding: 5,
        width: '65%',
        height: 30,
        alignContent: 'flex-start'
    },
    btnAdress: {
        backgroundColor: C_COLOR1,
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        width: '68%',
        justifyContent: 'flex-end',
        marginLeft: 100
    },
    
    btnSend: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        width: '90%',
        justifyContent: 'center'
    },
    txtBtnAdress: {
        color: C_TEXT_COLOR,
        fontSize: 20,
        fontWeight: 'bold'
    },
    dropdownView: {
        width:'100%',
        justifyContent:'center',
        alingItems:'center',
    },
    dropdownButton: {
        width:'95%',
        borderRadius: 10,
        height: 30,
        backgroundColor: C_COLOR2,
    },
    dropdown: {
        borderRadius: 10,
        width: '80%',
        marginLeft: 25,
        justifyContent: 'center'
    },
    txt25: {
        alignSelf: 'flex-start',
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        width: '25%',
        fontSize:13
    },
    txt45: {
        alignSelf: 'flex-start',
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        width: '45%',
        fontSize:13
    },
    txt20: {
        alignSelf: 'flex-start',
        color: D_TEXT_COLOR,
        flexWrap: 'wrap',
        width: '20%',
        fontSize:13
    },
    txt5: {
        alignSelf: 'flex-start',
        color: D_TEXT_COLOR,
        width: '5%',
        fontSize:13
    },
    txtTotal80: {
        alignSelf: 'flex-end',
        color: D_TEXT_COLOR,
        width: '80%',
        fontSize: 20,
        fontWeight: 'bold'
    },
    txtEntrega80: {
        alignSelf: 'flex-end',
        color: D_TEXT_COLOR,
        width: '80%',
        fontWeight: 'bold'
    },
    txtTotal20: {
        alignSelf: 'flex-end',
        color: D_TEXT_COLOR,
        width: '20%',
        fontWeight: 'bold'
    },
    txtEntrega20: {
        alignSelf: 'flex-end',
        color: D_TEXT_COLOR,
        width: '20%',
    },
    txtGap: {
        padding:5,
        color: "dodgerblue",
        flexWrap: 'wrap',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
})
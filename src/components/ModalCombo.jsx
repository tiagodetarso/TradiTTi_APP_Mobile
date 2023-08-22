import React, { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, TextInput, Text, TouchableHighlight, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { Modal, Portal, Button } from 'react-native-paper'

import { M_COLOR, C_COLOR1, C_COLOR2, D_COLOR1, D_COLOR2, C_TEXT_COLOR, D_TEXT_COLOR, CLIENT_NUMBER, URL_API } from '../../global';

const modalWidth = Dimensions.get('screen').width
const modalHeight = Dimensions.get('screen').height

export default function ModalCombo({combo, txt, qtt, modalComboToSelected}) {

  const [comboArray, setComboArray] = useState([])
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    qtt !== 1
    ?
    Alert.alert("Coloque a quantidade de 1 combo, para poder escolher")
    :
    setVisible(true)
  } 
  
  const hideModal = () => setVisible(false);

  function ComboMistoList () {
    fetch (`${URL_API}/product/combomistolist`, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
      },
      body: JSON.stringify({clientNumber: CLIENT_NUMBER, subType1: 'esfiha', subType2: 'esfiha doce'})
    })
    .then(resp => resp.json())
    .then((data) => {
        if (data.msg === "Pesquisa bem sucedida!") {
          const initializedComboArray = data.content.map(item => ({ ...item, quantity: 0 }));
          setComboArray(initializedComboArray);
        } 
    })
    .catch((err) => console.log(err))
  }

  const handleQuantityChange = (prodSpecification, quantity) => {
    console.log(`Produto: ${prodSpecification}, Quantidade: ${quantity}`);
  };

  function Plus(index) {
    const updatedComboArray = [...comboArray];
    updatedComboArray[index].quantity = (updatedComboArray[index].quantity || 0) + 1;
    setComboArray(updatedComboArray)
  }
  
  function Minus(index) {
    const updatedComboArray = [...comboArray];
    if (updatedComboArray[index].quantity) {
      updatedComboArray[index].quantity -= 1;
      setComboArray(updatedComboArray);
    }
  }

  function AddCombo() {
    let comboChoiceArray = []
    let quantidadeEsfihas = 0
    let quantidade = 0
    combo === 'misto' ? comboChoiceArray.push({specification: 'carne', quantity: 3}) : comboChoiceArray

    combo === 'misto' || combo === 'diverso 10' || combo === 'especial 10' ? quantidade = 10 : quantidade = 20

    for (item of comboArray) {
      if (item.quantity !== 0) {
        comboChoiceArray.push({specification: item.specification, quantity: item.quantity})
      }
    }

    for (item of comboChoiceArray) {
      if (item.quantity !==0) {
        quantidadeEsfihas += item.quantity
      }
    }
    
    console.log(comboChoiceArray)
    console.log(quantidadeEsfihas)

    if (quantidadeEsfihas > quantidade) {
      Alert.alert(`Você selecionou ${quantidadeEsfihas - quantidade} esfiha(s) a mais. Diminua a quantidade!`)
    } else if (quantidadeEsfihas < quantidade) {
      Alert.alert(`Ainda falta selecionar ${quantidade - quantidadeEsfihas} esfiha(s). `)
    } else {
    modalComboToSelected(comboChoiceArray)
    setVisible(false)
    }
  }

  useEffect(() => {
    combo === 'misto'
    ?
    ComboMistoList()
    :
        combo === 'diverso 10' || combo === 'diverso 20'
        ?
        setComboArray([
          {_id:1, specification:'calabresa', quantity:0},
          {_id:2, specification:'calabresa com cebola', quantity:0},
          {_id:3, specification:'frango com bacon', quantity:0},
          {_id:4, specification:'frango com catupiry', quantity:0},
          {_id:5, specification:'frango com cheddar', quantity:0},
          {_id:6, specification:'milho com bacon', quantity:0},
          {_id:7, specification:'palmito', quantity:0},
          {_id:8, specification:'palmito com azeitona', quantity:0},
          {_id:9, specification:'pizza', quantity:0},
          {_id:10, specification:'quatro queijos', quantity:0},
          {_id:11, specification:'queijo com bacon', quantity:0}
        ])
        :
        setComboArray([
          {_id:1, specification:'atum', quantity:0 },
          {_id:2, specification:'carne com cream cheese', quantity:0 },
          {_id:3, specification:'portuguesa', quantity:0 },
          {_id:4, specification:'tomate seco', quantity:0 }
        ])
  },[])

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={styles.modalContainer}>
        <Text style={styles.title}>ESCOLHA AS ESFIHAS DO COMBO</Text>
        <Text style={styles.subTitle}>Preencha as quantidades!</Text>
        {
          combo === 'misto' ? <Text style={styles.subTitle}>{"Este combo já conta com:\n3 x esfiha de carne"}</Text>: <Text></Text>
        }
        <ScrollView style={{maxHeight: modalHeight/2.2}}>
          {
            comboArray.map((product, index) => (
              <View style={styles.modalView} key={product._id}>
                <Text>{`${product.specification}`}</Text>
                <View style={styles.mView}>
                  <TouchableOpacity
                    onPress={() => Plus(index)}
                  >
                    <Text style={{paddingHorizontal:modalWidth/45, fontSize:modalWidth/20, fontWeight: 'bold', color:'green'}}>+</Text>
                  </TouchableOpacity>
                  <TextInput 
                    style={styles.modalTxtInput}
                    keyboardType='numeric'
                    placeholder='0'
                    value={product.quantity ? product.quantity.toString() : ''}
                    onChangeText={(text) => handleQuantityChange(product.specification, text)}
                  />
                  <TouchableOpacity
                    onPress={() => Minus(index)}
                  >
                    <Text style={{paddingHorizontal:modalWidth/45, fontSize:modalWidth/20, fontWeight:'bold', color:'red'}}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
          </ScrollView>
          <View style={styles.vwBtn}>
            <TouchableHighlight
                style={styles.btnAdd}
                onPress={AddCombo}
            >
                <Text style = {styles.txtBtn}>Adicionar</Text>
            </TouchableHighlight>
          </View>
          <Button style={{marginTop: modalHeight/100}} textColor={D_COLOR2} onPress={hideModal}>
            fechar
          </Button>
        </Modal>
      </Portal>
      <Button style={{marginBottom:modalHeight/33, marginTop:modalHeight/100}} labelStyle={{fontSize:modalWidth/20, color:M_COLOR}} onPress={showModal}>
        {txt}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    height: modalHeight*0.8,
    backgroundColor: C_COLOR1,
    padding:modalWidth/23,
    marginTop: modalHeight/9,
    marginHorizontal: modalWidth/23,
    justifyContent: 'flex-start',
    borderRadius:modalWidth/23
  },
  modalView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginHorizontal: modalWidth/23,
    padding: modalWidth/90
  },
  mView: {
    flexDirection: 'row',
  },
  modalTxtInput: {
    width: modalWidth/9,
    borderWidth: modalWidth/425,
    backgroundColor: C_COLOR2,
    paddingHorizontal: modalWidth/25,
  },
  title: {
    fontSize: modalWidth/23,
    fontWeight: 'bold',
    marginRight: modalWidth/45,
    marginVertical: modalWidth/45,
    alignSelf: 'center'
  },
  subTitle: {
    fontSize: modalWidth/28,
    fontWeight: 'bold',
    marginHorizontal: modalWidth/45,
    marginVertical: modalHeight/100,
    marginTop: modalWidth/45,
    alignSelf: 'center'
  },
  btnAdd: {
    backgroundColor: '#2E8B57',
    borderRadius: modalWidth/45,
    padding: modalWidth/90,
    width: modalWidth/2,
    height: modalHeight/23,
    alignItems: 'center',
},
vwBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: modalWidth*0.85,
    padding: modalWidth/45,
    marginTop: modalWidth/30,
},
txtBtn: {
    color: C_TEXT_COLOR,
    fontSize: modalWidth/22,
    fontWeight: 'bold'
},
})
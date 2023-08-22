import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput, Switch, Text, TouchableHighlight, Alert, Dimensions } from 'react-native'
import { Modal, Portal, Button, Dialog } from 'react-native-paper'

import { M_COLOR, C_COLOR1, D_COLOR1, C_TEXT_COLOR, CLIENT_NUMBER, URL_API } from '../../global';

const modalWidth = Dimensions.get('screen').width
const modalHeight = Dimensions.get('screen').height

export default function ModalSelect({produto, qtt, modalToSelected, txt}) {

  const [additionalArray, setAdditionalArray] = useState([])
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [extraList, setExtraList] = useState([]);
  const [nitem, setNitem] = useState(0)

  const showModal = () => {
    qtt === '0'
    ?
    Alert.alert("Coloque a quantidade de esfihas, antes de escolher")
    :
    setVisible(true)
  } 
  
  const hideModal = () => setVisible(false);

  const showDialog = () => {
    setVisibleDialog(true)
  }

  const hideDialog = () => {
    setVisibleDialog(false)
  }

  function AdditionalList () {
    fetch (`${URL_API}/product/extralist`, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
      },
      body: JSON.stringify({clientNumber: CLIENT_NUMBER, subType: produto})
    })
    .then(resp => resp.json())
    .then((data) => {
        if (data.msg === "Pesquisa bem sucedida!") {
          setExtraList(data.content)
        } 
    })
    .catch((err) => console.log(err))
  }

  const handleProductSelection = (productID) => {
    let selecionados = 0
    extraList.map((product) =>
      product.selected ? selecionados +=1 : selecionados
    )

    if (selecionados === 0 || selecionados === 1) {
      setExtraList((extraList) =>
      extraList.map((product) =>
        product._id === productID ? { ...product, selected: !product.selected } : product
      )
    )
    } else if (selecionados ===2) {
      setExtraList((extraList) =>
      extraList.map((product) =>
        product._id === productID ? { ...product, selected: false } : product
      )
    )
    }
  }

  function Add(array) {
    var adicional = []
    var valorAdicional = 0

    for (const produto of array) {
      if (produto?.selected) {
        adicional.push(produto.specification)
        valorAdicional += produto.value
      }
    }
    additionalArray.push({add: adicional, value: valorAdicional})
    console.log(additionalArray)
    showDialog()
  }

  function NewAdditional() {
    hideDialog()
    setNitem(nitem+1)
    console.log(nitem+1)
  }

  function BackToSelected (array) {
    hideModal()
    modalToSelected(array)
  }

  useEffect(() => {
    AdditionalList()
  }, [nitem])

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={styles.modalContainer}>
        <Text style={styles.title}>ESCOLHA OS ADICIONAIS</Text>
        <Text style={styles.subTitle}>{`esfiha ${nitem+1} de ${qtt}`}</Text>
        <Text style={styles.subTitle}>Selecione até dois adicionais por esfiha</Text>
          {
            extraList.map((product) => (
              <View style={styles.modalView} key={product._id}>
                <Text>{`${product.specification} - R$ ${product.value.toFixed(2).replace(".",".")} / ${product.unity}`}</Text>
                <Switch
                  style={styles.modalSwitch}
                  keyboardType='numeric'
                  value={product.selected}
                  onValueChange={() => handleProductSelection(product._id)}
                />
              </View>
            ))
          }
          <Portal>
            <Dialog visible={visibleDialog} onDismiss={hideDialog}>
              <Dialog.Title>Sucesso!</Dialog.Title>
              <Dialog.Content>
                {
                  nitem+1 < Number(qtt)
                  ?
                  <>
                    <Text style={styles.txtDialog}>{`Você acrescentou adicional de: (${additionalArray !== [] ? additionalArray[nitem]?.add :""}), somando um valor de:\nR$ ${(additionalArray !== [] ? additionalArray[nitem]?.value: 0)}     a esta esfiha`}</Text>
                    <Text>-----------------------------------</Text>
                    <Text style={styles.txtDialog}>{`Foi(Foram) acrescentado(s) adicional(is) à ${nitem+1} esfiha(s) de um total de ${qtt} selecionadas previamente.`}</Text>
                  </>
                  :
                  <>
                    <Text style={styles.txtDialog}>{`Você acrescentou adicional de: (${additionalArray !== [] ? additionalArray[nitem]?.add :""}), somando um valor de:\nR$ ${(additionalArray !== [] ? additionalArray[nitem]?.value: 0)}     a esta esfiha`}</Text>
                    <Text>-----------------------------------</Text>
                    <Text style={styles.txtDialog}>{`Você acrescentou adicionais à todas estas esfihas`}</Text>
                  </>
                }
                </Dialog.Content>
              <Dialog.Actions>
                {
                  nitem+1 < Number(qtt)
                  ?
                  <View style={{flexDirection: 'column'}}>
                    <Button onPress={NewAdditional}>ADD adicional à próxima esfiha</Button>
                    <Text style={{alignSelf: 'center'}}>OU</Text>
                    <Button onPress={() => BackToSelected(additionalArray)}>Voltar à seleção</Button>
                  </View>
                  :
                  <Button onPress={() => BackToSelected(additionalArray)}>Voltar a seleção de produtos</Button>
                }
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View style={styles.vwBtn}>
            <TouchableHighlight
                style={styles.btnAdd}
                onPress={() => Add(extraList)}
            >
                <Text style = {styles.txtBtn}>Adicionar</Text>
            </TouchableHighlight>
          </View>
          <Button style={{marginTop: modalWidth/45}} textColor={D_COLOR1} onPress={hideModal}>
            fechar
          </Button>
        </Modal>
      </Portal>
      <Button style={{marginBottom:modalWidth/15, marginTop:modalWidth/45}} labelStyle={{fontSize:modalWidth/20, color:M_COLOR}} onPress={showModal}>
        {txt}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    height: modalHeight*0.7,
    backgroundColor: C_COLOR1,
    padding: modalWidth/30,
    marginTop: modalHeight/8.5,
    marginHorizontal: modalWidth/20,
    justifyContent: 'flex-start',
    borderRadius:modalWidth/20
  },
  modalView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginHorizontal: modalWidth/20,
  },
  modalSwitch: {
    borderWidth: 1,
    backgroundColor: C_COLOR1
  },
  title: {
    fontSize: modalWidth/20,
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
    alignSelf: 'center'
  },
  btnAdd: {
    backgroundColor: '#2E8B57',
    borderRadius: modalWidth/45,
    padding: modalWidth/90,
    width: modalWidth/2,
    height: modalHeight/22,
    alignItems: 'center',
},
vwBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: modalWidth*0.85,
    padding: modalWidth/45,
    marginTop: modalHeight/50,
},
txtBtn: {
    color: C_TEXT_COLOR,
    fontSize: modalWidth/20,
    fontWeight: 'bold'
},
txtDialog: {
  fontSize: modalWidth/30
}
})
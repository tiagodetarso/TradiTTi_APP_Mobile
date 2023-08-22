import { createSlice } from '@reduxjs/toolkit'

export const demandSlice = createSlice({
    name: 'demand',
    initialState: {
        demandItens:[{
            id: '',
            subtype: '',
            specification: '',
            unity: '',
            value: 0,
            fixPromotionDay: 7,
            promotionValue: 0,
            quantity:0,
            extra:[],
            combo:[]
        }],
    },
    reducers: {
        addItem: (state, action) => {
            state.demandItens.push(action.payload)
        },
        excludeItem: (state, action) => {
            state.demandItens.splice(state.demandItens.indexOf(action.payload), 1)
        },
        popItens: (state) => {
            const nItens = state.demandItens.length
            for (let i = nItens - 1; i > 0; i--) {
                state.demandItens.pop()
            }
        }
    },
})

export const {
    addItem,
    excludeItem,
    popItens}= demandSlice.actions
    
export default demandSlice.reducer
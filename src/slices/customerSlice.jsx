import { createSlice } from '@reduxjs/toolkit'

export const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customer:{},
    },
    reducers: {
        setCustomer: (state, action) => {
            state.customer = action.payload;
        },
        cleanCustomer: (state) => {
            state.customer={};
        }
    },
})

export const {
    setCustomer,
    cleanCostumer} = customerSlice.actions

export default customerSlice.reducer
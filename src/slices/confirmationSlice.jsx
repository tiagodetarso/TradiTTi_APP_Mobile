import { createSlice } from '@reduxjs/toolkit'

export const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState: {
        confirmationCode:'',
    },
    reducers: {
        setConfirmationCode: (state, action) => {
            state.confirmationCode = action.payload;
        },
        clean: (state) => {
            state.confirmationCode=''
        }
    },
})

export const {
    setConfirmationCode,
    clean}= confirmationSlice.actions
    
export default confirmationSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        email:'',
        senha:'',
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setSenha: (state, action) => {
            state.senha = action.payload;
        },
        cleanSenha: (state) => {
            state.senha = ""
        }
    },
})

export const {
    setEmail,
    setSenha,
    cleanSenha}= loginSlice.actions
    
export default loginSlice.reducer
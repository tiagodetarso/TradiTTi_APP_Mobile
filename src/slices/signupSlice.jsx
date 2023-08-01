import { createSlice } from '@reduxjs/toolkit'

export const signUpSlice = createSlice({
    name: 'signup',
    initialState: {
        email:'',
        firstName: '',
        lastName:'',
        phoneWP:'',
        phoneOther:'',
        street:'',
        number:'',
        complement:'',
        reference:'',
        neighborhood:'',
        city:'Astorga',
        state:'PR',
        postalCode:'86730000',
        password:'',
        confirmPassword:'',
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setPhoneWP: (state, action) => {
            state.phoneWP = action.payload;
        },
        setPhoneOther: (state, action) => {
            state.phoneOther = action.payload;
        },
        setStreet: (state, action) => {
            state.street = action.payload;
        },
        setNumber: (state, action) => {
            state.number = action.payload;
        },
        setComplement: (state, action) => {
            state.complement = action.payload;
        },
        setReference: (state, action) => {
            state.reference = action.payload;
        },
        setNeighborhood: (state, action) => {
            state.neighborhood = action.payload;
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setState: (state, action) => {
            state.state = action.payload;
        },
        setPostalCode: (state, action) => {
            state.postalCode = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setConfirmPassword: (state, action) => {
            state.confirmPassword = action.payload;
        },
        cleanPasses: (state) => {
            state.password=''
            state.confirmPassword=''
        },
        cleanAll: (state) => {
            state.firstName=''
            state.lastName=''
            state.phoneWP=''
            state.phoneOther=''
            state.street=''
            state.number=''
            state.complement=''
            state.reference=''
            state.neighborhood=''
            state.city=''
            state.state=''
            state.postalCode=''
            state.password=''
            state.confirmPassword=''
        }
    },
})

export const {
    setEmail,
    setFirstName,
    setLastName,
    setPhoneWP,
    setPhoneOther,
    setStreet,
    setNumber,
    setComplement,
    setReference,
    setNeighborhood,
    setCity,
    setState,
    setPostalCode,
    setPassword,
    setConfirmPassword,
    cleanPasses,
    cleanAll} = signUpSlice.actions

export default signUpSlice.reducer
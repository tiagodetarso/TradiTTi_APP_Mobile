import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../slices/loginSlice'
import signUpReducer from '../slices/signupSlice'
import confirmationReducer from '../slices/confirmationSlice'
import customerReducer from '../slices/customerSlice'
import demandReducer from '../slices/demandSlice'

export default configureStore({
    reducer: {
        login: loginReducer,
        signup: signUpReducer,
        confirmation: confirmationReducer,
        customer: customerReducer,
        demand: demandReducer,
    }
})

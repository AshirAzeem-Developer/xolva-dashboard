import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    value : 15
}

export const counterSlice = createSlice({
    name:'counter',
    initialState :initialState ,
    reducer :{
        increment : (state) => {
            state.value+=1
        },
        decrement: (state) => {
      state.value -= 1
    },
    }
})

export const {increment,decrement} = counterSlice.actions
export default counterSlice.reducer
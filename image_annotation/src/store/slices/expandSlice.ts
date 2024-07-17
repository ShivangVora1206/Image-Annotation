import { createSlice } from '@reduxjs/toolkit'


const expandSlice = createSlice({
    name: "expand",
    initialState:{
        value: false,
        enabled: true,
        trigger: false
    },
    reducers: {
        setButtonToCollapse:(state)=>{
            state.value = false
        },
        setButtonToExpand:(state)=>{
            state.value = true
        },
        enableExpandButton:(state)=>{
            state.enabled = true
        },
        disableExpandButton:(state)=>{
            state.enabled = false
        },
        triggerExpansionHandler:(state, action)=>{
            state.trigger = action.payload
            // state.trigger = !state.trigger
        }
    }
});

export const {setButtonToCollapse, setButtonToExpand, enableExpandButton, disableExpandButton, triggerExpansionHandler} = expandSlice.actions

export default expandSlice.reducer
import { createSlice } from '@reduxjs/toolkit'


const twoButtlonDialogSlice = createSlice({
    name: "twoButtonDialog",
    initialState:{
    value:false
    },
    reducers: {
    setTwoButtonDialog: (state, action) => {
        state.value = action.payload
    }
    }
});

export const {setTwoButtonDialog} = twoButtlonDialogSlice.actions

export default twoButtlonDialogSlice.reducer
import { createSlice } from '@reduxjs/toolkit'


const selectedAnnotationSlice = createSlice({
    name: "selectedAnnotation",
    initialState:{
        value:undefined
    },
    reducers: {
        setSelectedAnnotation: (state, action) => {
            state.value = action.payload
        }
    }
});

export const {setSelectedAnnotation} = selectedAnnotationSlice.actions

export default selectedAnnotationSlice.reducer
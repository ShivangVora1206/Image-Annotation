import {configureStore} from "@reduxjs/toolkit"
import expandReducer from "./slices/expandSlice"
import selectedAnnotationReducer from "./slices/selectedAnnotationSlice"
import twoButtlonDialogReducer from "./slices/twoButtlonDialogSlice"

export default configureStore({
    reducer:{
        expand: expandReducer,
        selectedAnnotation: selectedAnnotationReducer,
        twoButtonDialog: twoButtlonDialogReducer
    }
})


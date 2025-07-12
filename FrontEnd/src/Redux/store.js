import { configureStore } from "@reduxjs/toolkit";
import UmsStore from '../Redux/Redux'
console.log('it is UMSStore')

export const store=configureStore({
    reducer:{
        ums:UmsStore
    }
})
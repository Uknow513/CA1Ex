import { Schema , model } from "mongoose";
import mongoose from 'mongoose' ;

const AccountSchema = new Schema({
    wallet_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Wallet',
        default : null
    },
    crypto_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Crypto',
        default : null
    },
    account_type : {
        type : String,
        enum : ['exchange'],
        default : 'exchange'
    },
    amount : {
        type : Number,
        default : 0 
    }
} , { timestamps: true }) ;

export default model('Account' , AccountSchema) ;
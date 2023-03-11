import { Schema , model } from "mongoose";

const TokenSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    symbol : {
        type : String,
        required : true
    },
    decimal : {
        type : Number,
        required : true
    },
    logo : {
        type : String,
        default : null
    },
    pair : {
        type : String,
        enum : ['USDT', 'ETH', 'USDT,ETH'],
        default : 'USDT',
        required : true
    },
    whitepaper : {
        type : String,
        default : null
    },
    for_defi : {
        type : Boolean,
        default : true
    },
    token_address : {
        type : String,
        default : null
    },
    deposit_fee : {
        type : Number,
        default : 0
    },
    transfer_fee : {
        type : Number,
        default : 0
    },
    is_deleted : {
        type : Boolean,
        default : false
    },
    status : {
        type : String,
        default : "on Listing"
    },
} , { timestamps: true }) ;

export default model('Token' , TokenSchema) ;
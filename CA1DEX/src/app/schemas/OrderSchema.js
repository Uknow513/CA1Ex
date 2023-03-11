import { Schema , model } from "mongoose";
import mongoose from 'mongoose' ;

const OrderSchema = new Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    pay_type : {
        type : String,
        enum : ['limit', 'market'],
        default : 'limit'
    },
    type : {
        type : String,
        enum : ['buy', 'sell', 'convert'],
        default : 'buy'
    },
    limit_price : {
        type : Number,
        default : 0
    },
    amount : {
        type : Number,
        default : 0 
    },
    total : {
        type : Number,
        default : 0,
    },
    from_token : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Crypto'
    },
    to_token : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Crypto'
    },
    fee : {
        type : Number,
        default : 0
    },
    filled : {
        type : Number,
        default : 0
    },
    status : {
        type : Number,
        default : null
    },
    cleared : {
        type : Number,
        default : 0
    }
} , { timestamps: true }) ;

export default model('Order' , OrderSchema) ;
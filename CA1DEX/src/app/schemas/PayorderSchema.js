import { Schema , model }  from 'mongoose' ;
import mongoose from 'mongoose' ;

const PayorderSchema = new Schema({
    payment_id : {
        type : String,
        required : true
    },
    reference : {
        type : String,
        required : true
    },
    unit : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        default : null
    },
    amount_left : {
        type :  Number ,
        default : null
    },
    payment_type : {
        type : String ,
        required : true
    },
    transaction_time : {
        type : Date ,
        default : null
    },
    status : {
        type : String,
        default : 'pending'
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , { timestamps: true }) ;

export default model('Payorder' , PayorderSchema) ;
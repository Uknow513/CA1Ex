import { Schema , model }  from 'mongoose' ;
import mongoose from 'mongoose' ;

const ProfileSchema = new Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    first_name : {
        type : String,
        required : true 
    },
    last_name : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    street : {
        type : String,
        required : true
    },
    postal_code : {
        type :String ,
        required : true
    },
    birthday : {
        type : Date ,
        required : true
    },
    language : {
        type : String,
        required : true
    },
} , { timestamps: true }) ;

export default model('Profile' , ProfileSchema) ;
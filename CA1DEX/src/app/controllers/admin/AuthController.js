import ControllerUtils from '../../utils/ControllerUtils' ;
import SchemaService from '../../services/SchemaService' ;
import UserSchema from "../../schemas/UserSchema";

import AppError from '../../utils/AppError';
import SendMail from '../../utils/SendMail';
import { formatDBDate } from '../../utils/Helper';

import passportConfig from '../../../configs/passportConfig' ;

import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken' ;

class AuthController extends ControllerUtils {
  
    constructor() {
        super() ;

        // if you are not defined this, you will use signUp function but you can't use async and await.
        this.tokenForAdmin = this.tokenForAdmin.bind(this) ;
        this.createPassword =  this.createPassword.bind(this) ;
        this.comparePassword = this.comparePassword.bind(this) ;
        this.signIn = this.signIn.bind(this) ;
    }

    async createPassword(password , callback) {
        bcrypt.genSalt(10 , function(err, salt) {
            if(err) return next(new AppError(403 , "fail" , "Generate Salt Failed.")) ;

            bcrypt.hash(password, salt, function(err, hash) {
                if(err) return next(new AppError(403 , "fail" , "Password Hash Failed.")) ;
                else return callback(hash) ;
            });
        })
    }

    async comparePassword(password , db_password , next , callback) {
        bcrypt.compare(password , db_password ,function(err , isMatch) {
            if(err) return next(new AppError(403 , "compare" , "Compare Password Failed."))
            else return callback(isMatch) 
        })
    }

    async tokenForAdmin(userInfo, next, callback) {
        jwt.sign({user : userInfo} , passportConfig.JWT_SECRET_OR_KEY , {
            expiresIn : passportConfig.JWT_TOKEN_EXPIRATION
        } , function (err , token) {
            if(err) return next(new AppError(403 , "token" , "Provide Token Failed."))
            else return callback(token)
        }) ;
    }

    async signIn(req, res, next) {
        console.log("dfdfdf");
        let schemaService = new SchemaService(UserSchema) ;

        const user = await schemaService.findOne({email : req.body.email})

        if(!user) return next(new AppError(403 , "unknown" , "Unknown User") , req, res, next) ;

        await this.comparePassword(req.body.password , user.password , next , async (isMatch) => {
            if(isMatch) {
                if(!user.is_verified_email) return next(new AppError(403 , "verify" , "Email isn't verified.") , req, res, next) ;

                if(user.role !== 'admin') return next(new AppError(403, "role", "You are not administrator."), req, res, next) ;

                await this.tokenForAdmin(user , next , async (token) => {
                    return res.status(200).json({
                        status : "success" ,
                        message : "Login Successfully.",
                        access_token : token ,
                        user_id : user._id,
                    })
                })
            } else {
                return res.status(403).json({
                    status : "match" ,
                    message : "Password isn't matched."
                })
            }
        }) ;
    }

}
  
export default new AuthController();
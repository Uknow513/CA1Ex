import ControllerUtils from '../../utils/ControllerUtils' ;
import SchemaService from '../../services/SchemaService' ;
import UserSchema from "../../schemas/UserSchema";
import ProfileSchema from '../../schemas/ProfileSchema';

import AppError from '../../utils/AppError';
import SendMail from '../../utils/SendMail';
import { formatDBDate } from '../../utils/Helper';

import passportConfig from '../../../configs/passportConfig' ;

import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken' ;
import WalletSchema from '../../schemas/WalletSchema';
import AccountSchema from '../../schemas/AccountSchema' ;

class AuthController extends ControllerUtils {
  
    constructor() {
        super() ;

        // if you are not defined this, you will use signUp function but you can't use async and await.
        this.tokenForUser = this.tokenForUser.bind(this) ;
        this.createPassword =  this.createPassword.bind(this) ;
        this.comparePassword = this.comparePassword.bind(this) ;
        this.confirmUser = this.confirmUser.bind(this) ;
        this.signUp = this.signUp.bind(this) ;
        this.signIn = this.signIn.bind(this) ;
        this.profile = this.profile.bind(this) ;
        this.profileEdit = this.profileEdit.bind(this) ;
    }

    async createPassword(password , callback) {
        bcrypt.genSalt(10 , function(err, salt) {
            if(err) return next(new AppError(400 , "fail" , "Generate Salt Failed.")) ;

            bcrypt.hash(password, salt, function(err, hash) {
                if(err) return next(new AppError(400 , "fail" , "Password Hash Failed.")) ;
                else return callback(hash) ;
            });
        })
    }

    async comparePassword(password , db_password , next , callback) {
        bcrypt.compare(password , db_password ,function(err , isMatch) {
            if(err) return next(new AppError(401 , "compare" , "Compare Password Failed."))
            else return callback(isMatch) 
        })
    }

    async tokenForUser(userInfo, next, callback) {
        jwt.sign({user : userInfo} , passportConfig.JWT_SECRET_OR_KEY , {
            expiresIn : passportConfig.JWT_TOKEN_EXPIRATION
        } , function (err , token) {
            if(err) return next(new AppError(401 , "token" , "Provide Token Failed."))
            else return callback(token)
        }) ;
    }

    async signUp( req, res , next) {

        await this.createPassword(req.body.password , async (hash) => {
            let schemaService = new SchemaService(UserSchema) ;

            let user = await schemaService.findOne({
                email :  req.body.email
            }) ;

            if(user) return next(new AppError(403, "fail", "User Already Exist."), req, res, next) ;

            user = await schemaService.store({
                ...req.body,
                password : hash,
            })

            schemaService = new SchemaService(WalletSchema) ;

            let wallet = await schemaService.store({
                user_id : user._id
            }) ;

            if(!wallet) return next(new AppError(403, 'fail', 'Wallet Create Failed'), req, res, next) ;
            
            if(!user) return next(new AppError(403 , "fail" , "User Create Failed.") , req, res, next) ;
            else {
                res.status(200).json({
                    status : "success",
                    message : "User Created Successfully.",
                })
                await SendMail(req.body.email, async (code) => {
                    schemaService = new SchemaService(UserSchema) ;

                    user = await schemaService.findOne({
                        email : req.body.email
                    }) ;
                   
                   user.email_verify_code = code ;
                   user.save() ;
                })
            }
        }) ;
    }

    async signIn(req, res, next) {
        let schemaService = new SchemaService(UserSchema) ;

        const user = await schemaService.findOne({email : req.body.email}) ;

        if(!user) return next(new AppError(403 , "unknown" , "Unknown User") , req, res, next) ;

        await this.comparePassword(req.body.password , user.password , next , async (isMatch) => {
            if(isMatch) {
                if(!user.is_verified_email) return next(new AppError(403 , "verify" , "Email isn't verified.") , req, res, next) ;

                const profile = await schemaService.hasOne({
                    email : req.body.email, 
                } , 'profile_id' ) ;

                await this.tokenForUser(user , next , async (token) => {
                    return res.status(200).json({
                        status : "success" ,
                        message : "Login Successfully.",
                        access_token : token ,
                        is_created_profile : profile.profile_id ? true : false,
                        profile : profile.profile_id   ? {
                                                            ...profile.toJSON().profile_id ,
                                                            birthday : formatDBDate(profile.profile_id.birthday, "date")
                                                        }
                                                        : {}
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
    
    async confirmUser (req, res, next) {
        const schemaService = new SchemaService(UserSchema) ;

        const user = await schemaService.findOne({
            email : req.body.email, 
            email_verify_code : req.body.email_verify_code
        }) ;

        if(!user) return next(new AppError(401 , "fail" , "Confirm User Failed.") , req, res, next) ;
        
        user.is_verified_email = true ;
        await user.save() ;

        const profile = await schemaService.hasOne({
            email : req.body.email, 
            email_verify_code : req.body.email_verify_code
        } , 'profile_id' ) ;

        await this.tokenForUser(user , next , async (token) => {
            return res.status(200).json({
                status : "success" ,
                message : "Confirm Successfully.",
                access_token : token ,
                is_created_profile : profile.profile_id ? true : false ,
                profile : profile.profile_id ? profile.profile_id : {}
            })
        })
    }

    async profile( req, res, next) {
        
        let schemaService = new SchemaService(ProfileSchema) ;

        const profile = await schemaService.store({
            ...req.body ,
            user_id : req.user._id
        }) ;

        if(!profile) return next(new AppError(400 , "fail" , "Profile Created Failed.") , req, res, next) 

        schemaService = new SchemaService(UserSchema) ;

        const user = await schemaService.findOne({
            email : req.user.email
        }) ;

        user.profile_id = profile._id ;
        user.save() ;

        return res.status(200).json({
            status : "success",
            message : "Profile Created Successfully.",
            profile : profile,
            is_created_profile : true
        })
    }

    async profileEdit( req, res, next) {
        
        let schemaService = new SchemaService(ProfileSchema) ;

        let profile = await schemaService.findOne({
            _id : req.body._id
        })

        if(!profile) return next(new AppError(401, "profile" , "Profile Does Not Exist"), req, res, next) ;
        
        profile = await schemaService.findOneAndUpdate({_id : req.body._id} , {
            "$set" : {
                ...req.body
        }}) ;

        if(!profile) return next(new AppError(400 , "fail" , "Profile Changed Failed.") , req, res, next) 

        return res.status(200).json({
            status : "success",
            message : "Profile Changed Successfully.",
            profile :  {
                ...profile.toJSON() ,
                birthday : formatDBDate(profile.birthday, "date")
            }
        })
    }
}
  
export default new AuthController();
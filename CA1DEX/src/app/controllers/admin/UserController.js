import ControllerUtils from '../../utils/ControllerUtils' ;
import SchemaService from '../../services/SchemaService' ;

import UserSchema from "../../schemas/UserSchema";
import ProfileSchema from '../../schemas/ProfileSchema' ;

import AppError from '../../utils/AppError';
import { formatDBDate } from '../../utils/Helper';

class UserController extends ControllerUtils {
  
    constructor() {
        super() ;

        // if you are not defined this, you will use signUp function but you can't use async and await.
        this.userList = this.userList.bind(this) ;
        this.deleteUser = this.deleteUser.bind(this) ;
        this.updateUserProfile = this.updateUserProfile.bind(this) ;
        this.createUserProfile = this.createUserProfile.bind(this) ;
    }

    async userList (req, res, next) {
        let schemaService = new SchemaService(UserSchema) ;

        const users = await schemaService.hasAll({} , 'profile_id') ;

        if(!users) return next(new AppError(403, "userlist", "Get User List Failed."), req, res, next) ;

        let userList = [] ;

        for(let user of users) {
            userList.push({
                _id : user._id,
                email : user.email,
                password : user.password,
                refferal_code : user.refferal_code,
                is_email_verified : user.is_email_verified,
                is_phone_verified : user.is_phone_verified,
                createdAt : formatDBDate(user.createdAt , "datetime"),
                status : user.allowed,
                profile : user.profile_id ? {
                    _id : user.profile_id._id,
                    first_name : user.profile_id.first_name,
                    last_name : user.profile_id.last_name,
                    street : user.profile_id.street,
                    country : user.profile_id.country,
                    language : user.profile_id.language,
                    postal_code : user.profile_id.postal_code,
                    city : user.profile_id.city,
                    birthday : formatDBDate(user.profile_id.birthday, "date")
                } : null
            });
        }
        res.status(200).json({
            userList : userList
        })

    }

    async deleteUser(req, res, next) {

        let schemaService = new SchemaService(UserSchema) ;

        let user = await schemaService.hasOne({
            _id : req.body._id
        })

        let result = await schemaService.delete({
            _id : user._id
        })

        if(!result) return next(new AppError(403, "deleteUser", "Delete User Failed."), req, res, next) ;
        
        schemaService = new SchemaService(ProfileSchema) ;
        result = await schemaService.delete({
            _id : user.profile_id
        })

        if(!result) return next(new AppError(403, "deleteUser", "Delete Profile Related User Failed"), req, res, next) ;

        return res.status(200).json({
            status : 'success'
        })
    }

    async updateUserProfile(req, res, next) {

        let schemaService = new SchemaService(ProfileSchema) ;
    
        let profile = await schemaService.findOne({
            _id : req.body._id
        })

        if(!profile) return next(new AppError(403, "profile" , "Profile Does Not Exist"), req, res, next) ;
        
        profile = await schemaService.findOneAndUpdate({_id : req.body._id} , {
            "$set" : {
                ...req.body
        }}) ;

        if(!profile) return next(new AppError(403 , "fail" , "Profile Changed Failed.") , req, res, next) 

        return res.status(200).json({
            status : "success",
            message : "Profile Updated Successfully.",
            profile :  {
                ...profile.toJSON() ,
                birthday : formatDBDate(profile.birthday, "date")
            }
        })
    }

    async createUserProfile(req, res, next) {

        let schemaService = new SchemaService(ProfileSchema) ;

        const profile = await schemaService.store( req.body ) ;

        if(!profile) return next(new AppError(403 , "fail" , "Profile Created Failed.") , req, res, next) ;

        schemaService = new SchemaService(UserSchema) ;

        const user = await schemaService.findOne({
            _id : req.body.user_id
        });

        if(!user) return next(new AppError(403, "fail", "User Does Not Exist."), req, res, next) ;

        user.profile_id = profile._id ;
        user.save() ;

        return res.status(200).json({
            status : "success",
            message : "Profile Created Successfully.",
            profile : profile,
            is_created_profile : true
        })
    }
}
  
export default new UserController();
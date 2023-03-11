import ControllerUtils from '../../utils/ControllerUtils' ;
import SchemaService from '../../services/SchemaService' ;

import NotificationSchema from '../../schemas/NotificationSchema' ;

import AppError from '../../utils/AppError';

class UserController extends ControllerUtils {
  
    constructor() {
        super() ;

        // if you are not defined this, you will use signUp function but you can't use async and await.
        this.notificationList = this.notificationList.bind(this) ;
        this.addNotification = this.addNotification.bind(this) ;
        this.deleteNotification = this.deleteNotification.bind(this) ;
    }

    async notificationList(req, res, next) {
        let schemaService = new SchemaService(NotificationSchema) ;

        const notifications = await schemaService.find({}) ;

        if(!notifications) return next(new AppError(403, "notificationList", "Get Notification List Failed."), req, res, next) ;

        res.status(200).json({
            notificationList : notifications
        })
    }

    async addNotification(req, res, next) {

        let schemaService = new SchemaService(NotificationSchema) ;

        const notification = await schemaService.store( req.body ) ;

        if(!notification) return next(new AppError(403 , "fail" , "Notification Created Failed.") , req, res, next) ;

        const notifications = await schemaService.find({}) ;

        global.io.emit("sendDataServer",  notifications );

        return res.status(200).json({
            status : "success",
            message : "Notification Created Successfully.",
            notification : notification
        })
    }

    async deleteNotification(req, res, next) {

        let schemaService = new SchemaService(NotificationSchema) ;

        const result = await schemaService.delete( req.body ) ;

        if(!result) return next(new AppError(403 , "fail" , "Delete Notification Failed.") , req, res, next) ;

        return res.status(200).json({
            status : 'success'
        })
    }

     
}
  
export default new UserController();
import ActionTypes from "./actionTypes";
import axios from "axios";
import { authorization, errorHandler } from "../../../utils/Helper";
import * as config from "../../../static/constants";

export const NotificationList = () => async dispatch => {
    try {

        const header = authorization('ex') ;

        let res = await axios.post(`${config.PRIVATE_CA1EX_ADMIN_API}notification/notificationList`, {} , header) ;

        if(res.status === 200){
            return dispatch({
                type : ActionTypes.ExNotificationList,
                payload : res.data.notificationList
            })
        }
    } catch(err) {
        console.log(errorHandler(err)) ;

        return dispatch({
            type : ActionTypes.ExNotificationListError,
        })
    }
}

export const AddNotification = (title, description, navigate) => async dispatch => {
    try {
        console.log("Add Notification") ;

        const header = authorization('ex') ;

        let res = await axios.post(`${config.PRIVATE_CA1EX_ADMIN_API}/notification/addNotification` , {
            title : title,
            description : description
        } , header) ;

        if(res.status === 200) {
            dispatch({
                type : ActionTypes.ExAddNotification
            })
            navigate('/ex/notification') ;
        }

    } catch(err) {

        console.log(errorHandler(err)) ;

        return dispatch({
            type : ActionTypes.ExAddNotificationError
        })
    }
}

export const DeleteNotification = (_id) => async dispatch => {
    try {
        const header = authorization('ex') ;

        let res = await axios.post(`${config.PRIVATE_CA1EX_ADMIN_API}/notification/deleteNotification` , {
            _id : _id
        } , header) ;

        if(res.status === 200) {
            dispatch({
                type : ActionTypes.ExDeleteNotification
            })
            return true ;
        }

        return false ;

    } catch(err) {

        console.log(errorHandler(err)) ;

         dispatch({
            type : ActionTypes.ExDeleteNotificationError
        })
    }
}

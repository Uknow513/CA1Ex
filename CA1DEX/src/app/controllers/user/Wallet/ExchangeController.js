import ControllerUtils from "../../../utils/ControllerUtils";
import AppError from "../../../utils/AppError";
import { formatDBDate } from "../../../utils/Helper";

import SchemaService from "../../../services/SchemaService";

import PayorderSchema from "../../../schemas/PayorderSchema";


class ExchangeController extends ControllerUtils {
    constructor() {
        super() ;

        this.depositHistory = this.depositHistory.bind(this) ;
    }

    async depositHistory(req, res, next) {
        let schemaService = new SchemaService(PayorderSchema) ;

        let orders = await schemaService.find({
            user_id : req.body.user_id,
            payment_type : "deposit",
            reference : req.body.method,
            status : {
                '$not' : {
                    '$regex' : 'cancelled'
                }
            }
        })

        if(!orders) return next(new AppError(403, 'fail', 'Get Fiat History Failed'), req, res, next) ;
        
        let result = [] ;

        for(let element of orders){
            result.push({
                ...element.toJSON(),
                date : formatDBDate(element.createdAt, "datetime") 
            })
        }
        res.status(200).json({
            pay_orders : result
        })
    }

    
}

export default new ExchangeController() ;
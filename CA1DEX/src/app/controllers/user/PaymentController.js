import SchemaService from "../../services/SchemaService";
import { NowPayment } from '../../services/ChainService';

import AppError from "../../utils/AppError";
import ControllerUtils from "../../utils/ControllerUtils";

import PayorderSchema from '../../schemas/PayorderSchema';


class PaymentController extends ControllerUtils {
    constructor() {
        super() ;

        this.fiatDeposit = this.fiatDeposit.bind(this) ;
    }

    async fiatDeposit(req, res, next) {

        let schemaService =  new SchemaService(PayorderSchema) ;

        let order = await schemaService.store({
            ...req.body,
            user_id : req.user._id,
            payment_id : 0,
            reference : 'fiat',
            payment_type : 'deposit',
            status : 'requesting'
        })

        if(!order) return next(new AppError(403, 'fail', 'Fiat Deposit Failed.'), req, res, next) ;

        let invoice_url = await NowPayment(Number(req.body.amount), req.body.unit, req.user._id, order._id) ;

        if(!invoice_url) return next(new AppError(403, 'payment' , 'NowPayment Failed.'), req, res, next) ;

        res.status(200).json({
            invoice_url : invoice_url
        });
    }
}

export default new PaymentController() ;
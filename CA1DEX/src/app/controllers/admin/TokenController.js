import ControllerUtils from '../../utils/ControllerUtils' ;
import SchemaService from '../../services/SchemaService' ;
import TokenSchema from "../../schemas/TokenSchema";

import AppError from '../../utils/AppError';
import { delUploadedFile, formatDBDate } from '../../utils/Helper';

class TokenController extends ControllerUtils {
  
    constructor() {
        super() ;

        // if you are not defined this, you will use signUp function but you can't use async and await.
        this.tokenList = this.tokenList.bind(this) ;
        this.addToken = this.addToken.bind(this);
    }

    async tokenList (req, res, next) {

        let schemaService = new SchemaService(TokenSchema) ;

        const tokens = await schemaService.find({}) ;

        if(!tokens) return next(new AppError(403, "tokenList", "Get Token List Failed."), req, res, next) ;

        res.status(200).json({
            tokenList : tokens
        });
    }

    async addToken(req, res, next) {
        let schemaService = new SchemaService(TokenSchema) ;

        let token = await schemaService.findOne({
            token_address : req.body.token_address,
            symbol : req.body.symbol,
            pair : req.body.pair
        }) ;

        if(token) return next(new AppError(403, 'addToken' , 'Token is already exist.'), req, res, next) ;

        token = await schemaService.store({
            ...req.body,
            logo : 'logos/' + req.files.logo[0].filename,
            whitepaper : 'papers/' + req.files.paper[0].filename
        }) ;

        if(!token) return next(new AppError(403, 'addToken' , 'Add Token Failed.'), req, res, next) ;

        res.status(200).json({
            token : token
        }) ;
    }

    async deleteToken(req, res, next) {
        let schemaService = new SchemaService(TokenSchema) ;

        let token = await schemaService.findOne({
            _id : req.body._id
        }) ;

        await delUploadedFile(token.whitepaper) ;
        await delUploadedFile(token.logo) ;

        const result = await schemaService.delete(req.body) ;

        if(!result) return next(new AppError(403, 'deleteToken', 'Delete Token Failed.'), req, res, next) ;

        return res.status(200).json({
            result : 'success'
        }) ;
    }
}
  
export default new TokenController();
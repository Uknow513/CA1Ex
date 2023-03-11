import ControllerUtils from "../../utils/ControllerUtils";
import AppError from "../../utils/AppError";
import { formatDBDate, numberToPlanString, isset } from "../../utils/Helper";

import SchemaService from "../../services/SchemaService";
import { PairInfoList } from '../../services/ChainService';

import OrderSchema from '../../schemas/OrderSchema'  ;
import TokenSchema from "../../schemas/TokenSchema" ;
// import WalletSchema from '../../schemas/WalletSchema' ;
// import AccountSchema from '../../schemas/AccountSchema' ;

class ExchangeController extends ControllerUtils {

    constructor() {
        super() ;

        this.Orders = new SchemaService(OrderSchema) ;
        this.Tokens = new SchemaService(TokenSchema) ;

        this.tokenPairList = this.tokenPairList.bind(this) ;
    }

    async tokenPairList(req, res, next) {

        let pairInfoList = await PairInfoList() ;
        
        if(!pairInfoList) return next(new AppError(403, "fail", "Third Party Error."), req, res, next) ;

        let tokenList = await this.Tokens.find({}) ;

        let tokenPairList = [] ;

        for(let token of tokenList) {

            let pairs = token.pair.split(',');

            for( let pair of pairs) {

                let pairInfo = await this.Tokens.findOne({
                    symbol : pair
                }) ;

                let price = null ;
                let high = null ;
                let low = null;
                let volume = null ;
                let percentChange = null ;

                let orderBuyList = await this.Orders.findAndSort({
                    token : token._id,
                    pair : pairInfo._id,
                    type : 'buy'
                }, { price : -1 }) ;

                if(!orderBuyList.length === 0) {
                    high = 0
                } else {
                    high = orderBuyList[0].price ;
                }

                let orderSellList = await this.Orders.findAndSort({
                    token : token._di,
                    pair : pairInfo._id,
                    type : 'sell'
                }, { price : 1 }) ;

                if(orderSellList.length === 0) {
                    low = 0 ;
                } else {
                    low = orderSellList[0].price ;
                }
            }

            // let orderBuyList = await this.Orders.findAndSort({
            //     token : token._id,
            //     type : 'buy'
            // }, { price : -1 }) ;

            // let orderSellList = await this.Orders.find({
            //     token : token._id,
            //     type : 'sell'
            // }, { price : -1 }) ;

            if( isset( pairInfoList[token.pair+"_"+token.symbol] ) ){
                pairInfo = pairInfoList[token.pair+"_"+token.symbol] ;

                tokenPairList.push({
                    token : {
                        name : token.name,
                        symbol : token.symbol,
                    },
                    pair : {
                        symbol : token.pair
                    },
                    logo : token.logo,
                    price : pairInfo['last'],
                    high : pairInfo['high24hr'],
                    low : pairInfo['low24hr'],
                    volume : pairInfo['baseVolume'],
                    percent : pairInfo['percentChange']
                })
            } else if( isset( pairInfoList[token.symbol+"_"+token.pair] ) ) {
                pairInfo = pairInfoList[token.symbol+"_"+token.pair] ;

                tokenPairList.push({
                    token : {
                        name : token.name,
                        symbol : token.symbol,
                    },
                    pair : {
                        symbol : token.pair
                    },
                    logo : token.logo ,
                    price : 1 / Number(pairInfo['last']) ,
                    high : Number( 1 / pairInfo['low24hr'] ),
                    low : Number( 1 / pairInfo['high24hr'] ),
                    volume : pairInfo['quoteVolume'],
                    percent : pairInfo['percentChange']
                })
            }
        }

        return res.status(200).json({
            tokenPairList : tokenPairList
        }) ;
    }
}

export default new ExchangeController() ;
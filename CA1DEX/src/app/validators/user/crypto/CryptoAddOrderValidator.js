import * as Yup from 'yup';
import { defaultResponse, validateValue , validateParams } from '../../../common/DefaultValidation';


export default async (req, res, next) => {
    try {
        
        const isValidateParams = await validateParams(9 , req , res) ;

        if(!isValidateParams){
            return res
                .status(202)
                .json({
                    error : "Parameters failed" ,
                    message : "overflow parameters"
                })
        }

        const schema = Yup.object().shape({
            toAmount : Yup.number().required(),
            toCrypto : Yup.string().required() ,
            fromAmount : Yup.number().required() ,
            fromCrypto : Yup.string().required() ,
            exchangePrice : Yup.number().required(),
            fee : Yup.number().required(),
            type : Yup.string().required() ,
            payType : Yup.string().required() ,
            status : Yup.number().required()
        });

        await validateValue(schema, req.body);
        
        return next();

    } catch (error) {
        return defaultResponse(res, error);
    }
};
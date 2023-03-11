import * as Yup from 'yup';
import { defaultResponse, validateValue , validateParams } from '../../../common/DefaultValidation';


export default async (req, res, next) => {
    try {
        
        const isValidateParams = await validateParams(2 , req , res) ;

        if(!isValidateParams){
            return res
                .status(202)
                .json({
                    error : "Parameters failed" ,
                    message : "overflow parameters"
                })
        }

        const schema = Yup.object().shape({
            fromCrypto : Yup.string().required(),
            toCrypto : Yup.string().required()
        });

        await validateValue(schema, req.body);
        
        return next();

    } catch (error) {
        return defaultResponse(res, error);
    }
};
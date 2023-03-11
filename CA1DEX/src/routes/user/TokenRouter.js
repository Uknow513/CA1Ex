import passport from 'passport' ;
import express from 'express' ;

// _____ controller __________
import ExchangeController from '../../app/controllers/user/ExchangeController';

// ________ validator _____________
// import CryptoOrderListValidator from '../../app/validators/user/crypto/CryptoOrderListValidator' ;
 
const router = express.Router() ;

router.post('/tokenPairList' , ExchangeController.tokenPairList) ;

router.post('/*' , passport.authenticate('jwt', { session: false })) ;

export default router ;

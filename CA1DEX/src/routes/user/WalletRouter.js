import passport from 'passport' ;
import express from 'express' ;

// __________ controllers ______________
import PaymentController from '../../app/controllers/user/PaymentController';
import ExchangeController from '../../app/controllers/user/Wallet/ExchangeController';

// __________ validators _______________
import FiatDepositValidator from '../../app/validators/user/wallet/FiatDepositValidator';
import DepositHistoryValidator from '../../app/validators/user/wallet/DepositHistoryValidator';

const router = express.Router() ;

router.post('/*' , passport.authenticate('jwt', { session: false }));

router.post('/fiatDeposit' , [FiatDepositValidator] , PaymentController.fiatDeposit) ;
router.post('/depositHistory' , [DepositHistoryValidator] , ExchangeController.depositHistory) ;


export default router ;

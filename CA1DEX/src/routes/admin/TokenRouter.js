import express from 'express';
import passport from 'passport' ;
import Upload from '../../app/middlewares/Upload';

// controllers
import TokenController from '../../app/controllers/admin/TokenController';

// validators
import AddTokenValidator from '../../app/validators/admin/Token/AddTokenValidator' ;
import DeleteTokenValidator from '../../app/validators/admin/Token/DeleteTokenValidator';

const router = express.Router() ;

router.post('/*' , passport.authenticate('jwt', { session: false }));

router.post('/tokenList' , TokenController.tokenList) ;
router.post('/addToken', Upload, [AddTokenValidator] , TokenController.addToken) ;
router.post('/deleteToken', [DeleteTokenValidator], TokenController.deleteToken) ;

export default router ;
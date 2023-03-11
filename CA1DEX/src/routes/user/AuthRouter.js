import express from 'express';
import passport from 'passport' ;

// controllers
import AuthController from '../../app/controllers/user/AuthController';

// validators
import SignUpValidator from '../../app/validators/user/auth/SignUpValidator';
import SignInValidator from '../../app/validators/user/auth/SignInValidator';
import ConfirmValidator from '../../app/validators/user/auth/ConfirmValidator';
import ProfileValidator from '../../app/validators/user/auth/ProfileValidator.js' ;
import ProfileEditValidator from '../../app/validators/user/auth/ProfileEditValidator.js' ;

const router = express.Router() ;

router.post('/signup' , [SignUpValidator] , AuthController.signUp) ;
router.post('/signin' , [SignInValidator] , AuthController.signIn) ;
router.post('/confirm', [ConfirmValidator], AuthController.confirmUser) ;

router.post('/*' , passport.authenticate('jwt', { session: false }));

router.post('/profile', [ProfileValidator], AuthController.profile) ;
router.post('/editprofile' , [ProfileEditValidator] , AuthController.profileEdit) ; 

export default router;
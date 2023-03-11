import { Router } from 'express';
import AuthRouter from './AuthRouter' ;
import TokenRouter from './TokenRouter' ;
import WalletRouter from './WalletRouter' ;

const routes = new Router();

routes.use('/auth' , AuthRouter) ;
routes.use('/token', TokenRouter) ;
routes.use('/wallet', WalletRouter) ;
  
export default routes;
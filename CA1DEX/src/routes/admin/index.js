import { Router } from 'express';

import AuthRouter from './AuthRouter' ;
import UserRouter from './UserRouter' ;
import TokenRouter from './TokenRouter' ;
import NotificationRouter from './NotificationRouter' ;

const routes = new Router();

routes.use('/auth' , AuthRouter) ;
routes.use('/user' , UserRouter) ;
routes.use('/token', TokenRouter) ;
routes.use('/notification', NotificationRouter) ;
  
export default routes;
import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminRequired } from '../middlewares';
import { orderService, userService } from '../services';
import jwt from 'jsonwebtoken';

const orderRouter = Router();

orderRouter.post('/register', async (req, res, next) => {
  try {
    // req (request)의 body 에서 데이터 가져오기
    const orderList = req.body.orderList;
    const email = req.body.email;
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    const postalCode = req.body.postalCode;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const address = { postalCode, address1, address2 };

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      orderList,
      email,
      fullName,
      phoneNumber,
      address,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//전체 주문 목록 가져오기(관리자용)
orderRouter.get('/orderList', adminRequired, async (req, res, next) => {
  try {
    var countPerPage = req.query.countperpage;
    var pageNo = req.query.pageno;
    const orders = await orderService.getOrders();
    var ordersList = await orderService.pagingOrder(
      orders,
      countPerPage,
      pageNo
    );
    res.json({ ordersList });
  } catch (error) {
    next(error);
  }
});

//현재 사용자 주문 정보 가져오기
orderRouter.get('/orders', loginRequired, async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const userId = jwtDecoded.userId;
    const email = await userService.getUserEmail(userId);
    const currentEmail = email.email;
    const userOrder = await orderService.getUserOrder(currentEmail);
    res.status(200).json(userOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.delete(
  '/orders/:orderId',
  loginRequired,
  async (req, res, next) => {
    try {
      // params로부터 id를 가져옴
      const orderId = req.params.orderId;
      const deletedOrderInfo = await orderService.deleteOrder(orderId);
      res.status(200).json(deletedOrderInfo);
    } catch (error) {
      next(error);
    }
  }
);
export { orderRouter };

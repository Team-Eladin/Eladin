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

//pageno: 페이지 번호 1이면 1번부터 10번까지
//countperpage: 페이지크기 url에서 가져올 페이지 크기 설정
//페이지크기가 20이고 페이지번호가 2면 21번부터 40번까지
//전체 주문 목록 가져오기(관리자용)
orderRouter.get('/orderlist', adminRequired, async (req, res, next) => {
  try {
    //전체 주문 목록을 얻음
    const orders = await orderService.getOrders();
    var countPerPage = req.query.countperpage;
    // 페이지 번호
    var pageNo = req.query.pageno;
    if (
      countPerPage == undefined ||
      typeof countPerPage == 'undefined' ||
      countPerPage == null
    ) {
      countPerPage = 10;
    } else {
      countPerPage = parseInt(countPerPage);
    }
    if (pageNo == undefined || typeof pageNo == 'undefined' || pageNo == null) {
      pageNo = 0;
    } else {
      pageNo = parseInt(pageNo);
    }
    if (pageNo > 0) {
      // 전체 크기
      var totalCount = orders.length;
      // 시작 번호
      var startItemNo = (pageNo - 1) * countPerPage;
      // 종료 번호
      var endItemNo = pageNo * countPerPage - 1;
      // 종료 번호가 전체 크기보다 크면 전체 크기로 변경
      if (endItemNo > totalCount - 1) {
        endItemNo = totalCount - 1;
      }
      var orderList = [];
      if (startItemNo < totalCount) {
        for (var index = startItemNo; index <= endItemNo; index++) {
          orderList.push(orders[index]);
        }
      }
      res.json({ data: orderList });
    } else {
      res.json({ data: orders });
    }
  } catch (error) {
    console.log('innerAPI');
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

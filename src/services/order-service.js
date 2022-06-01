import { orderModel, Order } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }
  async addOrder(orderInfo) {
    // 객체 destructuring
    const createdOrder = await this.orderModel.create(orderInfo);
    return createdOrder;
  }
  //전체 주문 조회
  async getOrders() {
    const orders = await this.orderModel.findAll();
    return orders;
  }
  //email로 특정 사용자의 주문 정보 조회
  async getUserOrder(email) {
    const userOrder = await this.orderModel.findByEmail(email);
    return userOrder;
  }
  //주문 정보 삭제
  async deleteOrder(orderId) {
    const order = await this.orderModel.delete({
      _id: orderId,
    });
    return order;
  }

  //주문 정보 페이징
  async pagingOrder(orders, countPerPage, pageNo) {
    if (
      countPerPage == undefined ||
      typeof countPerPage == 'undefined' ||
      countPerPage == null
    ) {
      countPerPage = 9;
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
      return orderList;
    } else {
      return orders;
    }
  }
}

const orderService = new OrderService(orderModel);
export { orderService };

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
}

const orderService = new OrderService(orderModel);
export { orderService };

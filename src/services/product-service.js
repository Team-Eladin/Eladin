import { productModel } from '../db';
class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 등록
  async addProduct(productInfo) {
    const createdNewProduct = await this.productModel.create(productInfo);

    return createdNewProduct;
  }

  // 전체 상품 조회
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  //전체 상품 최신순 조회
  async getlatestProducts() {
    const products = await this.productModel.SortByLatest();
    return products;
  }

  //전체 상품 높은가격순 조회
  async getExpensiveProducts() {
    const products = await this.productModel.SortByExpensive();
    return products;
  }

  //전체 상품 낮은가격순 조회
  async getCheapProducts() {
    const products = await this.productModel.SortByCheap();
    return products;
  }
  // 카테고리별 상품 조회
  async getProductByCategory(categoryId) {
    // 우선 해당 카테고리의 상품 정보가 db에 존재하는지 확인
    const product = await this.productModel.findByCategory(categoryId);
    if (!product) {
      throw new Error('해당 카테고리에 상품이 없습니다.');
    }

    return product;
  }

  // 특정 상품 조회
  async getProductById(productId) {
    // 우선 해당 상품이 db에 존재하는지 확인
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('해당 상품이 존재하지 않습니다. 다시 확인해 주세요.');
    }

    return product;
  }

  // 상품 정보 수정
  async setProduct(productId, update) {
    const product = await this.productModel.update({ productId, update });

    return product;
  }

  // 상품 정보 삭제
  async deleteProduct(productId) {
    const product = await this.productModel.delete(productId);

    return product;
  }

  //상품 정보 페이징
  async pagingProduct(products, countPerPage, pageNo) {
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
      var totalCount = products.length;
      // 시작 번호
      var startItemNo = (pageNo - 1) * countPerPage;
      // 종료 번호
      var endItemNo = pageNo * countPerPage - 1;
      // 종료 번호가 전체 크기보다 크면 전체 크기로 변경
      if (endItemNo > totalCount - 1) {
        endItemNo = totalCount - 1;
      }
      var productList = [];
      if (startItemNo < totalCount) {
        for (var index = startItemNo; index <= endItemNo; index++) {
          productList.push(products[index]);
        }
      }
      return productList;
    } else {
      return products;
    }
  }
}

const productService = new ProductService(productModel);

export { productService };

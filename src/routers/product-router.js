import { Router } from 'express';
import is from '@sindresorhus/is';
import { productService, categoryService } from '../services';
import { imageUpload } from '../middlewares'

const productRouter = Router();

// 상품 등록 api
productRouter.post('/register', async (req, res, next) => {
    try {
        if (is.emptyObject(req.body)) {
            throw new Error(
                'headers의 Content-Type을 application/json으로 설정해주세요'
            );
        }
        console.log('inside post router')
        // 입력된 카테고리를 카테고리 DB에서 검색 후 변수에 할당
        const findCategory = await categoryService.getCategoryByName(req.body.category);
        const category = findCategory;
        console.log(category);
        // req에서 데이터 가져와 변수에 할당
        const { bookName, author, publisher, price, info } = req.body;
        // const imageUrl = req.files.map(image => image.location);
        console.log(bookName);
        // 위 데이터를 상품 db에 추가하기
        const newProduct = await productService.addProduct({
            bookName,
            author,
            publisher,
            price,
            info
            //category,
        });

        // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
        res.status(200).json(newProduct);
    } catch (error) {
        next(error);
    }
});

// 전체 상품 목록 가져옴
productRouter.get('/list', async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
})

// 카테고리별 상품 조회
productRouter.get('/category/:categoryName', async (req, res, next) => {
    try {
        // req의 params에서 데이터 가져옴
        const { categoryName } = req.params;

        // 카테고리명을 기준으로 Categories DB 조회
        const findCategory = await categoryService.getCategoryByName(categoryName);
        // 조회된 데이터(categoryModel)를 기준으로 Products DB 조회
        const products = await productService.getProductByCategory(findCategory);

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
})

// 특정 상품 조회
productRouter.get('/:productId', async (req, res, next) => {
    try {
        // req의 params에서 데이터 가져옴
        const { productId } = req.params;

        // id를 기준으로 DB에서 상품 조회
        const product = await productService.getProductById(productId);

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
})

// 상품 정보 수정
productRouter.post('/setProduct/:productId', async (req, res, next) => {
    try {
        // req의 params와 body에서 데이터 가져옴
        const { productId } = req.params;
        const { bookName, author, publisher, price, info } = req.body;

        // 입력된 카테고리를 카테고리 DB에서 검색 후 변수에 할당
        const findCategory = await categoryService.getCategoryByName(req.body.category);
        const category = findCategory;

        // 데이터를 상품 db에 반영하기
        const updateProduct = await productService.setProduct(productId, {
            bookName,
            author,
            publisher,
            price,
            info,
            category
        });

        res.status(200).json(updateProduct);
    } catch (error) {
        next(error);
    }

})

// 상품 정보 삭제
productRouter.delete('/deleteProduct/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;

        const deleteProduct = await productService.deleteProduct(productId);

        res.status(200).json(deleteProduct);
    } catch (error) {
        next(error);
    }

})

export { productRouter };
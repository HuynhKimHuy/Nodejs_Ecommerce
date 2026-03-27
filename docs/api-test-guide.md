# Hướng dẫn nhanh test API

Base URL: `http://localhost:3052`

## Header bắt buộc cho client API
- `x-api-key`: API key hợp lệ (ví dụ key đã seed: `dfc240da14f111f18ca353e948e08d9358e537cf1bf73d08cd57421f7d880358`) — **cần cho login, product, logout; Signup là public**.

## Luồng tài khoản (shop)
1) **Signup** (PUBLIC - không cần x-api-key)
   - `POST /v1/api/shop/signup`
   - Headers: `Content-Type: application/json`
   - Body: `{ "name": "Demo Shop", "email": "demo@email.com", "password": "123456" }`
   - Kết quả: trả về `shop._id`, `tokens.accessToken`, `tokens.refreshToken`.

2) **Login** (cần x-api-key)
   - `POST /v1/api/shop/login`
   - Headers: `Content-Type: application/json`, `x-api-key`
   - Body: `{ "email": "demo@email.com", "password": "123456" }`
   - Kết quả: `shop._id`, `accessToken`, `refreshToken`.

3) **Logout**
   - `POST /v1/api/shop/logout`
   - Headers: `x-api-key`, `x-client-id: <shop._id>`, `authorization: <accessToken>`

4) **Refresh token**
   - `POST /v1/api/shop/handleRefreshToken`
   - Headers: `x-api-key`, `x-client-id: <shop._id>`, `refreshtoken: <refreshToken>`

## Luồng product
Tất cả require auth middleware:
- Headers chung: `x-api-key`, `x-client-id: <shop._id>`, `authorization: <accessToken>`

### Tạo product
- `POST /v1/api/product`
- Body tối thiểu (tùy type):
  - Trường chung: `product_name`, `product_thumb`, `product_price`, `product_quantity`, `product_type`, `product_description` (tùy chọn).
  - `product_type` hợp lệ: `Electronic`, `Clothing`, `Furniture`.
  - `product_attributes` theo từng type:
    - Electronic: `{ "manufacturer": "Sony", "size": "M", "color": "Black" }`
    - Clothing: `{ "brand": "Uniqlo", "size": "L", "material": "Cotton" }`
    - Furniture: `{ "brand": "IKEA", "size": "120x60", "material": "Wood" }`
- Ví dụ body (Electronic):
```json
{
  "product_name": "Headphone X",
  "product_thumb": "https://img.example.com/hp.jpg",
  "product_description": "Noise-cancelling",
  "product_price": 199,
  "product_quantity": 10,
  "product_type": "Electronic",
  "product_attributes": {
    "manufacturer": "Sony",
    "size": "OneSize",
    "color": "Black"
  }
}
```

## Ghi chú
- `product_shop` được lấy từ `req.user.userID` (shop đã đăng nhập), không cần truyền trong body.
- `product_type` phải đúng chữ hoa/thường như trên để khớp registry.
- Nếu dùng Mongo Atlas, đặt `MONGODB_USER` và `MONGODB_PASSWORD` trong `.env` cho chuỗi kết nối.

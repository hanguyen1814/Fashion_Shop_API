## 📘 Mục lục

1. [I. Người dùng](#i-người-dùng-users)
2. [II. Danh mục (Categories)](#ii-danh-mục-categories)
3. [III. Sản phẩm (Products)](#iii-sản-phẩm-products)
4. [IV. Giỏ hàng (Cart)](#iv-giỏ-hàng-cart)
5. [V. Đơn hàng (Orders)](#v-đơn-hàng-orders)
6. [VI. Thương hiệu (Brands)](#vi-thương-hiệu-brands)

## I. Người dùng (Users)

### 1. Đăng ký người dùng

- **[POST]** `/api/users/register`

#### Body Request

```json
{
  "full_name": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "Hanoi"
}
```

#### Response

```json
{
  "status": true,
  "message": "User registered successfully"
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nguyen Van A",
    "email": "vana@example.com",
    "password": "123456",
    "phone": "0123456789",
    "address": "Hanoi"
  }'
```

---

### 2. Đăng nhập

- **[POST]** `/api/users/login`

#### Body Request

```json
{
  "email": "vana@example.com",
  "password": "123456"
}
```

#### Response

```json
{
  "status": true,
  "message": "Login successful",
  "token": "<token>"
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vana@example.com",
    "password": "123456"
  }'
```

---

### 3. Lấy thông tin cá nhân

- **[GET]** `/api/users/me`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "status": true,
  "data": {
    "user_id": 1,
    "full_name": "Nguyen Van A",
    "email": "vana@example.com",
    "phone": "0123456789",
    "address": "Hanoi",
    "role": "user",
    "status": "active",
    "created_at": "2025-03-21T10:00:00.000Z"
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

### 4. Lấy danh sách người dùng (Admin)

- **[GET]** `/api/users`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
{
  "status": true,
  "data": [
    {
      "user_id": 1,
      "full_name": "Nguyen Van A",
      "email": "vana@example.com",
      "phone": "0123456789",
      "address": "Hanoi",
      "role": "user",
      "status": "active",
      "created_at": "2025-03-21T10:00:00.000Z"
    },
    {
      "user_id": 2,
      "full_name": "Admin",
      "email": "admin@example.com",
      "phone": "0987654321",
      "address": "Saigon",
      "role": "admin",
      "status": "active",
      "created_at": "2025-03-20T09:00:00.000Z"
    }
  ]
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5. Lấy người dùng theo ID

- **[GET]** `/api/users/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "status": true,
  "data": {
    "user_id": 1,
    "full_name": "Nguyen Van A",
    "email": "vana@example.com",
    "phone": "0123456789",
    "address": "Hanoi",
    "role": "user",
    "status": "active",
    "created_at": "2025-03-21T10:00:00.000Z"
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <token>"
```

---

### 6. Cập nhật thông tin người dùng

- **[PUT]** `/api/users/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "full_name": "Nguyen Van B",
  "phone": "0999999999",
  "address": "Ho Chi Minh"
}
```

#### Response

```json
{
  "status": true,
  "message": "User updated successfully"
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nguyen Van B",
    "phone": "0999999999",
    "address": "Ho Chi Minh"
  }'
```

---

### 7. Đổi mật khẩu

- **[PUT]** `/api/users/:user_id/password`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "oldPass": "123456",
  "newPass": "654321"
}
```

#### Response

```json
{
  "status": true,
  "message": "Password updated successfully"
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/users/1/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPass": "123456",
    "newPass": "654321"
  }'
```

---

### 8. Xóa người dùng (Admin)

- **[DELETE]** `/api/users/:id`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
{
  "status": true,
  "message": "User deleted successfully"
}
```

#### cURL

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

## II. Danh mục (Categories)

### 1. Lấy tất cả danh mục (dạng cây)

- **[GET]** `/api/cat`

#### Response

```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Thời trang nam",
      "slug": "thoi-trang-nam",
      "description": "Áo quần nam",
      "parent_id": null,
      "brand_id": 1,
      "status": "active",
      "image": "https://example.com/img1.jpg",
      "children": [
        {
          "category_id": 2,
          "name": "Áo sơ mi",
          "slug": "ao-so-mi",
          ...
        }
      ],
      "products": [ ... ]
    }
  ]
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/cat
```

---

### 2. Lấy danh mục theo ID

- **[GET]** `/api/cat/:id`

#### Response

```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "name": "Thời trang nam",
    "slug": "thoi-trang-nam",
    "description": "Áo quần nam",
    "parent_id": null,
    "brand_id": 1,
    "status": "active",
    "image": "https://example.com/img1.jpg",
    "children": [ ... ],
    "cat_tree": [ ... ],
    "products": [ ... ]
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/cat/1
```

---

### 3. Lấy danh mục theo slug

- **[GET]** `/api/cat/slug/:slug`

#### Response

```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "name": "Thời trang nam",
    "slug": "thoi-trang-nam",
    "description": "Áo quần nam",
    "parent_id": null,
    "brand_id": 1,
    "status": "active",
    "image": "https://example.com/img1.jpg",
    "products": [ ... ]
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/cat/slug/thoi-trang-nam
```

---

### 4. Tạo danh mục mới (Admin)

- **[POST]** `/api/cat`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "name": "Phụ kiện",
  "slug": "phu-kien",
  "description": "Các loại phụ kiện thời trang",
  "parent_id": null,
  "brand_id": 1,
  "status": "active",
  "image": "https://example.com/img.jpg"
}
```

#### Response

```json
{
  "success": true,
  "message": "Category created successfully"
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/cat \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phụ kiện",
    "slug": "phu-kien",
    "description": "Các loại phụ kiện thời trang",
    "parent_id": null,
    "brand_id": 1,
    "status": "active",
    "image": "https://example.com/img.jpg"
  }'
```

---

### 5. Cập nhật danh mục (Admin)

- **[PUT]** `/api/cat/:id`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "name": "Phụ kiện nữ",
  "slug": "phu-kien-nu",
  "description": "Túi, dây chuyền...",
  "parent_id": null,
  "brand_id": 2,
  "status": "active",
  "image": "https://example.com/new-img.jpg"
}
```

#### Response

```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/cat/3 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phụ kiện nữ",
    "slug": "phu-kien-nu",
    "description": "Túi, dây chuyền...",
    "parent_id": null,
    "brand_id": 2,
    "status": "active",
    "image": "https://example.com/new-img.jpg"
  }'
```

---

### 6. Xoá danh mục (Admin)

- **[DELETE]** `/api/cat/:id`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

#### cURL

```bash
curl -X DELETE http://localhost:3000/api/cat/3 \
  -H "Authorization: Bearer <admin_token>"
```

---

## III. Sản phẩm (Products)

### 1. Lấy danh sách sản phẩm

- **[GET]** `/api/products?page=1&limit=20`

#### Response

```json
{
  "status": true,
  "data": [
    {
      "product_id": 1,
      "name": "Áo thun",
      "price": 100000,
      "origin_price": 120000,
      "discount": 20000,
      "stock": 50,
      "image": "https://example.com/ao.jpg",
      "variants": [ ... ]
    }
  ]
}
```

#### cURL

```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=20"
```

---

### 2. Lấy sản phẩm theo ID

- **[GET]** `/api/products/:id`

#### Response

```json
{
  "status": true,
  "data": {
    "category": [ ... ],
    "product": {
      "product_id": 1,
      "name": "Áo thun",
      "price": 100000,
      "stock": 50,
      "variants": [ ... ]
    }
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/products/1
```

---

### 3. Lấy sản phẩm theo danh mục

- **[GET]** `/api/products/category/:category`

#### Response

```json
{
  "status": true,
  "data": {
    "category": [ ... ],
    "products": [ ... ]
  }
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/products/category/2
```

---

### 4. Tìm kiếm theo tên

- **[GET]** `/api/products/search/name?name=ao`

#### cURL

```bash
curl -X GET "http://localhost:3000/api/products/search/name?name=ao"
```

---

### 5. Tìm kiếm theo màu sắc

- **[GET]** `/api/products/search/color?color=den`

#### cURL

```bash
curl -X GET "http://localhost:3000/api/products/search/color?color=den"
```

---

### 6. Tìm kiếm theo kích thước

- **[GET]** `/api/products/search/size?size=m`

#### cURL

```bash
curl -X GET "http://localhost:3000/api/products/search/size?size=m"
```

---

### 7. Tìm kiếm theo khoảng giá

- **[GET]** `/api/products/search/price?min=100000&max=300000`

#### cURL

```bash
curl -X GET "http://localhost:3000/api/products/search/price?min=100000&max=300000"
```

---

### 8. Thêm sản phẩm mới (Admin)

- **[POST]** `/api/products`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "category_id": 1,
  "brand_id": 1,
  "name": "Áo Hoodie",
  "description": "Áo hoodie nỉ bông",
  "price": 250000,
  "origin_price": 300000,
  "discount": 50000,
  "stock": 20,
  "sold": 0,
  "image": "https://example.com/hoodie.jpg",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "variants": [
    {
      "color_name": "Đen",
      "size_name": "M",
      "price": 250000,
      "origin_price": 300000,
      "discount": 50000,
      "stock": 10,
      "image": "https://example.com/variant.jpg"
    }
  ]
}
```

#### Response

```json
{
  "status": true,
  "product_id": 12,
  "category_id": 1,
  "name": "Áo Hoodie",
  ...
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "brand_id": 1,
    "name": "Áo Hoodie",
    "description": "Áo hoodie nỉ bông",
    "price": 250000,
    "origin_price": 300000,
    "discount": 50000,
    "stock": 20,
    "sold": 0,
    "image": "https://example.com/hoodie.jpg",
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "variants": [
      {
        "color_name": "Đen",
        "size_name": "M",
        "price": 250000,
        "origin_price": 300000,
        "discount": 50000,
        "stock": 10,
        "image": "https://example.com/variant.jpg"
      }
    ]
  }'
```

---

### 9. Cập nhật sản phẩm (Admin)

- **[PUT]** `/api/products/:id`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "category_id": 1,
  "brand_id": 2,
  "name": "Áo khoác dạ",
  "description": "Áo khoác mùa đông",
  "price": 450000,
  "origin_price": 500000,
  "discount": 50000,
  "stock": 5,
  "image": "https://example.com/khoac.jpg",
  "images": ["https://example.com/k1.jpg"]
}
```

#### Response

```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Áo khoác dạ",
    ...
  }
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "brand_id": 2,
    "name": "Áo khoác dạ",
    "description": "Áo khoác mùa đông",
    "price": 450000,
    "origin_price": 500000,
    "discount": 50000,
    "stock": 5,
    "image": "https://example.com/khoac.jpg",
    "images": ["https://example.com/k1.jpg"]
  }'
```

---

### 10. Xoá sản phẩm (Admin)

- **[DELETE]** `/api/products/:id`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
{
  "status": true,
  "message": "Product deleted successfully"
}
```

#### cURL

```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

## IV. Giỏ hàng (Cart)

### 1. Thêm sản phẩm vào giỏ hàng

- **[POST]** `/api/cart/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "productId": 1,
  "variantId": 5,
  "quantity": 2
}
```

#### Response

```json
{
  "status": true,
  "data": {
    "product_name": "Áo thun",
    "product_image": "https://example.com/img.jpg",
    "price": 100000,
    "stock": 20,
    "color_id": 1,
    "size_id": 2,
    "variant_image": "https://example.com/variant.jpg",
    "cart_quantity": 2
  },
  "message": "Item added to cart"
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/cart/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "variantId": 5,
    "quantity": 2
  }'
```

---

### 2. Lấy danh sách sản phẩm trong giỏ

- **[GET]** `/api/cart/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "status": true,
  "data": [
    {
      "cart_id": 10,
      "user_id": 1,
      "product_id": 1,
      "variant_id": 5,
      "quantity": 2,
      "added_at": "2025-03-22T09:30:00.000Z",
      "product_name": "Áo thun",
      "product_image": "https://example.com/img.jpg",
      "color_id": 1,
      "size_id": 2,
      "price": 100000,
      "stock": 20,
      "variant_image": "https://example.com/variant.jpg"
    }
  ],
  "message": "Cart retrieved"
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/cart/1 \
  -H "Authorization: Bearer <token>"
```

---

### 3. Cập nhật số lượng sản phẩm trong giỏ

- **[PUT]** `/api/cart/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "cartId": 10,
  "quantity": 5
}
```

#### Response

```json
{
  "status": true,
  "data": {
    "cart_id": 10,
    "quantity": 5,
    "added_at": "2025-03-22T09:40:00.000Z",
    "product_name": "Áo thun",
    "product_image": "https://example.com/img.jpg",
    "color_id": 1,
    "size_id": 2,
    "price": 100000,
    "stock": 20,
    "variant_image": "https://example.com/variant.jpg"
  },
  "message": "Cart item updated"
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/cart/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": 10,
    "quantity": 5
  }'
```

---

### 4. Xoá 1 sản phẩm khỏi giỏ

- **[DELETE]** `/api/cart/:user_id/item?cart_id=10`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "status": true,
  "message": "Cart item deleted"
}
```

#### cURL

```bash
curl -X DELETE "http://localhost:3000/api/cart/1/item?cart_id=10" \
  -H "Authorization: Bearer <token>"
```

---

### 5. Xoá toàn bộ giỏ hàng

- **[DELETE]** `/api/cart/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "status": true,
  "message": "Cart cleared"
}
```

#### cURL

```bash
curl -X DELETE http://localhost:3000/api/cart/1 \
  -H "Authorization: Bearer <token>"
```

---

## V. Đơn hàng (Orders)

### 1. Tạo đơn hàng (checkout)

- **[POST]** `/api/orders/:user_id/checkout`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "recipient_name": "Nguyen Van A",
  "recipient_phone": "0123456789",
  "shipping_address": "Hà Nội",
  "total_price": 500000,
  "shipping_fee": 20000,
  "discount": 50000,
  "amount_paid": 470000,
  "payment_method": "COD",
  "shipping_method": "GHN",
  "items": [
    {
      "product_id": 1,
      "variant_id": 5,
      "quantity": 2,
      "unit_price": 250000,
      "discount": 0,
      "tax": 0,
      "subtotal": 500000
    }
  ]
}
```

#### Response

```json
{
  "message": "Order created successfully",
  "order": {
    "order_id": 12,
    "user_id": 1,
    "status": "pending",
    "items": [ ... ]
  }
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/orders/1/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_name": "Nguyen Van A",
    "recipient_phone": "0123456789",
    "shipping_address": "Hà Nội",
    "total_price": 500000,
    "shipping_fee": 20000,
    "discount": 50000,
    "amount_paid": 470000,
    "payment_method": "COD",
    "shipping_method": "GHN",
    "items": [
      {
        "product_id": 1,
        "variant_id": 5,
        "quantity": 2,
        "unit_price": 250000,
        "discount": 0,
        "tax": 0,
        "subtotal": 500000
      }
    ]
  }'
```

---

### 2. Lấy danh sách đơn hàng theo người dùng

- **[GET]** `/api/orders/:user_id`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
[
  {
    "order_id": 12,
    "user_id": 1,
    "status": "pending",
    "created_at": "2025-03-22T10:00:00.000Z",
    ...
  }
]
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer <token>"
```

---

### 3. Lấy chi tiết đơn hàng

- **[GET]** `/api/orders/:user_id/:orderId`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "order_id": 12,
  "user_id": 1,
  "status": "pending",
  "items": [
    {
      "product_id": 1,
      "variant_id": 5,
      "quantity": 2,
      ...
    }
  ]
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/orders/1/12 \
  -H "Authorization: Bearer <token>"
```

---

### 4. Cập nhật thông tin giao hàng

- **[PATCH]** `/api/orders/:user_id/:orderId`
- **Header**: `Authorization: Bearer <token>`

#### Body Request

```json
{
  "recipient_name": "Nguyen Van B",
  "recipient_phone": "0909090909",
  "shipping_address": "TP.HCM"
}
```

#### Response

```json
{
  "message": "Order updated"
}
```

#### cURL

```bash
curl -X PATCH http://localhost:3000/api/orders/1/12 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_name": "Nguyen Van B",
    "recipient_phone": "0909090909",
    "shipping_address": "TP.HCM"
  }'
```

---

### 5. Hủy đơn hàng

- **[PATCH]** `/api/orders/:user_id/:orderId/cancel`
- **Header**: `Authorization: Bearer <token>`

#### Response

```json
{
  "message": "Order cancelled and stock restored"
}
```

#### cURL

```bash
curl -X PATCH http://localhost:3000/api/orders/1/12/cancel \
  -H "Authorization: Bearer <token>"
```

---

### 6. (Admin) Lấy tất cả đơn hàng

- **[GET]** `/api/orders/getall`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
[
  {
    "order_id": 12,
    "user_id": 1,
    "status": "pending",
    ...
  },
  {
    "order_id": 13,
    "user_id": 2,
    "status": "completed",
    ...
  }
]
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/orders/getall \
  -H "Authorization: Bearer <admin_token>"
```

---

### 7. (Admin) Lấy đơn hàng theo trạng thái

- **[GET]** `/api/orders/status/:status`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
[
  {
    "order_id": 12,
    "status": "pending",
    ...
  }
]
```

#### Ví dụ cURL

```bash
curl -X GET http://localhost:3000/api/orders/status/pending \
  -H "Authorization: Bearer <admin_token>"
```

---

### 8. (Admin) Cập nhật trạng thái đơn hàng

- **[PATCH]** `/api/orders/:user_id/:orderId/status`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "status": "completed"
}
```

#### Response

```json
{
  "message": "Order status updated"
}
```

#### cURL

```bash
curl -X PATCH http://localhost:3000/api/orders/1/12/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

## VI. Thương hiệu (Brands)

### 1. Lấy tất cả thương hiệu

- **[GET]** `/api/brands`

#### Response

```json
[
  {
    "brand_id": 1,
    "name": "Nike",
    "slug": "nike",
    "description": "Thương hiệu thể thao nổi tiếng",
    "logo": "https://example.com/nike.png"
  },
  ...
]
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/brands
```

---

### 2. Lấy chi tiết thương hiệu theo ID

- **[GET]** `/api/brands/:brandId`

#### Response

```json
{
  "brand_id": 1,
  "name": "Nike",
  "slug": "nike",
  "description": "Thương hiệu thể thao nổi tiếng",
  "logo": "https://example.com/nike.png"
}
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/brands/1
```

---

### 3. Thêm mới thương hiệu (Admin)

- **[POST]** `/api/brands`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "name": "Adidas",
  "slug": "adidas",
  "description": "Thương hiệu thể thao toàn cầu",
  "logo": "https://example.com/adidas.png"
}
```

#### Response

```json
{
  "message": "Brand created successfully",
  "brand_id": 2
}
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/brands \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adidas",
    "slug": "adidas",
    "description": "Thương hiệu thể thao toàn cầu",
    "logo": "https://example.com/adidas.png"
  }'
```

---

### 4. Cập nhật thương hiệu (Admin)

- **[PUT]** `/api/brands/:brandId`
- **Header**: `Authorization: Bearer <admin_token>`

#### Body Request

```json
{
  "name": "Adidas Originals",
  "slug": "adidas-originals",
  "description": "Phong cách streetwear",
  "logo": "https://example.com/adidas-originals.png"
}
```

#### Response

```json
{
  "message": "Brand updated successfully"
}
```

#### cURL

```bash
curl -X PUT http://localhost:3000/api/brands/1 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adidas Originals",
    "slug": "adidas-originals",
    "description": "Phong cách streetwear",
    "logo": "https://example.com/adidas-originals.png"
  }'
```

---

### 5. Xoá thương hiệu (Admin)

- **[DELETE]** `/api/brands/:brandId`
- **Header**: `Authorization: Bearer <admin_token>`

#### Response

```json
{
  "message": "Brand deleted successfully"
}
```

#### cURL

```bash
curl -X DELETE http://localhost:3000/api/brands/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

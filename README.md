# API Documentation

## Product Endpoints

### Get All Products

- **URL:** `/api/products/get`
- **Method:** `GET`
- **Query Parameters:**
  - `offset` (optional): The offset for pagination (default: 0)
  - `limit` (optional): The limit for pagination (default: 10)
- **Response:** List of products
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/products/get?offset=0&limit=10"
  ```

### Get Products by Category

- **URL:** `/api/products/getbycatid/:categoryId`
- **Method:** `GET`
- **URL Parameters:**
  - `categoryId`: The ID of the category
- **Query Parameters:**
  - `offset` (optional): The offset for pagination (default: 0)
  - `limit` (optional): The limit for pagination (default: 10)
- **Response:** List of products in the specified category
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/products/getbycatid/1?offset=0&limit=10"
  ```

### Get Product by ID

- **URL:** `/api/products/getbyid/:id`
- **Method:** `GET`
- **URL Parameters:**
  - `id`: The ID of the product
- **Response:** The product with the specified ID
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/products/getbyid/1"
  ```

### Create Product

- **URL:** `/api/products/creat`
- **Method:** `POST`
- **Body Parameters:**
  - `name`: The name of the product
  - `description`: The description of the product
  - `category_id`: The ID of the category
  - `price`: The price of the product
  - `discount`: The discount on the product
  - `stock`: The stock of the product
  - `image_url`: The image URL of the product
  - `images`: Additional images of the product
- **Response:** The ID of the created product
- **Curl Example:**
  ```sh
  curl -X POST "https://api.nghienshopping.online/fashion/products/creat" -H "Content-Type: application/json" -d '{
    "name": "Product Name",
    "description": "Product Description",
    "category_id": 1,
    "price": 100,
    "discount": 10,
    "stock": 50,
    "image_url": "http://example.com/image.jpg",
    "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
  }'
  ```

### Update Product

- **URL:** `/api/products/updateid/:id`
- **Method:** `PUT`
- **URL Parameters:**
  - `id`: The ID of the product
- **Body Parameters:**
  - `name`: The name of the product
  - `description`: The description of the product
  - `category_id`: The ID of the category
  - `price`: The price of the product
  - `discount`: The discount on the product
  - `stock`: The stock of the product
  - `image_url`: The image URL of the product
  - `images`: Additional images of the product
- **Response:** Success message
- **Curl Example:**
  ```sh
  curl -X PUT "https://api.nghienshopping.online/fashion/products/updateid/1" -H "Content-Type: application/json" -d '{
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "category_id": 1,
    "price": 120,
    "discount": 15,
    "stock": 40,
    "image_url": "http://example.com/updated_image.jpg",
    "images": ["http://example.com/updated_image1.jpg", "http://example.com/updated_image2.jpg"]
  }'
  ```

### Delete Product

- **URL:** `/api/products/delete/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id`: The ID of the product
- **Response:** Success message
- **Curl Example:**
  ```sh
  curl -X DELETE "https://api.nghienshopping.online/fashion/products/delete/1"
  ```

## Category Endpoints

### Get All Categories

- **URL:** `/api/cat/get`
- **Method:** `GET`
- **Response:** List of categories
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/cat/get"
  ```

### Get Category by ID

- **URL:** `/api/cat/catid/:id`
- **Method:** `GET`
- **URL Parameters:**
  - `id`: The ID of the category
- **Response:** The category with the specified ID
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/cat/catid/1"
  ```

### Get Subcategories

- **URL:** `/api/cat/parent/:parentId`
- **Method:** `GET`
- **URL Parameters:**
  - `parentId`: The ID of the parent category
- **Response:** List of subcategories
- **Curl Example:**
  ```sh
  curl -X GET "https://api.nghienshopping.online/fashion/cat/parent/1"
  ```

### Create Category

- **URL:** `/api/cat/create`
- **Method:** `POST`
- **Body Parameters:**
  - `name`: The name of the category
  - `description`: The description of the category
  - `parent_id`: The ID of the parent category
  - `image`: The image of the category
- **Response:** The ID of the created category
- **Curl Example:**
  ```sh
  curl -X POST "https://api.nghienshopping.online/fashion/cat/create" -H "Content-Type: application/json" -d '{
    "name": "Category Name",
    "description": "Category Description",
    "parent_id": 1,
    "image": "http://example.com/image.jpg"
  }'
  ```

### Update Category

- **URL:** `/api/cat/updateid/:id`
- **Method:** `PUT`
- **URL Parameters:**
  - `id`: The ID of the category
- **Body Parameters:**
  - `name`: The name of the category
  - `description`: The description of the category
  - `parent_id`: The ID of the parent category
  - `image`: The image of the category
- **Response:** Success message
- **Curl Example:**
  ```sh
  curl -X PUT "https://api.nghienshopping.online/fashion/cat/updateid/1" -H "Content-Type: application/json" -d '{
    "name": "Updated Category Name",
    "description": "Updated Category Description",
    "parent_id": 1,
    "image": "http://example.com/updated_image.jpg"
  }'
  ```

### Delete Category

- **URL:** `/api/cat/delete/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id`: The ID of the category
- **Response:** Success message
- **Curl Example:**
  ```sh
  curl -X DELETE "https://api.nghienshopping.online/fashion/cat/delete/1"
  ```

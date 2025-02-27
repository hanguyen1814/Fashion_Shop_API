# Product API Endpoints

## Get All Products

- **URL:** `/api/products/getall`
- **Method:** `GET`
- **Description:** Retrieve all products.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/products/getall"
```

## Get Product By ID

- **URL:** `/api/products/getid/:id`
- **Method:** `GET`
- **Description:** Retrieve a product by its ID.
- **URL Params:**
  - `id` (required): The ID of the product.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/products/getid/1"
```

## Create Product

- **URL:** `/api/products/create`
- **Method:** `POST`
- **Description:** Create a new product.
- **Body Params:**
  - `name` (required): The name of the product.
  - `description` (required): The description of the product.
  - `category_id` (required): The category ID of the product.
  - `brand_id` (required): The brand ID of the product.
  - `price` (required): The price of the product.
  - `status` (required): The status of the product.
  - `images` (optional): The images of the product.

### Curl Command

```sh
curl -X POST "https://fshop.nghienshopping.online/api/products/create" -H "Content-Type: application/json" -d '{
  "name": "Product Name",
  "description": "Product Description",
  "category_id": 1,
  "brand_id": 1,
  "price": 100,
  "status": "available",
  "images": "image1.jpg,image2.jpg"
}'
```

## Update Product

- **URL:** `/api/products/update/:id`
- **Method:** `PUT`
- **Description:** Update an existing product.
- **URL Params:**
  - `id` (required): The ID of the product.
- **Body Params:**
  - `name` (required): The name of the product.
  - `description` (required): The description of the product.
  - `category_id` (required): The category ID of the product.
  - `brand_id` (required): The brand ID of the product.
  - `price` (required): The price of the product.
  - `status` (required): The status of the product.
  - `images` (optional): The images of the product.

### Curl Command

```sh
curl -X PUT "https://fshop.nghienshopping.online/api/products/update/1" -H "Content-Type: application/json" -d '{
  "name": "Updated Product Name",
  "description": "Updated Product Description",
  "category_id": 1,
  "brand_id": 1,
  "price": 150,
  "status": "available",
  "images": "image1.jpg,image2.jpg"
}'
```

## Delete Product

- **URL:** `/api/products/delete/:id`
- **Method:** `DELETE`
- **Description:** Delete a product by its ID.
- **URL Params:**
  - `id` (required): The ID of the product.

### Curl Command

```sh
curl -X DELETE "https://fshop.nghienshopping.online/api/products/delete/1"
```

## Search Products

- **URL:** `/api/products/search`
- **Method:** `GET`
- **Description:** Search for products based on various parameters.
- **Query Params:**
  - `id` (optional): The ID of the product.
  - `catid` (optional): The category ID of the product.
  - `brandid` (optional): The brand ID of the product.
  - `limit` (optional): The number of products to return.
  - `page` (optional): The page number for pagination.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/products/search?catid=1&limit=10&page=1"
```

# Category API Endpoints

## Get All Categories

- **URL:** `/api/cat/getall`
- **Method:** `GET`
- **Description:** Retrieve all categories.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/cat/getall"
```

## Get Category By ID

- **URL:** `/api/cat/getid/:id`
- **Method:** `GET`
- **Description:** Retrieve a category by its ID.
- **URL Params:**
  - `id` (required): The ID of the category.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/cat/getid/1"
```

## Create Category

- **URL:** `/api/cat/create`
- **Method:** `POST`
- **Description:** Create a new category.
- **Body Params:**
  - `name` (required): The name of the category.
  - `slug` (required): The slug of the category.
  - `description` (optional): The description of the category.
  - `parent_id` (optional): The parent category ID.
  - `brand_id` (optional): The brand ID associated with the category.
  - `status` (required): The status of the category.
  - `image` (optional): The image of the category.

### Curl Command

```sh
curl -X POST "https://fshop.nghienshopping.online/api/cat/create" -H "Content-Type: application/json" -d '{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category Description",
  "parent_id": 1,
  "brand_id": 1,
  "status": "active",
  "image": "image.jpg"
}'
```

## Update Category

- **URL:** `/api/cat/update/:id`
- **Method:** `PUT`
- **Description:** Update an existing category.
- **URL Params:**
  - `id` (required): The ID of the category.
- **Body Params:**
  - `name` (required): The name of the category.
  - `slug` (required): The slug of the category.
  - `description` (optional): The description of the category.
  - `parent_id` (optional): The parent category ID.
  - `brand_id` (optional): The brand ID associated with the category.
  - `status` (required): The status of the category.
  - `image` (optional): The image of the category.

### Curl Command

```sh
curl -X PUT "https://fshop.nghienshopping.online/api/cat/update/1" -H "Content-Type: application/json" -d '{
  "name": "Updated Category Name",
  "slug": "updated-category-slug",
  "description": "Updated Category Description",
  "parent_id": 1,
  "brand_id": 1,
  "status": "active",
  "image": "updated-image.jpg"
}'
```

## Delete Category

- **URL:** `/api/cat/delete/:id`
- **Method:** `DELETE`
- **Description:** Delete a category by its ID.
- **URL Params:**
  - `id` (required): The ID of the category.

### Curl Command

```sh
curl -X DELETE "https://fshop.nghienshopping.online/api/cat/delete/1"
```

# User API Endpoints

## Get All Users

- **URL:** `/api/users/getall`
- **Method:** `GET`
- **Description:** Retrieve all users.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/users/getall"
```

## Get User By ID

- **URL:** `/api/users/getid/:id`
- **Method:** `GET`
- **Description:** Retrieve a user by their ID.
- **URL Params:**
  - `id` (required): The ID of the user.

### Curl Command

```sh
curl -X GET "https://fshop.nghienshopping.online/api/users/getid/1"
```

## Register User

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Body Params:**
  - `full_name` (required): The full name of the user.
  - `email` (required): The email of the user.
  - `password` (required): The password of the user.
  - `phone` (required): The phone number of the user.
  - `address` (required): The address of the user.

### Curl Command

```sh
curl -X POST "https://fshop.nghienshopping.online/api/users/register" -H "Content-Type: application/json" -d '{
  "full_name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Street, City, Country"
}'
```

## Login User

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Description:** Login a user.
- **Body Params:**
  - `email` (required): The email of the user.
  - `password` (required): The password of the user.

### Curl Command

```sh
curl -X POST "https://fshop.nghienshopping.online/api/users/login" -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

## Update User

- **URL:** `/api/users/update/:id`
- **Method:** `PUT`
- **Description:** Update an existing user.
- **URL Params:**
  - `id` (required): The ID of the user.
- **Body Params:**
  - `full_name` (required): The full name of the user.
  - `phone` (required): The phone number of the user.
  - `address` (required): The address of the user.

### Curl Command

```sh
curl -X PUT "https://fshop.nghienshopping.online/api/users/update/1" -H "Content-Type: application/json" -d '{
  "full_name": "Updated User Name",
  "phone": "0987654321",
  "address": "456 Avenue, City, Country"
}'
```

## Delete User

- **URL:** `/api/users/delete/:id`
- **Method:** `DELETE`
- **Description:** Delete a user by their ID.
- **URL Params:**
  - `id` (required): The ID of the user.

### Curl Command

```sh
curl -X DELETE "https://fshop.nghienshopping.online/api/users/delete/1"
```

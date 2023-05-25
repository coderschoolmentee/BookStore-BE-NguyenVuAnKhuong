# BookStore

"Welcome to our online bookstore! Our website offers a wide selection of books for all reading enthusiasts. With our user-friendly interface and convenient features, we aim to provide an enjoyable and seamless experience for both registered users and administrators.

For users, we offer a simple registration and authentication process. You can easily create a new account using your email and password, enabling you to access various features. Once registered, you can manage your profile information, including your name, email, and more. Our platform also allows you to view your order history, providing details of your past purchases.

Admin functionality is available for administrators to efficiently manage the system. Administrators have access to a range of features, including viewing and managing all users, modifying roles and permissions, and overseeing book-related activities. They can effortlessly add, edit, and delete books, ensuring an up-to-date and diverse collection.

When it comes to books, our website offers comprehensive book management features. Users can browse through a list of available books, search for specific titles, authors, or genres, and even sort the book list based on different criteria such as title, author, or price. Detailed information about each book, including its description, author, genre, price, and publication date, is readily accessible. Additionally, users can explore customer reviews and ratings, helping them make informed decisions.

The book review system allows users to leave their feedback and ratings for books they have read. They can easily submit their reviews and update or delete them if needed. Admins have the ability to moderate and manage book reviews, ensuring the quality and integrity of the reviews.

To facilitate the shopping experience, our website provides cart management functionality. Users can view their current shopping cart, add books to it, remove items, and update the quantity of books. When ready to make a purchase, users can place an order for the items in their shopping cart, review the order details, and finalize the purchase. Order history is available for users to track their past orders.

For administrators, the admin panel offers a comprehensive overview of all orders, allowing efficient order management. Admins can update the status of orders, ensuring smooth order processing.

In summary, our website bookstore provides a user-friendly and feature-rich platform for book lovers. Whether you're looking for a specific book, exploring new titles, or sharing your reading experiences, our website caters to your needs. Enjoy the convenience of online book shopping and immerse yourself in a world of knowledge and imagination!"

# Feature

# Users

## Registration and Authentication

- [ ] As a user, I can register for a new account with my email, and password.

```javascript
/**
 * @route POST /users
 * @description Register new user
 * @body { email, password}
 * @access Public
 */
```

- [ ] As a user, I can log in to my account using my email and password.

```javascript
/**
 * @route POST /auth/login
 * @description Login with email and password
 * @body { email, password}
 * @access Public
 */
```

## Profile Management

- [ ] As a user, I can view and edit my profile information (name, email, etc.).

```javaScript
/**
 * @route GET /users/:id
 * @description Get user profile
 * @access Private
 */


/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {
 *   fristName: string,
 *   lastName: string,
 *   email: string,
 *   password: string,
 *   sex: boolean,
 *   birthday: date,
 *   address: string,
 *   city: string,
 *   state: string,
 *   zipcode: string
 * }
 * @access Private
 */

```

## Order History

- [ ] As a user, I can view my past orders and their details.

```javascript
/**
 * @route GET /users/:id/orders
 * @description Get user's past orders
 * @access Private
 */
```

## Admin Functionality

- [ ] As an administrator, I can see all users

```javaScript
/**
 * @route GET /admin/users
 * @description Get all users
 * @access Private (admin)
 */

/**
 * @route GET /admin/users/:id
 * @description Get user by ID
 * @access Private (admin)
 */
```

- [ ] As an admin, I can manage users' roles and permissions.

```javaScript
/**
 * @route PUT /admin/users/:id/
 * @description Update user's role
 * @body { role: string }
 * @access Private (admin)
 *

 /**
 * @route DELETE /admin/users/:id
 * @description Delete user
 * @access Private (admin)
 */
```

- [ ] As an admin, I can see , add, edit, and delete books from the system.

```javaScript
/**
 * @route GET /books
 * @description Get all books
 * @access Private (admin)
 */

/**
 * @route POST /books
 * @description Add a new book
 * @body { name: string, author: string, genre: string, price: number, publicationDate: date }
 * @access Private (admin)
 */

/**
 * @route PUT /books/:id
 * @description Update book details
 * @body { name: string, author: string, genre: string, price: number, publicationDate: date }
 * @access Private (admin)
 */

/**
 * @route DELETE /books/:id
 * @description Delete a book
 * @access Private (admin)
 */

```

# Books

## Book Management

- [ ] As an admin, I can see , add , edit and delete books to the system.

```javaScript
/**
 * @route GET /books
 * @description Get all books
 * @access Public
 */

/**
 * @route GET /books/:id
 * @description Get book by ID
 * @access Public
 */

/**
 * @route POST /books
 * @description Add a new book
 * @body { name: string, author: string, genre: string, price: number, publicationDate: date }
 * @access Private (admin)
 */

/**
 * @route PUT /books/:id
 * @description Update book details
 * @body { name: string, author: string, genre: string, price: number, publicationDate: date }
 * @access Private (admin)
 */

/**
 * @route DELETE /books/:id
 * @description Delete a book
 * @access Private (admin)
 */

```

## Book Listing and Search

- [ ] As a user, I can view a list of available books.

```javaScript
/**
 * @route GET /books
 * @description Get a list of available books
 * @access Public
 */

```

- [ ] As a user, I can search for books by title, author, or genre.

```javaScript
/**
 * @route GET /books/search
 * @description Search for books by title, author, or genre
 * @query {keyword}
 * @access Public
 */

```

- [ ] As a user, I can sort the book list by different criteria (e.g., title, author, price).

```javaScript
/**
 * @route GET /books
 * @description Get a list of books
 * @query {sort}
 * @access Public
 */

```

## Book Details

- [ ] As a user, I can view detailed information about a specific book, including its description, author, genre, price, and publication date.

```javaScript
/**
 * @route GET /books/:id
 * @description Get detailed information about a book
 * @param {id} - The ID of the book
 * @access Public
 */

```

- [ ] As a user, I can see customer reviews and ratings for a book.

```javaScript
/**
 * @route GET /books/:id/reviews
 * @description Get customer reviews and ratings for a book
 * @param {id} - The ID of the book
 * @access Public
 */

```

## Book Reviews

- [ ] As a user, I can leave a review and rating for a book.

```javaScript
/**
 * @route POST /books/:id/reviews
 * @description Add a comment and rating for a book
 * @param {id} - The ID of the book
 * @body {comment, rating}
 * @access Private
 */

```

- [ ] As a user, I can view and edit my own book reviews.

```javaScript
/**
 * @route GET /reviews/:id
 * @description Get a user's book review
 * @param {id} - The ID of the review
 * @access Private
 */

/**
 * @route PUT /reviews/:id
 * @description Update a user's book review
 * @param {id} - The ID of the review
 * @body {comment, rating}
 * @access Private
 */

```

- [ ] As an admin, I can moderate and manage book reviews.

```javaScript
/**
 * @route GET /reviews
 * @description Get all book reviews
 * @access Admin
 */

/**
 * @route DELETE /reviews/:id
 * @description Delete a book review
 * @param {id} - The ID of the review
 * @access Admin
 */

```

# Carts

## Cart Management

- [ ] As a user, I can view my current shopping cart.

```javaScript
/**
 * @route GET /cart/:userId
 * @description Get user's current shopping cart
 * @access Private
 */

```

- [ ] As a user, I can add books to my shopping cart.

```javaScript
/**
 * @route POST /cart/:userId/
 * @description post a book to my shopping cart
 * @body {bookId : int , quantity : number , price : number}
 * @access Private
 */

```

- [ ] As a user, I can remove book from my shopping cart.

```javaScript
/**
 * @route DELETE /cart/:userId/:bookId
 * @description Remove a book from my shopping cart
 * @access Private
 */
```

- [ ] As a user, I can update the quantity of books in my shopping cart.

```javaScript
/**
 * @route PUT /cart/:userId/:bookId
 * @description Remove a book from my shopping cart
 * @body {quantity : number}
 * @access Private
 */
```

# Orders

## Order Placement

- [ ] As a user, I can place an order for the items in my shopping cart.

```javaScript
/**
 * @route POST /order
 * @description Place an order for the items in the user's shopping cart
 * @body {cartId : int}
 * @access Private
 */

```

- [ ] As a user, I can review the order details before finalizing the purchase.

```javaScript
/**
 * @route GET /order/:orderId/review
 * @description Review the order details before finalizing the purchase
 * @access Private
 */

```

## Order History

- [ ] As a user, I can view my past orders and their details.

```javaScript
/**
 * @route GET /order/:userId
 * @description View past orders and their details for a user
 * @access Private
 */
```

## Order Management (Admin)

- [ ] As an admin, I can view and manage all orders in the admin panel.

```javaScript
/**
 * @route GET /admin/orders
 * @description View and manage all orders in the admin panel
 * @access Admin
 */

```

- [ ] As an admin, I can update status of a orders in the admin panel.

```javaScript
/**
 * @route PUT /admin/orders/:orderId/status
 * @description Update the status of an order in the admin panel
 * @body { status: string }
 * @access Admin
 */

```

# Reviews

## Review Submission

- [ ] As a user, I can submit a review for a book.

```javaScript
/**
 * @route POST /reviews
 * @description Submit a review for a book
 * @body { bookId: int, customerId: int, rating: number, comment: string }
 * @access Private
 */

```

- [ ] As an user, I can view, update and delete all of my reviews .

```javaScript
/**
 * @route GET /reviews/user/:userId
 * @description View all reviews submitted by a user
 * @access Private
 */

/**
 * @route GET /reviews/:reviewId
 * @description View a specific review
 * @access Private
 */

/**
 * @route PUT /reviews/:reviewId
 * @description Update a specific review
 * @body { rating: number, comment: string }
 * @access Private
 */

/**
 * @route DELETE /reviews/:reviewId
 * @description Delete a specific review
 * @access Private
 */

```

## Review Management

- [ ] As an admin, I can view and manage all reviews in the admin panel.

```javaScript
/**
 * @route GET /admin/reviews
 * @description View all reviews in the admin panel
 * @access Admin
 */

/**
 * @route GET /admin/reviews/:reviewId
 * @description View a specific review in the admin panel
 * @access Admin
 */

/**
 * @route PUT /admin/reviews/:reviewId
 * @description Update a specific review in the admin panel
 * @body { rating: number, comment: string }
 * @access Admin
 */

/**
 * @route DELETE /admin/reviews/:reviewId
 * @description Delete a specific review in the admin panel
 * @access Admin
 */

```

# E-commerce Project  

This is a full-stack e-commerce application that includes a customer-facing website, an admin panel for management, and a backend server to handle data and authentication.  

## Project Structure  
```
├── frontend/     # Customer-facing website
├── admin/        # Admin dashboard
└── backend/      # API server
```

---

## Getting Started  

### Prerequisites  
- Node.js (version 14 or higher)  
- MongoDB (version 4.4 or higher)  
- npm or yarn  

---

## Setting Up the Environment  

### Backend (.env file in `/backend`):  
```
PORT=4000  
MONGODB_URI=mongodb://localhost:27017/ecommerce  
JWT_SECRET=your_jwt_secret_here  
EMAIL_SERVICE=gmail  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASSWORD=your_email_app_password  
```

### Admin Panel (.env file in `/admin`):  
```
VITE_API_URL=http://localhost:4000  
```

### Frontend (.env file in `/frontend`):  
```
VITE_API_URL=http://localhost:4000  
```

---

## Installation  

1. **Clone the Repository:**  
```bash
git clone <repository-url>  
cd <project-folder>  
```

2. **Install Dependencies:**  
```bash
# Backend  
cd backend  
npm install  

# Admin Panel  
cd ../admin  
npm install  

# Frontend  
cd ../frontend  
npm install  
```

3. **Start the Servers:**  
```bash
# Backend server  
cd backend  
npm start  

# Admin panel  
cd ../admin  
npm run dev  

# Frontend  
cd ../frontend  
npm run dev  
```

---

## Default Admin Credentials  
- Email: Admin  
- Password: Admin12345678@

---

## Features  
- User authentication with JWT  
- Product and order management  
- Shopping cart functionality  
- Admin dashboard for managing products and orders  
- Email notifications  
- Stock management  

---

## API Endpoints  

### Products  
- Get all products: `GET /api/products`  
- Add a new product (admin only): `POST /api/products`  
- Update a product (admin only): `PATCH /api/products/:id`  

### Orders  
- Get all orders (admin only): `GET /api/orders`  
- Get user's orders: `GET /api/orders/my-orders`  
- Create a new order: `POST /api/orders`  
- Update order status (admin only): `PATCH /api/orders/:orderId/status`  

### Authentication  
- Register a new user: `POST /api/auth/register`  
- User login: `POST /api/auth/login`  
- Admin login: `POST /api/admin/login`  

---

## Troubleshooting  

- **MongoDB connection issues:**  
  Make sure MongoDB is running locally and check the `MONGODB_URI` in the .env file.  

- **Email notifications not working:**  
  Verify email service settings in the .env file. If using Gmail, make sure to use an App Password.  

- **Admin login fails:**  
  Clear your browser's local storage, double-check the credentials, and ensure the correct JWT secret.  

---

## Contributing  
- Fork the repository.  
- Create a new feature branch (`git checkout -b feature/your-feature`).  
- Commit your changes (`git commit -m 'Added a new feature'`).  
- Push to your branch (`git push origin feature/your-feature`).  
- Open a Pull Request.  

---

## License  
This project is licensed under the MIT License.  

---

If you need any help or have questions, feel free to reach out.

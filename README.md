# E-commerce Project

A full-stack e-commerce application with admin panel, user authentication, and order management.

## Project Structure
```
├── frontend/     # Customer-facing website
├── admin/        # Admin dashboard
└── backend/      # API server
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Environment Setup

1. Backend Setup (.env file in /backend):
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

2. Admin Setup (.env file in /admin):
```
VITE_API_URL=http://localhost:4000
```

3. Frontend Setup (.env file in /frontend):
```
VITE_API_URL=http://localhost:4000
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies for all parts:
```bash
# Install backend dependencies
cd backend
npm install

# Install admin panel dependencies
cd ../admin
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the servers:

```bash
# Start backend server (from backend directory)
npm start

# Start admin panel (from admin directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## Default Admin Credentials

```
Email: nguyenvanqui291@gmail.com
Password: 123456
```

## Features

- User Authentication (JWT)
- Product Management
- Order Management
- Shopping Cart
- Admin Dashboard
- Email Notifications
- Stock Management

## API Endpoints

### Products
- GET /api/products - Get all products
- POST /api/products - Add new product (admin only)
- PATCH /api/products/:id - Update product (admin only)

### Orders
- GET /api/orders - Get all orders (admin only)
- GET /api/orders/my-orders - Get user's orders
- POST /api/orders - Create new order
- PATCH /api/orders/:orderId/status - Update order status (admin only)

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/admin/login - Admin login

## Common Issues & Solutions

1. If MongoDB connection fails:
   - Ensure MongoDB is running locally
   - Check MONGODB_URI in .env file

2. If email notifications don't work:
   - Verify EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASSWORD in .env
   - For Gmail, use App Password instead of regular password

3. If admin login fails:
   - Clear browser localStorage
   - Ensure correct admin credentials
   - Check JWT_SECRET in backend .env

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License

## 🌟 Live Demo

- Frontend: [View Store](your-frontend-url)
- Admin Panel: [View Admin](your-admin-url)

## ✨ Key Features

- 🛍️ **Shopping Experience**
  - Browse uniforms by school level (Primary/Secondary/Sixth Form)
  - Smart size recommendation system
  - Real-time cart management
  - Secure checkout process

- 📱 **User Features**
  - User authentication
  - Order history
  - Size calculator
  - Email notifications

- 👨‍💼 **Admin Dashboard**
  - Product management
  - Order tracking
  - Inventory control
  - Sales analytics

## 🛠️ Tech Stack

- **Frontend**: React, Context API, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Storage**: Local storage with Multer
- **Authentication**: JWT
- **Email Service**: Nodemailer
- **Styling**: CSS3, Modern UI/UX

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-uniform-ecommerce.git
   cd school-uniform-ecommerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with:
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-secret-key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file with:
   REACT_APP_API_URL=http://localhost:4000
   ```

4. **Admin Panel Setup**
   ```bash
   cd admin
   npm install
   
   # Create .env file with:
   VITE_API_URL=http://localhost:4000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:4000

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   Opens in browser at http://localhost:3000

3. **Start Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
   Access admin panel at http://localhost:5173

## 📁 Project Structure

```
├── backend/               # Express server
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── utils/            # Utilities
│   └── upload/           # Uploaded files
├── frontend/             # Customer frontend
│   ├── src/
│   │   ├── Components/   # React components
│   │   ├── Pages/       # Page components
│   │   ├── Context/     # React context
│   │   └── services/    # API services
└── admin/               # Admin dashboard
    ├── src/
    │   ├── Pages/       # Admin pages
    │   └── Components/  # Admin components
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
```

### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:4000
```

### Admin Environment Variables (.env)
```env
VITE_API_URL=http://localhost:4000
```

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/admin/login` - Admin login

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/school-uniform-ecommerce](https://github.com/yourusername/school-uniform-ecommerce)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the robust database
- All contributors who helped with the project

## 🔒 Repository Access

This is a private repository. To get access:

1. **For Collaborators**
   - Request access from repository owner
   - Accept the invitation sent to your email
   - Clone using:
     ```bash
     git clone https://github.com/B11007011/Ecommerce--master.git
     ```

2. **For Organizations**
   - Join the organization
   - Request repository access
   - Clone after access granted

3. **For Viewers**
   - Request read-only access
   - Use provided credentials

Contact repository owner at your.email@example.com for access requests.



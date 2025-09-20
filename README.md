# 🍭 Sweet Shop Frontend

A modern, responsive React application for the Sweet Shop Management System.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Sweet Management**: Browse, search, and purchase delicious sweets
- **Admin Panel**: Full CRUD operations for managing inventory
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback on purchases and inventory changes
- **Advanced Search**: Filter sweets by name, category, and price range

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vanilla CSS** - Custom styling with modern CSS features
- **Context API** - State management for authentication

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.js           # Navigation header
│   ├── Login.js           # Login form
│   ├── Register.js        # Registration form
│   ├── Dashboard.js       # Main dashboard
│   ├── SweetCard.js       # Individual sweet display
│   ├── SweetForm.js       # Add/Edit sweet form
│   ├── SearchBar.js       # Search and filter component
│   └── ProtectedRoute.js  # Route protection
├── context/
│   └── AuthContext.js     # Authentication state management
├── services/
│   └── api.js             # API service layer
├── styles/
│   └── main.css           # Global styles
├── App.js                 # Main application component
└── index.js               # React entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 3001

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sweet-shop-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

4. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🔐 Authentication Flow

1. **Registration**: Users can create new accounts with name, email, and password
2. **Login**: Secure authentication with JWT tokens
3. **Token Management**: Automatic token refresh and logout on expiration
4. **Protected Routes**: Dashboard and admin features require authentication

## 👑 Admin Features

Admin users have additional capabilities:

- **Add New Sweets**: Create new products with name, category, price, and quantity
- **Edit Sweets**: Update existing product information
- **Delete Sweets**: Remove products from inventory
- **Restock Items**: Increase quantity of existing products
- **Admin Badge**: Visual indicator of admin status

## 🔍 Search & Filter

Users can search and filter sweets by:

- **Name**: Text search in sweet names
- **Category**: Dropdown filter for categories
- **Price Range**: Min/max price filtering
- **Stock Status**: Automatic handling of out-of-stock items

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Flexible grid layouts**: Adapts to different screen sizes
- **Touch-friendly buttons**: Appropriate sizing for mobile interaction
- **Readable typography**: Optimized text sizes across devices

## 🎨 Design System

### Colors
- Primary: `#667eea` (Purple Blue)
- Secondary: `#764ba2` (Deep Purple)
- Success: `#48bb78` (Green)
- Danger: `#ff6b6b` (Red)
- Warning: `#feca57` (Yellow)

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI')
- Headings: Bold weights with gradient text effects
- Body: Regular weight with good contrast ratios

### Components
- **Cards**: Elevated with subtle shadows and hover effects
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states
- **Modal**: Overlay with backdrop blur

## 🔧 API Integration

The frontend communicates with the backend through:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweet Management Endpoints
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Create new sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

## 🧪 Testing Strategy

Testing approach includes:

- **Component Testing**: Individual component functionality
- **Integration Testing**: Component interaction and API calls
- **User Flow Testing**: Complete user journeys
- **Responsive Testing**: Cross-device compatibility

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

1. **Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

3. **AWS S3 + CloudFront**
- Upload build files to S3 bucket
- Configure CloudFront distribution
- Set up custom domain (optional)

## 🔒 Security Features

- **JWT Token Storage**: Secure local storage with automatic cleanup
- **Request Interceptors**: Automatic token attachment to requests
- **Route Protection**: Unauthorized access prevention
- **Input Validation**: Client-side form validation
- **XSS Prevention**: Proper data sanitization

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Efficient loading and caching
- **Bundle Analysis**: Optimized bundle sizes
- **Caching Strategy**: Effective browser caching
- **Minimized Re-renders**: Optimized React rendering

## 🐛 Common Issues & Solutions

### Issue: API Connection Failed
**Solution**: Check if backend server is running on port 3001

### Issue: Login Not Working
**Solution**: Verify API_URL in .env file and check network requests

### Issue: Styles Not Loading
**Solution**: Ensure main.css is properly imported in App.js

### Issue: Build Fails
**Solution**: Clear node_modules and reinstall dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Create React App for the initial setup
- Modern CSS techniques and best practices
- Sweet shop inspiration from candy stores worldwide! 🍬
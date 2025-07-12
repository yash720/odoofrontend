# ReWear Frontend Deployment Guide

## Production Deployment

### 1. Environment Configuration

Before deploying, update the production API URL in the environment file:

```bash
# Edit .env.production
VITE_API_URL=https://your-production-backend-url.com/api
```

Replace `https://your-production-backend-url.com/api` with your actual production backend URL.

### 2. Build for Production

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This will create a `dist` folder with optimized production files.

### 3. Deploy to Your Hosting Platform

#### Option A: Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your production backend URL
3. Deploy automatically on push to main branch

#### Option B: Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `VITE_API_URL`: Your production backend URL
3. Deploy automatically on push to main branch

#### Option C: Static Hosting (AWS S3, GitHub Pages, etc.)
1. Upload the contents of the `dist` folder to your static hosting service
2. Configure environment variables if your hosting platform supports them

### 4. Environment Variables

The frontend uses the following environment variables:

- `VITE_API_URL`: The base URL of your backend API
- `VITE_DEV`: Automatically set to `true` in development, `false` in production

### 5. CORS Configuration

Ensure your backend has CORS configured to allow requests from your frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:5173'],
  credentials: true
}));
```

### 6. API Endpoints

The frontend expects the following API endpoints to be available:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item
- `GET /api/items/pending` - Get pending items (admin)
- `PUT /api/items/:id/approve` - Approve item (admin)
- `PUT /api/items/:id/reject` - Reject item (admin)
- `DELETE /api/items/:id` - Delete item (admin)

#### Swaps
- `POST /api/swaps/request` - Request swap
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap

### 7. Development vs Production

- **Development**: Uses `http://localhost:5000/api` by default
- **Production**: Uses the URL specified in `VITE_API_URL` environment variable

### 8. Troubleshooting

#### Common Issues:

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **API Connection Errors**: Verify the `VITE_API_URL` is correct and accessible
3. **Build Errors**: Check that all dependencies are installed and TypeScript compiles correctly

#### Debug Mode:

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

### 9. Security Considerations

- Never expose sensitive environment variables in the frontend
- Use HTTPS in production
- Implement proper authentication and authorization
- Validate all user inputs on both frontend and backend

### 10. Performance Optimization

The production build includes:
- Code splitting and lazy loading
- Tree shaking to remove unused code
- Minification and compression
- Optimized assets

### 11. Monitoring

Consider adding monitoring tools:
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Web Vitals)
- Analytics (Google Analytics, Mixpanel)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript types
│   ├── config/         # Configuration files
│   └── data/           # Mock data (development only)
├── .env.development    # Development environment variables
├── .env.production     # Production environment variables
└── DEPLOYMENT.md       # This file
``` 
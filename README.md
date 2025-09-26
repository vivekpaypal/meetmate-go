# TechMeet 2024 - Tech Meetup Registration App

A professional web application for tech meetup registration featuring a React frontend with Golang backend integration.

## 🚀 Features

- **Landing Page**: Event details, speaker information, and track descriptions
- **Registration Form**: Comprehensive form with validation for attendee registration
- **Responsive Design**: Mobile-first design with dark theme
- **Form Validation**: Client-side validation with Zod schema
- **Professional UI**: Modern tech-focused design with gradients and animations

## 🛠 Tech Stack

### Frontend (Current Implementation)
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form with Zod validation
- Radix UI components (shadcn/ui)
- Lucide React icons

### Backend (Implementation Guide Provided)
- Golang with Gorilla Mux
- GORM for database operations
- PostgreSQL database
- Flyway for database migrations
- Docker for containerization

## 📁 Project Structure

```
techmeet-app/
├── frontend/                 # Current Lovable React app
│   ├── src/
│   │   ├── components/ui/    # Reusable UI components
│   │   ├── pages/           # Landing and Register pages
│   │   ├── assets/          # Images and static assets
│   │   └── hooks/           # Custom React hooks
│   └── public/
├── backend/                  # Golang backend (see backend-structure.md)
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # Full stack deployment
└── README.md
```

## 🎨 Design Features

- **Tech-focused color scheme**: Purple and cyan gradients
- **Dark theme**: Professional dark background with light text
- **Animated elements**: Floating animations and hover effects
- **Responsive layout**: Works seamlessly on mobile and desktop
- **Professional typography**: Clean, modern font styling

## 📋 Registration Form Fields

- **Name**: Required, 2-100 characters
- **Email**: Required, valid email format
- **Company**: Required, 2-100 characters  
- **Department**: Required, 2-100 characters
- **Role**: Required, 2-100 characters
- **Interested Track**: Required, dropdown selection
  - AI & Machine Learning
  - Software Engineering
  - DevOps & Cloud
  - All Tracks
- **Newsletter**: Optional checkbox
- **Terms**: Required checkbox

## 🚀 Local Development

### Frontend Only (Current State)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Full Stack Development (After Backend Implementation)

1. **Clone and setup**:
```bash
git clone <repository-url>
cd techmeet-app
```

2. **Run with Docker Compose**:
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

3. **Manual setup**:

**Frontend**:
```bash
cd frontend
npm install
npm run build
```

**Backend**:
```bash
cd backend
go mod download
go run cmd/server/main.go
```

**Database**:
```bash
# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=techmeet \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15-alpine

# Run Flyway migrations
flyway -url=jdbc:postgresql://localhost:5432/techmeet \
  -user=postgres -password=password \
  -locations=filesystem:backend/migrations migrate
```

## 🌐 Environment Variables

Create `.env` file in backend directory:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=techmeet
DB_PORT=5432
PORT=8080
```

## 📡 API Endpoints

- `POST /api/register` - Submit registration
- `GET /api/registrations` - Get all registrations (admin)
- `GET /` - Serve React app (all other routes)

## 🐳 Docker Deployment

The application uses a multi-stage Docker build:

1. **Stage 1**: Build React frontend
2. **Stage 2**: Build Golang backend  
3. **Stage 3**: Create minimal Alpine image with both

```bash
# Build image
docker build -t techmeet-app .

# Run container
docker run -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e DB_NAME=techmeet \
  techmeet-app
```

## 🔒 Security Features

- Input validation on both client and server side
- SQL injection prevention with GORM
- CORS configuration for API security
- Email uniqueness constraints
- XSS protection through proper data handling

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Contact

For questions about TechMeet 2024, contact us at hello@techmeet2024.com

## 📄 License

This project is licensed under the MIT License.

---

**Note**: The current implementation includes a fully functional React frontend. The Golang backend structure and implementation guide is provided in `backend-structure.md`. The frontend currently simulates API calls - replace with actual backend calls once implemented.
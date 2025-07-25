# Resume Analyzer - AI-Powered Resume Analysis Tool

A comprehensive full-stack web application that uses AI to analyze resumes, extract key information, and provide intelligent feedback for career improvement. Built with React.js frontend, Node.js backend, PostgreSQL database, and Google Gemini AI integration.

## 🚀 Features

### **Core Functionality**
- **Multi-format Support**: Upload and analyze both PDF and DOCX resume files
- **AI-Powered Analysis**: Advanced resume parsing using Google Gemini AI
- **Intelligent Feedback**: Get personalized improvement suggestions and skill recommendations
- **Resume Rating**: Automated scoring system (1-10) based on content quality and completeness
- **Historical Tracking**: View and manage all previously analyzed resumes

### **User Interface**
- **Modern Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Two-Tab Interface**: 
  - Resume Analysis tab for uploading and analyzing new resumes
  - Historical Viewer tab for browsing past analyses
- **Interactive Components**: Drag-and-drop file upload, searchable history table, modal popups
- **Real-time Feedback**: Loading states, progress indicators, and error handling

### **Technical Features**
- **Robust File Processing**: Supports PDF (up to 10MB) and DOCX (up to 5MB) files
- **Data Extraction**: Automatically extracts contact info, work experience, education, skills, projects, and certifications
- **Database Storage**: PostgreSQL with JSONB for flexible data storage
- **API Integration**: RESTful API with proper error handling and validation
- **Security**: File type validation, size limits, and input sanitization

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **PostgreSQL** (v12.0 or higher)
- **Google Gemini API Key** (from Google AI Studio)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
# Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=resume_analyzer
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Google AI Configuration
GOOGLE_API_KEY=your_gemini_api_key

# Server Configuration
PORT=5000

```

### 3. Database Setup

#### 🛠️ Database Creation

```sql
-- Create the application database
CREATE DATABASE resume_analyzer;

-- Create a dedicated user
CREATE USER resume_user WITH PASSWORD 'your_secure_password';

-- Grant privileges to the new user
GRANT ALL PRIVILEGES ON DATABASE resume_analyzer TO resume_user;
```

#### 🔌 Connect to the Database

```sql
-- Connect to the newly created database
\c resume_analyzer;
```

#### 🗃️ Table Schema: `resumes`

```sql
CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  summary TEXT,
  work_experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  technical_skills JSONB DEFAULT '[]'::jsonb,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  resume_rating INTEGER CHECK (resume_rating BETWEEN 1 AND 10),
  improvement_areas TEXT,
  upskill_suggestions JSONB DEFAULT '[]'::jsonb,
  CONSTRAINT valid_email CHECK (
    email IS NULL OR
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  )
);

```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure frontend `.env` file:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=1.0.0
```

### 5. Install Additional Dependencies

**Backend Dependencies:**
```bash
npm install express pg multer pdf-parse mammoth @google/generative-ai dotenv cors
```

**Frontend Dependencies:**
```bash
npm install axios lucide-react tailwindcss autoprefixer postcss
```

## 🚀 Running the Application

### Development Mode

**Start Backend Server:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Start Frontend Development Server:**
```bash
cd frontend
npm start
# Application will open on http://localhost:3000
```

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Deploy Backend:**
```bash
cd backend
npm install --production
node server.js
```

## 📱 Usage Guide

### **Uploading a Resume**

1. **Navigate to Resume Analysis Tab**
2. **Upload File**: Drag and drop or click to select a PDF/DOCX file
3. **File Validation**: System checks file type and size
4. **Analysis**: AI processes the resume and extracts information
5. **View Results**: See detailed analysis with ratings and suggestions

### **Viewing Resume History**

1. **Navigate to Historical Viewer Tab**
2. **Browse Resumes**: View table of all uploaded resumes
3. **Search & Filter**: Use search bar to find specific resumes
4. **View Details**: Click "View Details" to see full analysis
5. **Modal View**: Detailed analysis opens in a responsive modal

### **Understanding the Analysis**

- **Personal Information**: Extracted contact details and links
- **Resume Rating**: 1-10 score based on completeness and quality
- **Work Experience**: Organized job history with descriptions
- **Education**: Academic background and qualifications
- **Skills**: Categorized technical and soft skills
- **Projects**: Notable projects with technologies used
- **Certifications**: Professional certifications and achievements
- **AI Feedback**: Improvement areas and upskilling suggestions

## 🏗️ Project Structure

```
resume-analyzer/
├── backend/
│   ├── controllers/
│   │   └── resumeController.js     # Request handlers
│   ├── routes/
│   │   └── resumeRoutes.js         # API routes
│   ├── services/
│   │   └── analysisService.js      # AI analysis logic
│   ├── db/
│   │   ├── index.js                # Database connection
│   │   └── migrate.js              # Database migration
│   ├── middleware/
│   │   └── logger.js               # Request logging
│   ├── server.js                   # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeUploader.js   # File upload component
│   │   │   ├── ResumeDetails.js    # Analysis display
│   │   │   ├── PastResumesTable.js # History table
│   │   │   └── ResumeModal.js      # Modal popup
│   │   ├── App.js                  # Main application
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Tailwind styles
│   ├── public/
│   ├── package.json
│   └── .env
├── sample_data/                    # Test resume files
├── screenshots/                    # UI screenshots
└── README.md
```

## 🔧 API Endpoints

### **Resume Management**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/resumes/upload` | Upload and analyze resume | FormData with PDF/DOCX file | Complete analysis JSON |
| GET | `/api/resumes` | Get all resumes | Query params: `page`, `limit` | Paginated resume list |
| GET | `/api/resumes/:id` | Get specific resume | None | Full resume analysis |

### **Request/Response Examples**

**Upload Resume:**
```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -F "resume=@/path/to/resume.pdf"
```

**Get All Resumes:**
```bash
curl -X GET "http://localhost:5000/api/resumes?page=1&limit=10"
```

**Get Specific Resume:**
```bash
curl -X GET http://localhost:5000/api/resumes/1
```

## 🎨 UI Components

### **Responsive Design Features**

- **Mobile-First Approach**: Optimized for smartphones and tablets
- **Touch-Friendly Interface**: 44px minimum touch targets for iOS compliance
- **Adaptive Layouts**: Single-column mobile, multi-column desktop
- **Consistent Spacing**: Responsive padding and margins
- **Accessible Navigation**: Tab-based interface with clear visual states

### **Color Scheme**

- **Primary Blue**: `#3b82f6` - Main UI elements and CTAs
- **Secondary Blue**: `#1d4ed8` - Hover states and accents
- **Success Green**: `#22c55e` - Positive feedback and ratings
- **Warning Orange**: `#f59e0b` - Moderate ratings and alerts
- **Error Red**: `#ef4444` - Error states and low ratings
- **Gray Scale**: Various shades for text and backgrounds

## 🧪 Testing

### **Test Cases**

**File Upload Testing:**
- Valid PDF files (various sizes up to 10MB)
- Valid DOCX files (various sizes up to 5MB)
- Invalid file types (should be rejected)
- Oversized files (should be rejected)
- Corrupted files (should handle gracefully)

**AI Analysis Testing:**
- Simple text-based resumes
- Complex formatted resumes
- Resumes with tables and graphics
- Multi-page documents
- Various resume formats and styles

**Responsive Design Testing:**
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices (iPad, Android tablets)
- Mobile phones (iOS Safari, Android Chrome)
- Different screen orientations


## 🔒 Security Features

- **File Validation**: Strict MIME type and extension checking
- **Size Limits**: Configurable file size restrictions
- **Input Sanitization**: SQL injection prevention
- **Error Handling**: Secure error messages without sensitive data
- **Environment Variables**: Secure credential management
- **CORS Configuration**: Proper cross-origin resource sharing


## 🐛 Troubleshooting

### **Common Issues**

**Database Connection Failed:**
```bash
# Check PostgreSQL service
sudo service postgresql start

# Verify database exists
psql -U postgres -l
```

**File Upload Errors:**
- Verify file size limits in both frontend and backend
- Check MIME type configuration
- Ensure proper multer setup

**AI Analysis Failed:**
- Verify Google Gemini API key is valid
- Check API rate limits and quotas
- Review network connectivity

**Frontend Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Debugging Tips**

- Check browser console for frontend errors
- Review backend logs for API issues
- Verify environment variables are loaded
- Test API endpoints directly with curl or Postman

## 🚀 Deployment

### **Production Deployment**

**Backend Deployment (e.g., Heroku):**
```bash
# Add Heroku remote
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_API_KEY=your_key
heroku config:set DB_USER=your_db_user

# Deploy
git push heroku main
```

**Frontend Deployment (e.g., Netlify):**
```bash
# Build for production
npm run build

# Deploy build folder to Netlify
```

**Database Deployment:**
- Use managed PostgreSQL services (Heroku Postgres, AWS RDS, etc.)
- Run migration scripts on production database
- Configure connection pooling for production load

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**

- Follow ESLint configuration for code style
- Write unit tests for new features
- Update documentation for API changes
- Test responsive design on multiple devices
- Ensure accessibility compliance

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful resume analysis capabilities
- **React.js Community** - For excellent frontend framework
- **Tailwind CSS** - For modern, responsive styling
- **Node.js & Express** - For robust backend infrastructure
- **PostgreSQL** - For reliable data storage

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.



**Built with ❤️ by [Your Name] | Powered by Google Gemini AI**
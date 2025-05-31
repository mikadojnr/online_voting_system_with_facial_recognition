# FUO Online Voting System - Backend Architecture

## System Overview

The FUO Online Voting System backend is a comprehensive Flask-based API that implements secure online voting with CNN-based facial recognition authentication. The system is designed for Federal University Otuoke's Student Union Government elections.

## Core Technologies

### Framework & Database
- **Flask**: Web framework for API development
- **SQLAlchemy**: ORM for database operations
- **SQLite/PostgreSQL**: Database storage
- **Flask-JWT-Extended**: JWT token authentication
- **Flask-CORS**: Cross-origin resource sharing

### Machine Learning & Computer Vision
- **TensorFlow/Keras**: CNN model development and training
- **OpenCV**: Image processing and face detection
- **face-recognition**: Face encoding and comparison
- **dlib**: Facial landmark detection
- **scikit-learn**: Data preprocessing and model evaluation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway (Flask)                      │
├─────────────────────────────────────────────────────────────┤
│  Authentication │  Elections  │  Voting │ Face Recognition  │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│     CNN Model    │  Face Data  │  Vote Data │  User Data    │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer (SQLite)                  │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Models

#### 1. User Model (`models/user.py`)
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    face_registered = db.Column(db.Boolean, default=False)
    # Security fields
    login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

#### 2. Election Model (`models/election.py`)
```python
class Election(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='upcoming')
    total_voters = db.Column(db.Integer, default=0)
    voted_count = db.Column(db.Integer, default=0)
```

#### 3. Face Data Model (`models/face_data.py`)
```python
class FaceData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    face_encoding = db.Column(db.Text, nullable=False)  # JSON face encoding
    face_landmarks = db.Column(db.Text)  # Facial landmarks
    cnn_features = db.Column(db.Text)  # CNN extracted features
    confidence_score = db.Column(db.Float, default=0.0)
    is_verified = db.Column(db.Boolean, default=False)
    verification_attempts = db.Column(db.Integer, default=0)
```

#### 4. Vote Model (`models/vote.py`)
```python
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'))
    office_id = db.Column(db.Integer, db.ForeignKey('office.id'))
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    vote_hash = db.Column(db.String(64))  # For integrity verification
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

## CNN-Based Facial Recognition System

### Architecture Overview

The facial recognition system uses a Convolutional Neural Network (CNN) built with TensorFlow/Keras for voter authentication.

### CNN Model Architecture (`utils/cnn_face_recognition.py`)

```python
def create_cnn_model(self, num_classes):
    model = Sequential([
        # First Convolutional Block
        Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),
        
        # Second Convolutional Block
        Conv2D(64, (3, 3), activation='relu'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),
        
        # Third Convolutional Block
        Conv2D(128, (3, 3), activation='relu'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),
        
        # Fourth Convolutional Block
        Conv2D(256, (3, 3), activation='relu'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),
        
        # Dense Layers
        Flatten(),
        Dense(512, activation='relu'),
        Dropout(0.5),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
```

### Data Processing Pipeline

#### 1. Image Preprocessing
```python
def preprocess_image(self, image_data):
    # Decode base64 image
    # Convert to RGB
    # Face detection using Haar Cascade
    # Crop face region with padding
    # Resize to 128x128 pixels
    # Normalize pixel values [0, 1]
    # Apply histogram equalization
    return processed_image
```

#### 2. Dataset Preparation (70/30 Split)
```python
def prepare_dataset(self, face_data_list):
    # Load and preprocess images
    # Encode labels using LabelEncoder
    # Convert to categorical format
    # Split: 70% training, 30% testing
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_categorical, test_size=0.3, random_state=42
    )
    return X_train, X_test, y_train, y_test
```
#### 3. Model Training
```python
def train_model(self, face_data_list, epochs=50):
    # Prepare dataset
    # Create CNN model
    # Data augmentation for better generalization
    # Train with validation
    # Evaluate performance
    # Save model and encoder
```

### Face Template Storage

#### 1. Face Encoding Storage
- **Format**: JSON string in database
- **Content**: 128-dimensional face encoding vector
- **Compression**: Base64 encoding for storage efficiency
- **Integrity**: SHA-256 hash for verification

#### 2. CNN Features Storage
- **Extraction**: Features from second-to-last layer
- **Dimensions**: 256-dimensional feature vector
- **Storage**: JSON format in `cnn_features` column
- **Usage**: Fast similarity comparison

#### 3. Facial Landmarks
- **Detection**: 68-point facial landmarks
- **Storage**: JSON coordinates array
- **Purpose**: Face alignment and quality assessment

## API Endpoints

### Authentication Routes (`routes/auth.py`)

#### POST `/api/auth/login`
```python
{
    "email": "student@fuotuoke.edu.ng",
    "password": "password123"
}
# Returns: JWT token + user data
```

#### POST `/api/auth/register`
```python
{
    "name": "John Doe",
    "studentId": "FUO/2020/CS/001",
    "email": "john@student.fuotuoke.edu.ng",
    "phone": "+234801234567",
    "department": "Computer Science",
    "level": "400",
    "password": "password123",
    "faceData": "base64_image_string"
}
```

### Face Recognition Routes (`routes/face_recognition.py`)

#### POST `/api/face/register`
```python
{
    "face_data": "base64_encoded_image"
}
# Registers face template for current user
```

#### POST `/api/face/verify`
```python
{
    "face_data": "base64_encoded_image"
}
# Returns: verification result + confidence score
```

#### POST `/api/face/train` (Admin only)
```python
{
    "dataset_path": "datasets/faces",
    "epochs": 50,
    "batch_size": 32
}
# Trains CNN model on registered faces
```

### Voting Routes (`routes/voting.py`)

#### POST `/api/voting/cast`
```python
{
    "election_id": 1,
    "office_id": 1,
    "candidate_id": 1,
    "face_verification": "base64_image"
}
# Casts vote with face verification
```

#### GET `/api/voting/history`
```python
# Returns user's voting history
```

### Election Routes (`routes/elections.py`)

#### GET `/api/elections`
```python
# Returns all elections
```

#### GET `/api/elections/{id}`
```python
# Returns specific election details
```

#### POST `/api/elections` (Admin only)
```python
{
    "title": "SUG Elections 2024",
    "description": "Student Union Government Elections",
    "start_date": "2024-03-01T08:00:00Z",
    "end_date": "2024-03-01T18:00:00Z"
}
```

## Security Features

### 1. Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Role-based Access**: Admin vs Student permissions
- **Token Expiration**: 24-hour access tokens
- **Refresh Tokens**: 30-day refresh capability

### 2. Face Recognition Security
- **Liveness Detection**: Prevents photo attacks
- **Confidence Threshold**: 85% minimum for verification
- **Anti-spoofing**: Multiple verification attempts tracking
- **Template Encryption**: Face data encrypted at rest

### 3. Vote Integrity
- **One Vote Per Election**: Database constraints prevent multiple votes
- **Vote Hashing**: SHA-256 hash for vote verification
- **Audit Trail**: Complete voting history logging
- **Anonymization**: Votes separated from voter identity

### 4. Data Protection
- **Password Hashing**: bcrypt with salt
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **CORS Configuration**: Restricted cross-origin access
- **Input Validation**: Comprehensive data validation

## Performance Optimization

### 1. Database Optimization
- **Indexing**: Strategic database indexes
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQLAlchemy queries
- **Caching**: Redis for session and data caching

### 2. CNN Model Optimization
- **Model Compression**: Quantization for faster inference
- **Batch Processing**: Efficient batch predictions
- **GPU Acceleration**: CUDA support for training
- **Model Caching**: Pre-loaded models in memory

### 3. Image Processing
- **Efficient Formats**: JPEG compression for storage
- **Lazy Loading**: On-demand image processing
- **Parallel Processing**: Multi-threaded face detection
- **Memory Management**: Proper cleanup of image data

## Deployment Architecture

### Development Environment
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=development
export DATABASE_URL=sqlite:///voting_system.db
export JWT_SECRET_KEY=your-secret-key

# Initialize database
flask db init
flask db migrate
flask db upgrade

# Seed initial data
python seed_data.py

# Run development server
python app.py
```

### Production Environment
```bash
# Use PostgreSQL
export DATABASE_URL=postgresql://user:pass@localhost/voting_db

# Use Redis for caching
export REDIS_URL=redis://localhost:6379

# Production WSGI server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Monitoring & Logging

### 1. Application Logging
- **Structured Logging**: JSON format logs
- **Log Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Log Rotation**: Daily log file rotation
- **Centralized Logging**: ELK stack integration

### 2. Performance Monitoring
- **Response Times**: API endpoint performance
- **Database Queries**: Query execution monitoring
- **Memory Usage**: Application memory tracking
- **Error Rates**: Exception and error tracking

### 3. Security Monitoring
- **Failed Login Attempts**: Brute force detection
- **Face Verification Failures**: Suspicious activity tracking
- **Vote Anomalies**: Unusual voting pattern detection
- **System Access**: Admin action auditing

## Data Flow

### 1. User Registration Flow
```
User Input → Validation → Password Hashing → Face Registration → 
CNN Feature Extraction → Database Storage → JWT Token Generation
```

### 2. Voting Flow
```
Vote Selection → Face Verification → CNN Prediction → 
Confidence Check → Vote Recording → Audit Logging → 
Response Generation
```

### 3. CNN Training Flow
```
Face Data Collection → Image Preprocessing → Dataset Split (70/30) → 
Model Training → Validation → Model Evaluation → 
Model Saving → Performance Metrics
```

## Error Handling

### 1. API Error Responses
```python
{
    "success": false,
    "error": "error_code",
    "message": "Human readable message",
    "details": {...}  # Additional error context
}
```

### 2. Face Recognition Errors
- **No Face Detected**: Image quality issues
- **Low Confidence**: Verification threshold not met
- **Model Not Loaded**: CNN model initialization failure
- **Processing Error**: Image processing failures

### 3. Database Errors
- **Connection Errors**: Database connectivity issues
- **Constraint Violations**: Data integrity violations
- **Transaction Failures**: Rollback mechanisms
- **Migration Errors**: Schema update failures

## Testing Strategy

### 1. Unit Tests
- **Model Testing**: Database model validation
- **API Testing**: Endpoint functionality testing
- **CNN Testing**: Model prediction accuracy
- **Utility Testing**: Helper function validation

### 2. Integration Tests
- **End-to-End**: Complete user workflows
- **Database Integration**: Data persistence testing
- **Face Recognition**: CNN model integration
- **Security Testing**: Authentication and authorization

### 3. Performance Tests
- **Load Testing**: Concurrent user simulation
- **Stress Testing**: System breaking point
- **CNN Performance**: Model inference speed
- **Database Performance**: Query optimization

This comprehensive backend system provides a secure, scalable, and efficient platform for conducting online elections with advanced facial recognition authentication.
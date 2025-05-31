import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os
import pickle
import base64
from io import BytesIO
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CNNFaceRecognition:
    """
    CNN-based Face Recognition System for FUO Online Voting System
    
    This class implements a Convolutional Neural Network for facial recognition
    authentication in the voting system, following the academic objectives:
    - CNN-based facial recognition using TensorFlow
    - Dataset preprocessing with normalization and feature extraction
    - 70% training and 30% testing split
    - Real-time facial recognition and voter verification
    """
    
    def __init__(self, model_path='models/face_recognition_model.h5', 
                 encoder_path='models/label_encoder.pkl'):
        self.model_path = model_path
        self.encoder_path = encoder_path
        self.model = None
        self.label_encoder = None
        self.img_size = (128, 128)
        self.confidence_threshold = 0.85
        
        # Create models directory if it doesn't exist
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        
        # Load existing model and encoder if available
        self.load_model()
        self.load_encoder()
    
    def create_cnn_model(self, num_classes):
        """
        Create CNN architecture for face recognition
        
        Architecture:
        - 3 Convolutional blocks with BatchNormalization and MaxPooling
        - Dropout layers for regularization
        - Dense layers for classification
        - Softmax activation for multi-class classification
        """
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
            
            # Flatten and Dense layers
            Flatten(),
            Dense(512, activation='relu'),
            Dropout(0.5),
            Dense(256, activation='relu'),
            Dropout(0.5),
            Dense(num_classes, activation='softmax')
        ])
        
        # Compile model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def preprocess_image(self, image_data):
        """
        Preprocess image for CNN input
        
        Steps:
        1. Decode base64 image
        2. Convert to RGB
        3. Resize to target size
        4. Normalize pixel values
        5. Detect and crop face region
        """
        try:
            # Decode base64 image
            if isinstance(image_data, str):
                if image_data.startswith('data:image'):
                    image_data = image_data.split(',')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(BytesIO(image_bytes))
            else:
                image = image_data
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            img_array = np.array(image)
            
            # Detect face using OpenCV Haar Cascade
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                # Use the largest detected face
                (x, y, w, h) = max(faces, key=lambda face: face[2] * face[3])
                
                # Add padding around face
                padding = 20
                x = max(0, x - padding)
                y = max(0, y - padding)
                w = min(img_array.shape[1] - x, w + 2 * padding)
                h = min(img_array.shape[0] - y, h + 2 * padding)
                
                # Crop face region
                face_img = img_array[y:y+h, x:x+w]
            else:
                # If no face detected, use center crop
                h, w = img_array.shape[:2]
                size = min(h, w)
                start_h = (h - size) // 2
                start_w = (w - size) // 2
                face_img = img_array[start_h:start_h+size, start_w:start_w+size]
            
            # Resize to target size
            face_img = cv2.resize(face_img, self.img_size)
            
            # Normalize pixel values to [0, 1]
            face_img = face_img.astype(np.float32) / 255.0
            
            return face_img
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            return None
    
    def prepare_dataset(self, face_data_list):
        """
        Prepare dataset for training with 70-30 split
        
        Args:
            face_data_list: List of dictionaries with 'user_id' and 'face_data'
        
        Returns:
            X_train, X_test, y_train, y_test: Training and testing datasets
        """
        try:
            images = []
            labels = []
            
            logger.info("Preprocessing dataset...")
            
            for data in face_data_list:
                user_id = data['user_id']
                face_data = data['face_data']
                
                # Preprocess image
                processed_img = self.preprocess_image(face_data)
                if processed_img is not None:
                    images.append(processed_img)
                    labels.append(user_id)
            
            if len(images) == 0:
                raise ValueError("No valid images found in dataset")
            
            # Convert to numpy arrays
            X = np.array(images)
            y = np.array(labels)
            
            # Encode labels
            if self.label_encoder is None:
                self.label_encoder = LabelEncoder()
                y_encoded = self.label_encoder.fit_transform(y)
            else:
                y_encoded = self.label_encoder.transform(y)
            
            # Convert to categorical
            y_categorical = tf.keras.utils.to_categorical(y_encoded)
            
            # Split dataset (70% training, 30% testing)
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_categorical, test_size=0.3, random_state=42, stratify=y_encoded
            )
            
            logger.info(f"Dataset prepared: {len(X_train)} training samples, {len(X_test)} testing samples")
            
            return X_train, X_test, y_train, y_test
            
        except Exception as e:
            logger.error(f"Error preparing dataset: {str(e)}")
            return None, None, None, None
    
    def train_model(self, face_data_list, epochs=50, batch_size=32):
        """
        Train the CNN model on face data
        
        Args:
            face_data_list: List of face data for training
            epochs: Number of training epochs
            batch_size: Training batch size
        
        Returns:
            Training history
        """
        try:
            # Prepare dataset
            X_train, X_test, y_train, y_test = self.prepare_dataset(face_data_list)
            
            if X_train is None:
                raise ValueError("Failed to prepare dataset")
            
            # Create model
            num_classes = len(np.unique(self.label_encoder.classes_))
            self.model = self.create_cnn_model(num_classes)
            
            logger.info(f"Training CNN model with {num_classes} classes...")
            
            # Data augmentation for better generalization
            datagen = ImageDataGenerator(
                rotation_range=10,
                width_shift_range=0.1,
                height_shift_range=0.1,
                horizontal_flip=True,
                zoom_range=0.1,
                fill_mode='nearest'
            )
            
            # Train model
            history = self.model.fit(
                datagen.flow(X_train, y_train, batch_size=batch_size),
                epochs=epochs,
                validation_data=(X_test, y_test),
                verbose=1
            )
            
            # Evaluate model
            test_loss, test_accuracy = self.model.evaluate(X_test, y_test, verbose=0)
            logger.info(f"Test accuracy: {test_accuracy:.4f}")
            
            # Save model and encoder
            self.save_model()
            self.save_encoder()
            
            return history
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            return None
    
    def verify_face(self, face_data, user_id):
        """
        Verify if the face belongs to the specified user
        
        Args:
            face_data: Base64 encoded face image
            user_id: User ID to verify against
        
        Returns:
            Dictionary with verification result and confidence
        """
        try:
            if self.model is None or self.label_encoder is None:
                return {
                    'success': False,
                    'error': 'Model not trained or loaded',
                    'confidence': 0.0
                }
            
            # Preprocess image
            processed_img = self.preprocess_image(face_data)
            if processed_img is None:
                return {
                    'success': False,
                    'error': 'Failed to process image',
                    'confidence': 0.0
                }
            
            # Prepare for prediction
            img_batch = np.expand_dims(processed_img, axis=0)
            
            # Make prediction
            predictions = self.model.predict(img_batch, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get predicted user ID
            predicted_user_id = self.label_encoder.inverse_transform([predicted_class_idx])[0]
            
            # Check if prediction matches user ID and confidence is above threshold
            is_match = (predicted_user_id == user_id) and (confidence >= self.confidence_threshold)
            
            return {
                'success': is_match,
                'confidence': confidence,
                'predicted_user_id': predicted_user_id,
                'threshold': self.confidence_threshold
            }
            
        except Exception as e:
            logger.error(f"Error verifying face: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'confidence': 0.0
            }
    
    def register_face(self, face_data, user_id):
        """
        Register a new face for a user
        
        Args:
            face_data: Base64 encoded face image
            user_id: User ID to register
        
        Returns:
            Dictionary with registration result
        """
        try:
            # Preprocess image
            processed_img = self.preprocess_image(face_data)
            if processed_img is None:
                return {
                    'success': False,
                    'error': 'Failed to process image'
                }
            
            # For now, just validate that face can be detected and processed
            # In a full implementation, you would retrain the model with new data
            
            return {
                'success': True,
                'message': 'Face registered successfully',
                'user_id': user_id
            }
            
        except Exception as e:
            logger.error(f"Error registering face: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def save_model(self):
        """Save the trained model"""
        try:
            if self.model is not None:
                self.model.save(self.model_path)
                logger.info(f"Model saved to {self.model_path}")
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
    
    def load_model(self):
        """Load a pre-trained model"""
        try:
            if os.path.exists(self.model_path):
                self.model = load_model(self.model_path)
                logger.info(f"Model loaded from {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
    
    def save_encoder(self):
        """Save the label encoder"""
        try:
            if self.label_encoder is not None:
                with open(self.encoder_path, 'wb') as f:
                    pickle.dump(self.label_encoder, f)
                logger.info(f"Label encoder saved to {self.encoder_path}")
        except Exception as e:
            logger.error(f"Error saving encoder: {str(e)}")
    
    def load_encoder(self):
        """Load the label encoder"""
        try:
            if os.path.exists(self.encoder_path):
                with open(self.encoder_path, 'rb') as f:
                    self.label_encoder = pickle.load(f)
                logger.info(f"Label encoder loaded from {self.encoder_path}")
        except Exception as e:
            logger.error(f"Error loading encoder: {str(e)}")

# Global instance
face_recognition_system = CNNFaceRecognition()

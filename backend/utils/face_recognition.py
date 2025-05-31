import face_recognition
import numpy as np
from PIL import Image
import io
import base64
import json

class FaceRecognitionService:
    def __init__(self, threshold=0.6):
        self.threshold = threshold
    
    def encode_face(self, image_data):
        """
        Encode a face from image data (base64 or file)
        Returns face encoding or None if no face found
        """
        try:
            # Handle base64 image data
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                # Remove data URL prefix
                image_data = image_data.split(',')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
                image_array = np.array(image)
            else:
                # Handle file path or PIL Image
                if isinstance(image_data, str):
                    image_array = face_recognition.load_image_file(image_data)
                else:
                    image_array = np.array(image_data)
            
            # Find face locations
            face_locations = face_recognition.face_locations(image_array)
            
            if not face_locations:
                return None
            
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            if face_encodings:
                return face_encodings[0].tolist()  # Convert to list for JSON storage
            
            return None
            
        except Exception as e:
            print(f"Error encoding face: {str(e)}")
            return None
    
    def compare_faces(self, known_encoding, unknown_encoding):
        """
        Compare two face encodings
        Returns True if faces match within threshold
        """
        try:
            if not known_encoding or not unknown_encoding:
                return False
            
            # Convert back to numpy arrays
            known_array = np.array(known_encoding)
            unknown_array = np.array(unknown_encoding)
            
            # Calculate face distance
            distance = face_recognition.face_distance([known_array], unknown_array)[0]
            
            return distance <= self.threshold
            
        except Exception as e:
            print(f"Error comparing faces: {str(e)}")
            return False
    
    def verify_face(self, stored_encoding_json, verification_image):
        """
        Verify a face against stored encoding
        """
        try:
            # Parse stored encoding
            stored_data = json.loads(stored_encoding_json)
            stored_encoding = stored_data.get('encoding')
            
            if not stored_encoding:
                return False
            
            # Encode verification image
            verification_encoding = self.encode_face(verification_image)
            
            if not verification_encoding:
                return False
            
            # Compare faces
            return self.compare_faces(stored_encoding, verification_encoding)
            
        except Exception as e:
            print(f"Error verifying face: {str(e)}")
            return False

# Global instance
face_service = FaceRecognitionService()

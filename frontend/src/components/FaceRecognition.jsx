"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import { FaCamera, FaSync, FaCheck, FaTimes } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const FaceRecognition = ({ onSuccess, onCancel, mode = "verify" }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [facingMode, setFacingMode] = useState("user")
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState(null)
  const [showFileInput, setShowFileInput] = useState(false)
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamRef = useRef(null)
  const { verifyFace } = useAuth()

  const isMobile = /iPhone|iPad|iPod|Android/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  )

  const videoConstraints = {
    facingMode,
    width: { min: 320, ideal: 640, max: 1280 },
    height: { min: 320, ideal: 640, max: 1280 },
    aspectRatio: 1
  }

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.srcObject = null
    }
  }, [])

  const requestCameraPermission = useCallback(async () => {
    if (window.location.protocol === "file:") {
      setHasPermission(false)
      setError("Camera access is not available when using file://. Please use the upload option.")
      setShowFileInput(true)
      return
    }

    if (!window.isSecureContext) {
      setHasPermission(false)
      setError("Camera access requires HTTPS or localhost.")
      setShowFileInput(true)
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false)
      setError("Camera API not supported. Try a modern browser.")
      setShowFileInput(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: { facingMode, width: 320, height: 320 } }))

      if (stream) {
        setHasPermission(true)
        setError(null)
        setShowFileInput(false)
        streamRef.current = stream
        if (webcamRef.current) {
          webcamRef.current.video.srcObject = stream
        }
      }
    } catch (err) {
      stopCameraStream()
      setHasPermission(false)
      setShowFileInput(true)
      let msg = "Could not access the camera."
      if (err.name === "NotAllowedError") msg = "Camera access denied."
      else if (err.name === "NotFoundError") msg = "No camera found."
      setError(msg)
    }
  }, [facingMode, stopCameraStream])

  useEffect(() => {
    requestCameraPermission()
    setIsCapturing(true)
    return () => stopCameraStream()
  }, [requestCameraPermission])

  const capture = useCallback(() => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot()
        if (imageSrc) {
          setCapturedImage(imageSrc)
          stopCameraStream()
          setIsCapturing(false)
          setError(null)
        } else {
          throw new Error("Failed to capture image")
        }
      } catch {
        setError("Failed to capture image. Try again or upload.")
      }
    }
  }, [stopCameraStream])

  const retake = () => {
    setCapturedImage(null)
    setIsCapturing(true)
    setError(null)
    if (showFileInput) {
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      stopCameraStream()
      requestCameraPermission()
    }
  }

  const switchCamera = useCallback(() => {
    stopCameraStream()
    setFacingMode(prev => (prev === "user" ? "environment" : "user"))
  }, [stopCameraStream])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setCapturedImage(e.target.result)
        setIsCapturing(false)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const processImage = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      if (mode === "verify") {
        const result = await verifyFace(capturedImage)
        if (result?.success) onSuccess(capturedImage)
        else setError("Verification failed.")
      } else {
        await new Promise(res => setTimeout(res, 2000))
        onSuccess(capturedImage)
      }
    } catch {
      setError("Error processing image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    stopCameraStream()
    setIsCapturing(false)
    onCancel()
  }

  if (!hasPermission && error && !showFileInput) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-red-600">Camera Access Required</h3>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={requestCameraPermission} className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800">Try Again</button>
            <button onClick={handleCancel} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{mode === "verify" ? "Verify Your Identity" : "Register Your Face"}</h3>
          <p className="text-gray-600 text-sm mt-2">
            {mode === "verify"
              ? "Look directly at the camera for verification"
              : "Position your face and capture a clear image"}
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="relative mb-4">
          {!capturedImage ? (
            <div className="relative">
              {showFileInput ? (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <button onClick={triggerFileInput} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center space-x-2">
                    <FaCamera />
                    <span>Upload Photo from Camera</span>
                  </button>
                  <input type="file" ref={fileInputRef} accept="image/*" capture="user" onChange={handleFileUpload} className="hidden" />
                </div>
              ) : (
                isCapturing && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-64 object-cover rounded-lg"
                      onUserMediaError={() => {
                        setError("Failed to access camera.")
                        setShowFileInput(true)
                        stopCameraStream()
                      }}
                      onUserMedia={() => console.log("Webcam stream started")}
                      forceScreenshotSourceSize={true}
                      imageSmoothing={true}
                      mirrored={facingMode === "user"}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-yellow-400 rounded-full opacity-50"></div>
                    </div>
                    {isMobile && (
                      <button onClick={switchCamera} className="absolute top-2 right-2 bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800">
                        <FaSync />
                      </button>
                    )}
                  </>
                )
              )}
            </div>
          ) : (
            <div className="relative">
              <img src={capturedImage} alt="Captured face" className="w-full h-64 object-cover rounded-lg" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Processing...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          {!capturedImage ? (
            <>
              {!showFileInput && (
                <button
                  onClick={capture}
                  disabled={!hasPermission}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <FaCamera />
                  <span>Capture</span>
                </button>
              )}
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FaCheck />
                <span>{mode === "verify" ? "Verify" : "Confirm"}</span>
              </button>
              <button
                onClick={retake}
                disabled={isProcessing}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FaSync />
                <span>Retake</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaceRecognition

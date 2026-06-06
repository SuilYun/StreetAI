import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../services/api';
import './ImageUpload.css';

const ImageUpload = ({ onResults }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const processFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsLoading(true);

        try {
            // Simulate API call to FastAPI backend
            const response = await uploadImage(file);
            onResults(response.data);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to process image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="upload-container glass-panel">
            <h2>Analyze Road Surface</h2>
            <p className="subtitle">Upload an image to detect potholes and cracks</p>

            <div
                className={`dropzone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isLoading && fileInputRef.current.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                {isLoading ? (
                    <div className="upload-state">
                        <Loader2 className="icon-spin" size={48} color="var(--accent-primary)" />
                        <p>AI model processing image...</p>
                    </div>
                ) : preview ? (
                    <div className="upload-state preview-state">
                        <img src={preview} alt="Upload preview" className="preview-image" />
                        <div className="preview-overlay">
                            <ImageIcon size={32} />
                            <p>Click or drag to replace</p>
                        </div>
                    </div>
                ) : (
                    <div className="upload-state">
                        <UploadCloud size={48} color="var(--accent-primary)" />
                        <p>Drag and drop your image here</p>
                        <span>or click to browse from device</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;

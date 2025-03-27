"use client"
import React from 'react';

const imageLocations = Array.from({ length: 9 }, (_, index) => (
    `/api/captcha-image?index=${index}`
));

const CaptchaGrid = ({ selectedIndices, handleImageClick }) => {
    return (
        <div className="bg-white w-full h-[300px] grid grid-cols-3 gap-1 p-1 rounded border border-gray-200">
            {imageLocations.map((imageUrl, index) => (
                <div 
                    key={index} 
                    onClick={() => handleImageClick(index)}
                    className={`relative border-2 rounded cursor-pointer transition-all ${
                        selectedIndices.includes(index) 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <img 
                        className="w-full h-full object-cover"
                        src={imageUrl} 
                        alt={`CAPTCHA item ${index}`}
                        loading="lazy"
                    />
                    {selectedIndices.includes(index) && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CaptchaGrid;
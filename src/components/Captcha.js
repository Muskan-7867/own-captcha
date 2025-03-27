"use client"
import React from 'react';
import useCaptcha from '@/hooks/useCaptcha';
import CaptchaGrid from './CaptchGrid';
import VerificationStatus from '@/components/Verify'

const Captcha = () => {
    const {
        selectedIndices,
        isVerified,
        isAlreadyVerified,
        attempts,
        error,
        isLoading,
        handleImageClick,
        handleSubmit
    } = useCaptcha();

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow">
                <div className="text-center text-black">Checking verification status...</div>
            </div>
        );
    }

    if (isVerified) {
        return <VerificationStatus isAlreadyVerified={isAlreadyVerified} />;
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black text-center">Select all Dogs</h2>
            
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
                    {error}
                </div>
            )}

            <CaptchaGrid 
                selectedIndices={selectedIndices}
                handleImageClick={handleImageClick}
            />

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Attempts: {attempts}/3
                </span>
                <button
                    onClick={handleSubmit}
                    disabled={selectedIndices.length === 0}
                    className={`px-4 py-2 rounded text-white ${
                        selectedIndices.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default Captcha;
"use client"
import { useState, useEffect } from 'react';
import { checkVerification, submitVerification } from '@/services/Verifyapi'

const useCaptcha = () => {
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                setIsLoading(true);
                const { verified, attempts: attemptCount } = await checkVerification();
                
                // Check if already verified before showing CAPTCHA
                if (verified) {
                    setIsAlreadyVerified(true);
                    setIsVerified(true);
                }
                
                setAttempts(attemptCount || 0);
            } catch (err) {
                console.warn("Verification check failed:", err.message);
                setIsVerified(false);
                setAttempts(0);
            } finally {
                setIsLoading(false);
            }
        };
        
        // First check localStorage for client-side verification
        const storedVerified = localStorage.getItem('captchaVerified');
        if (storedVerified === 'true') {
            setIsAlreadyVerified(true);
            setIsVerified(true);
            setIsLoading(false);
        } else {
            verify();
        }
    }, []);

    const handleImageClick = (index) => {
        setSelectedIndices(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const handleSubmit = async () => {
        if (selectedIndices.length === 0 || isSubmitting) return;
        
        setIsSubmitting(true);
        setError(null);

        try {
            const { verified } = await submitVerification(selectedIndices);
            
            setAttempts(prev => prev + 1);
            
            if (verified) {
                setIsVerified(true);
                // Store verification in localStorage
                localStorage.setItem('captchaVerified', 'true');
            } else {
                setError(`Verification failed. Attempts: ${attempts + 1}/3`);
                if (attempts >= 2) {
                    setSelectedIndices([]);
                    window.location.reload();
                }
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || "Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedIndices,
        isVerified,
        isAlreadyVerified,
        attempts,
        error,
        isLoading,
        handleImageClick,
        handleSubmit
    };
};

export default useCaptcha;
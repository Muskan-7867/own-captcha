"use client"
import React from 'react';

const VerificationStatus = ({ isAlreadyVerified = false }) => {
    return (
        <div className="p-4 bg-green-100 text-green-800 rounded">
            <h2 className="text-xl font-bold">Verification Complete!</h2>
            <p>{isAlreadyVerified ? "You are already verified." : "You've successfully passed the CAPTCHA."}</p>
        </div>
    );
};

export default VerificationStatus;
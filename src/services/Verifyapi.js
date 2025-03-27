export const checkVerification = async () => {
    const response = await fetch('/api/verify', {
        method: 'GET',
        credentials: 'include'
    });

    if (response.status === 204) {
        return { verified: false, attempts: 0 };
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Not verified");
    }

    return await response.json();
};

export const submitVerification = async (selectedIndices) => {
    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            selections: selectedIndices,
            timestamp: Date.now()
        }),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
    }

    return data;
};
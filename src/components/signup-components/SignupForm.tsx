// SignupForm.tsx
import React, { useState } from 'react';
import { useAuthHandlers } from '../../handlers/authHandler';


interface SignupFormProps {
    setIsConfirmationRequired: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setGivenName: React.Dispatch<React.SetStateAction<string>>;
    setFamilyName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    password: string;
    givenName: string;
    familyName: string;
    loading: boolean;
    error: string | null;
}

const SignupForm: React.FC<SignupFormProps> = ({
    setIsConfirmationRequired,
    setError,
    setLoading,
    setEmail,
    setPassword,
    setGivenName,
    setFamilyName,
    email,
    password,
    givenName,
    familyName,
    loading,
    error
}) => {
    const { handleSignUp } = useAuthHandlers();

    const handleSignupSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleSignUp({
                username: email,
                password,
                email,
                name: `${givenName} ${familyName}`,
                family_name: familyName,
                given_name: givenName
            }, (setError), setIsConfirmationRequired);
        } catch (error) {
            console.log(error)
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignupSubmit} style={styles.form}>
            <h2 style={styles.heading}>Signup</h2>
            <p style={styles.errorMsg}>{error && error}</p>
            <div style={styles.formGroup}>
                <label htmlFor="givenName" style={styles.label}>First Name</label>
                <input
                    type="text"
                    id="givenName"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="familyName" style={styles.label}>Last Name</label>
                <input
                    type="text"
                    id="familyName"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? 'Loading...' : 'Signup'}
            </button>
        </form>
    );
};

const styles = {
    form: {
        width: '300px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
    },
    heading: {
        textAlign: 'center' as const,
        marginBottom: '20px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        position: 'relative' as const,
    },
    errorMsg: {
        color: 'red',
        textAlign: 'center' as const,
        marginBottom: '10px',
        height: '20px'
    },
};

export default SignupForm;

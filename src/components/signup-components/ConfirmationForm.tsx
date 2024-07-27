// ConfirmationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHandlers } from '../../handlers/authHandler';

interface ConfirmationFormProps {
    setIsConfirmationRequired: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    password: string;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
    setIsConfirmationRequired,
    setError,
    setLoading,
    email,
    password
}) => {
    const { handleSignUpConfirmation, handleLogin } = useAuthHandlers();
    const [confirmationCode, setConfirmationCode] = useState('');
    const [loading, setLocalLoading] = useState(false);
    const [error, setLocalError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleConfirmationSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLocalLoading(true);
        setLocalError(null);

        try {
            const result = await handleSignUpConfirmation({
                username: email,
                confirmationCode
            });

            if (result?.isSignUpComplete) {
                const loginResult = await handleLogin({ username: email, password });
                if (loginResult) {
                    navigate('/dashboard');
                } else {
                    setLocalError('Wrong Code');
                }
            } else {
                setLocalError('Wrong Code');
            }
        } catch (error) {
            setLocalError('Wrong Code');
            console.error('Error during confirmation', error);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <form onSubmit={handleConfirmationSubmit} style={styles.form}>
            <h2 style={styles.heading}>Confirm Signup</h2>
            <p style={styles.errorMsg}>{error}</p>
            <div style={styles.formGroup}>
                <label htmlFor="confirmationCode" style={styles.label}>Confirmation Code</label>
                <input
                    type="text"
                    id="confirmationCode"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? 'Loading...' : 'Confirm'}
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
    },
};

export default ConfirmationForm;

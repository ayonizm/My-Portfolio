import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiLogIn } from 'react-icons/fi';
import { login } from '../utils/dataStore';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));

        if (login(password)) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid password. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <motion.form
                className="login-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        width: '70px',
                        height: '70px',
                        margin: '0 auto var(--spacing-lg)',
                        background: 'var(--accent-gradient)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FiLock size={30} color="white" />
                </motion.div>

                <h1 className="login-title gradient-text">Admin Access</h1>

                <p style={{
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-lg)',
                    fontSize: 'var(--text-sm)'
                }}>
                    Enter your admin password to access the dashboard
                </p>

                {error && (
                    <motion.div
                        className="login-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        marginTop: 'var(--spacing-md)'
                    }}
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid white',
                                borderTopColor: 'transparent',
                                borderRadius: '50%'
                            }}
                        />
                    ) : (
                        <>
                            <FiLogIn />
                            Login
                        </>
                    )}
                </motion.button>

                <motion.a
                    href="/"
                    whileHover={{ color: 'var(--accent-primary)' }}
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: 'var(--spacing-lg)',
                        color: 'var(--text-muted)',
                        fontSize: 'var(--text-sm)'
                    }}
                >
                    ← Back to Website
                </motion.a>
            </motion.form>
        </div>
    );
};

export default AdminLogin;

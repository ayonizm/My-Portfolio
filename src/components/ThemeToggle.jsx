import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '2rem',
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)'
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'light' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <FiSun size={24} />
                ) : (
                    <FiMoon size={24} />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;

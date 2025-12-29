import { motion } from 'framer-motion';

// Animated text that reveals character by character
export const AnimatedText = ({ text, className = '', delay = 0 }) => {
    const characters = text.split('');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: delay
            }
        }
    };

    const child = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block' }}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// Typewriter effect
export const TypewriterText = ({ text, className = '', speed = 50, delay = 0 }) => {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: delay + (index * speed) / 1000,
                        duration: 0.01
                    }}
                >
                    {char}
                </motion.span>
            ))}
            <motion.span
                className="cursor-blink"
                animate={{ opacity: [1, 0] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse'
                }}
                style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    background: 'var(--accent-primary)',
                    marginLeft: '4px',
                    verticalAlign: 'middle'
                }}
            />
        </motion.span>
    );
};

// Word reveal animation
export const WordReveal = ({ text, className = '', delay = 0 }) => {
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay
            }
        }
    };

    const child = {
        hidden: { opacity: 0, y: 30, rotateX: 90 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 15,
                stiffness: 100
            }
        }
    };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block', perspective: '1000px' }}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{
                        display: 'inline-block',
                        marginRight: '0.3em',
                        transformOrigin: 'center bottom'
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
};

// Gradient animated text
export const GradientText = ({ children, className = '' }) => {
    return (
        <motion.span
            className={`gradient-text ${className}`}
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear'
            }}
            style={{
                backgroundSize: '200% 200%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #8b5cf6 75%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}
        >
            {children}
        </motion.span>
    );
};

export default AnimatedText;

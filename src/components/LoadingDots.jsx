import { motion } from 'framer-motion';

const LoadingDots = ({ size = 12 }) => {
    const colors = [
        '#ea4335', // Red
        '#4285f4', // Blue
        '#34a853', // Green
        '#fbbc05', // Yellow
        '#f29900'  // Orange
    ];

    const containerStyle = {
        display: 'flex',
        gap: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '40px'
    };

    const dotVariants = {
        animate: {
            y: [0, -size, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div style={containerStyle}>
            {colors.map((color, index) => (
                <motion.div
                    key={index}
                    variants={dotVariants}
                    animate="animate"
                    style={{
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        backgroundColor: color,
                    }}
                    transition={{
                        delay: index * 0.1 // Stagger effect for wave
                    }}
                />
            ))}
        </div>
    );
};

export default LoadingDots;

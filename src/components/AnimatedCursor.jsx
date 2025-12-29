import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsPointer(isClickable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    // Hide on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        return null;
    }

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="cursor-dot"
                animate={{
                    x: position.x - 6,
                    y: position.y - 6,
                    scale: isClicking ? 0.8 : 1,
                    opacity: isHidden ? 0 : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 12,
                    height: 12,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    mixBlendMode: 'difference'
                }}
            />

            {/* Cursor ring */}
            <motion.div
                className="cursor-ring"
                animate={{
                    x: position.x - 24,
                    y: position.y - 24,
                    scale: isPointer ? 1.5 : isClicking ? 0.9 : 1,
                    opacity: isHidden ? 0 : 0.5
                }}
                transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 24,
                    mass: 0.8
                }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 48,
                    height: 48,
                    border: '2px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99998
                }}
            />
        </>
    );
};

export default AnimatedCursor;

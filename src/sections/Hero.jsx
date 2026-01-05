import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { getHero, getHeroSync } from '../utils/dataStore';
import { GradientText, TypewriterText } from '../components/AnimatedText';
import adamLogo from '../assets/adam.png';
import nsuLogo from '../assets/NSU.svg';

// Floating 3D Logo Component
const FloatingLogo = ({ src, alt, delay = 0, xOffset = 0, yOffset = 0, size = 120 }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-50, 50], [15, -15]);
    const rotateY = useTransform(x, [-50, 50], [-15, 15]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -15, 0] // Floating animation
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }
            }}
            style={{
                position: 'absolute',
                left: xOffset,
                top: yOffset,
                perspective: 500,
                zIndex: 10
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    width: size,
                    height: size,
                    rotateX,
                    rotateY,
                    cursor: 'pointer',
                    // Removed filter/glow as requested implicitly by "remove glittering" to make it clean
                }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}>
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

// ... (FloatingLogo definition ends)

// ... (No hanging JSX here) 

const getRankColor = (rating) => {
    if (rating < 1200) return '#CCCCCC'; // Newbie - Gray
    if (rating < 1400) return '#77FF77'; // Pupil - Green
    if (rating < 1600) return '#03A89E'; // Specialist - Cyan
    if (rating < 1900) return '#0000FF'; // Expert - Blue
    if (rating < 2100) return '#AA00AA'; // Candidate Master - Violet
    if (rating < 2300) return '#FF8C00'; // Master - Orange
    if (rating < 2400) return '#FF8C00'; // International Master - Orange
    if (rating < 2600) return '#FF0000'; // Grandmaster - Red
    if (rating < 3000) return '#FF0000'; // International Grandmaster - Red
    return '#800000'; // Legendary Grandmaster - Red/Black
};


const Hero = () => {
    const [hero, setHero] = useState(getHeroSync());
    const [scrollY, setScrollY] = useState(0);
    const [cfRating, setCfRating] = useState(null);

    useEffect(() => {
        // Fetch Codeforces Rating
        fetch('https://codeforces.com/api/user.info?handles=ayon6594')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK' && data.result?.length > 0) {
                    setCfRating(data.result[0].maxRating);
                }
            })
            .catch(err => console.error('Failed to fetch CF rating:', err));

        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Load from Firebase on mount
        getHero().then(setHero);

        const handleStorageChange = () => {
            setHero(getHeroSync());
        };
        window.addEventListener('storage', handleStorageChange);

        // Also check periodically for same-tab updates
        const interval = setInterval(() => {
            setHero(getHeroSync());
        }, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 15,
                stiffness: 100
            }
        }
    };

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    function handleMouseMove(event) {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    // Improve 3D rotation effect
    const rotateX = useTransform(mouseY, [-200, 200], [15, -15]); // Up flows down
    const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]); // Left flows right

    return (
        <section className="hero-section" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 'var(--spacing-xl) 0',
            perspective: 1000 // Add perspective container
        }}>
            <div className="container">
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-2xl)',
                        alignItems: 'center'
                    }}
                >
                    {/* Left Content */}
                    <div className="hero-text">
                        <motion.p
                            variants={itemVariants}
                            style={{
                                color: 'var(--accent-primary)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 500,
                                marginBottom: 'var(--spacing-sm)'
                            }}
                        >
                            Hello, I'm
                        </motion.p>

                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-6xl)',
                                fontWeight: 800,
                                lineHeight: 1.1,
                                marginBottom: 'var(--spacing-md)'
                            }}
                        >
                            <GradientText>{hero.name}</GradientText>
                        </motion.h1>

                        <motion.div
                            variants={itemVariants}
                            style={{
                                fontSize: 'var(--text-xl)',
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--spacing-md)',
                                minHeight: '2rem'
                            }}
                        >
                            <TypewriterText text={hero.tagline} delay={1} speed={40} />
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--text-muted)',
                                maxWidth: '500px',
                                marginBottom: 'var(--spacing-lg)',
                                lineHeight: 1.8
                            }}
                        >
                            {hero.description}
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            style={{
                                display: 'flex',
                                gap: 'var(--spacing-md)',
                                alignItems: 'center',
                                position: 'relative' // Needed for absolute positioning context
                            }}
                        >
                            <motion.a
                                href="#projects"
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View My Work
                            </motion.a>
                            <motion.a
                                href="#contact"
                                className="btn btn-secondary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact Me
                            </motion.a>

                            {/* Floating Logos */}
                            <FloatingLogo
                                src={nsuLogo}
                                alt="NSU"
                                delay={0.5}
                                xOffset="-40px"
                                yOffset="80px"
                                size={150}
                            />
                            <FloatingLogo
                                src={adamLogo}
                                alt="Adam"
                                delay={0.8}
                                xOffset="0px"
                                yOffset="80px"
                                size={90}
                            />
                        </motion.div>

                    </div>

                    {/* Right - Hero Image */}
                    <motion.div
                        variants={itemVariants}
                        className="hero-image-wrapper"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            perspective: 1000 // Ensure perspective is here too
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <motion.div
                            style={{
                                position: 'relative',
                                zIndex: 2,
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            }}
                        >
                            <div style={{
                                width: '350px',
                                height: '350px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '4px solid var(--accent-primary)',
                                boxShadow: '0 0 60px rgba(99, 102, 241, 0.3)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--bg-secondary)',
                                transform: 'translateZ(20px)' // Pop out slightly
                            }}>
                                <img
                                    src={hero.image}
                                    alt={hero.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center center',
                                        minWidth: '100%',
                                        minHeight: '100%'
                                    }}
                                />
                            </div>

                            {/* Decorative ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '-20px',
                                    right: '-20px',
                                    bottom: '-20px',
                                    border: '2px dashed rgba(139, 92, 246, 0.3)',
                                    borderRadius: '50%'
                                }}
                            />

                        </motion.div>



                        {/* Background glow */}
                        <div style={{
                            position: 'absolute',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                            zIndex: 1
                        }} />
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scrollY > 50 ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'absolute',
                        bottom: 'var(--spacing-xl)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                    }}
                >
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Scroll Down</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FiArrowDown style={{ color: 'var(--accent-primary)' }} />
                    </motion.div>
                </motion.div>
            </div>

            <style>{`
        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-text {
            order: 2;
          }
          .hero-image-wrapper {
            order: 1;
          }
          .hero-text > div {
            justify-content: center !important;
          }
          .hero-image-wrapper > div > div:first-child {
            width: 250px !important;
            height: 250px !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;

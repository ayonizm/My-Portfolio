import { motion } from 'framer-motion';
import { FiArrowDown, FiGithub, FiLinkedin } from 'react-icons/fi';
import { TypewriterText, GradientText } from '../components/AnimatedText';
import { getHeroSync, getHero } from '../utils/dataStore';
import { useEffect, useState } from 'react';

const Hero = () => {
    const [hero, setHero] = useState(getHeroSync());
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
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

    return (
        <section className="hero-section" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 'var(--spacing-xl) 0'
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
                                alignItems: 'center'
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
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            style={{
                                display: 'flex',
                                gap: 'var(--spacing-md)',
                                marginTop: 'var(--spacing-xl)'
                            }}
                        >
                            <motion.a
                                href="https://github.com/ayonizm"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, color: '#8b5cf6' }}
                                style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}
                            >
                                <FiGithub />
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/md-anisul-haque-chowdhury-8315a5231/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, color: '#8b5cf6' }}
                                style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}
                            >
                                <FiLinkedin />
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* Right - Hero Image */}
                    <motion.div
                        variants={itemVariants}
                        className="hero-image-wrapper"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            animate={{
                                y: [0, -15, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            style={{
                                position: 'relative',
                                zIndex: 2
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
                                background: 'var(--bg-secondary)'
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

import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { TypewriterText, GradientText } from '../components/AnimatedText';
import { getHeroSync, getHero } from '../utils/dataStore';
import { useEffect, useState } from 'react';
import React from 'react';

import iconC from '../assets/c.svg';
import iconCpp from '../assets/cpp.svg';
import iconJava from '../assets/java.svg';
import iconKotlin from '../assets/kotlin.svg';
import iconPython from '../assets/python.svg';

const OrbitingIcons = ({ radius = 200, duration = 30, children }) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }}
        >
            {React.Children.map(children, (child, index) => {
                const total = React.Children.count(children);
                const angle = (index / total) * 360;

                return (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '-25px', // Center offset
                            marginLeft: '-25px'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration, repeat: Infinity, ease: 'linear' }}
                        >
                            {child}
                        </motion.div>
                    </div>
                );
            })}
        </motion.div>
    );
};

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

// Github Icon (Full Color)
const GithubIcon = () => (
    <svg viewBox="0 0 48 47" width="1em" height="1em">
        <path fill="#3E75C3" fillRule="evenodd" d="M23.999 0C10.745 0 0 10.787 0 24.097a24.09 24.09 0 0 0 16.414 22.861c1.2.222 1.639-.522 1.639-1.16 0-.573-.021-2.088-.034-4.098-6.676 1.456-8.085-3.23-8.085-3.23-1.09-2.784-2.663-3.525-2.663-3.525-2.18-1.495.165-1.465.165-1.465 2.407.17 3.674 2.483 3.674 2.483 2.143 3.683 5.618 2.62 6.986 2.002.217-1.557.838-2.619 1.524-3.221-5.33-.609-10.932-2.675-10.932-11.908 0-2.63.934-4.781 2.47-6.466-.247-.61-1.07-3.059.235-6.377 0 0 2.015-.647 6.6 2.47 1.915-.534 3.967-.801 6.008-.811 2.039.01 4.092.277 6.01.811 4.58-3.117 6.592-2.47 6.592-2.47 1.31 3.318.486 5.767.239 6.377 1.538 1.685 2.467 3.835 2.467 6.466 0 9.256-5.611 11.293-10.957 11.89.86.744 1.629 2.213 1.629 4.462 0 3.22-.03 5.819-.03 6.61 0 .644.432 1.394 1.65 1.157C41.13 43.763 48 34.738 48 24.097 48 10.787 37.254 0 23.999 0"></path>
    </svg>
);

// LinkedIn Icon (Full Color)
const LinkedinIcon = () => (
    <svg viewBox="0 0 512 512" width="1em" height="1em">
        <g>
            <path fill="#0A7BBA" d="M506 256.879c0 138.066-111.934 250-250 250-138.067 0-250-111.934-250-250 0-138.067 111.933-250 250-250 138.066 0 250 111.933 250 250zm0 0"></path>
            <path fill="#F2F2F2" d="M405.36 276.985v103.076h-59.753v-96.157c0-24.153-8.617-40.647-30.269-40.647-16.493 0-26.308 11.119-30.638 21.869-1.588 3.83-1.98 9.161-1.98 14.558v100.378h-59.774s.805-162.873 0-179.734h59.774v25.478c-.108.196-.282.389-.392.585h.392v-.585c7.943-12.227 22.108-29.702 53.856-29.702 39.321 0 68.784 25.698 68.784 80.881zM160.452 113.698c-20.455 0-33.815 13.426-33.815 31.052 0 17.255 12.969 31.049 33.032 31.049h.37c20.846 0 33.815-13.793 33.815-31.049-.392-17.625-12.969-31.052-33.402-31.052zm-30.268 266.364h59.731V200.328h-59.731v179.734zm0 0"></path>
        </g>
    </svg>
);

const Hero = () => {
    const [hero, setHero] = useState(getHeroSync());
    const [scrollY, setScrollY] = useState(0);
    const [cfRating, setCfRating] = useState(null);

    const [orbitRadius, setOrbitRadius] = useState(260);

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
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 450) {
                setOrbitRadius(150);
            } else if (width < 768) {
                setOrbitRadius(200);
            } else {
                setOrbitRadius(260);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
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
                                href="#cp-analysis"
                                className="btn btn-secondary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Analysis
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
                                whileHover={{ scale: 1.2, y: -2 }}
                                style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}
                            >
                                <GithubIcon />
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/md-anisul-haque-chowdhury-8315a5231/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, y: -2 }}
                                style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}
                            >
                                <LinkedinIcon />
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

                            {/* Orbiting Tech Icons */}
                            <OrbitingIcons radius={orbitRadius} duration={30}>
                                <img src={iconCpp} alt="C++" width="40" />
                                <img src={iconJava} alt="Java" width="40" />
                                <img src={iconPython} alt="Python" width="40" />
                                <img src={iconKotlin} alt="Kotlin" width="40" />
                                <img src={iconC} alt="C" width="40" />
                            </OrbitingIcons>
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
            margin-bottom: 60px;
            margin-top: 40px;
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

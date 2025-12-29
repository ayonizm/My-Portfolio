import { motion } from 'framer-motion';
import { FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { getProjects, getProjectsSync } from '../utils/dataStore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const AllProjects = () => {
    const [projects, setProjects] = useState(getProjectsSync());

    useEffect(() => {
        getProjects().then(setProjects);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <ParticleBackground />

            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 'var(--spacing-xl)' }}
                >
                    <Link to="/">
                        <motion.button
                            className="btn btn-secondary"
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}
                        >
                            <FiArrowLeft />
                            Back to Home
                        </motion.button>
                    </Link>

                    <motion.span
                        style={{
                            color: 'var(--accent-primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: 'var(--spacing-sm)',
                            display: 'block'
                        }}
                    >
                        Portfolio
                    </motion.span>
                    <h1 className="section-title" style={{ margin: 0 }}>All Projects</h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        marginTop: 'var(--spacing-md)'
                    }}>
                        A complete collection of my work showcasing various technologies and creative solutions.
                    </p>
                </motion.div>

                <div className="grid grid-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                type: 'spring',
                                damping: 15
                            }}
                        >
                            <motion.a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card"
                                whileHover={{ y: -8 }}
                                style={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    height: '100%'
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '200px'
                                }}>
                                    <motion.img
                                        src={project.image}
                                        alt={project.name}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(10, 10, 15, 0.9), transparent)',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            padding: 'var(--spacing-md)'
                                        }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'var(--accent-gradient)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FiExternalLink style={{ color: 'white' }} />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-sm)' }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)'
                                        }}>
                                            {project.name}
                                        </h3>
                                        {project.featured && (
                                            <span style={{
                                                fontSize: 'var(--text-xs)',
                                                background: 'var(--accent-primary)',
                                                padding: '2px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                color: 'white'
                                            }}>
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.6
                                    }}>
                                        {project.description}
                                    </p>
                                </div>
                            </motion.a>
                        </motion.div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            color: 'var(--text-muted)'
                        }}
                    >
                        No projects found. Add some from the admin dashboard!
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllProjects;

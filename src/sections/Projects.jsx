import { motion } from 'framer-motion';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { getFeaturedProjectsSync, subscribeToProjects } from '../utils/dataStore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                damping: 15
            }}
        >
            <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card project-card"
                whileHover={{ y: -8 }}
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    height: '100%'
                }}
            >
                {/* Image */}
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

                {/* Content */}
                <div style={{ padding: 'var(--spacing-lg)' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--text-primary)'
                    }}>
                        {project.name}
                    </h3>
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
    );
};

const Projects = () => {
    const [projects, setProjects] = useState(getFeaturedProjectsSync());

    useEffect(() => {
        const unsubscribe = subscribeToProjects((allProjects) => {
            setProjects(allProjects.filter(p => p.featured).slice(0, 3));
        });
        return () => unsubscribe();
    }, []);

    return (
        <section id="projects" className="section" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}
                >
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
                    <h2 className="section-title" style={{ margin: 0 }}>Featured Projects</h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: 'var(--spacing-md) auto 0'
                    }}>
                        A selection of my best work 
                    </p>
                </motion.div>

                <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center' }}
                >
                    <Link to="/projects">
                        <motion.button
                            className="btn btn-secondary"
                            whileHover={{ scale: 1.05, gap: '12px' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Browse All Projects
                            <FiArrowRight />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;

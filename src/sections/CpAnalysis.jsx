import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getAnalysisSync, subscribeToAnalysis } from '../utils/dataStore';
import LoadingDots from '../components/LoadingDots';

const StatCard = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card"
            style={{
                padding: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, var(--accent-primary) 10%, transparent 70%)`,
                opacity: 0.1,
                zIndex: 0
            }} />

            {/* Logo/Icon Container - Made Bigger */}
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-primary)',
                fontSize: '2.5rem',
                border: '1px solid var(--border-color)',
                zIndex: 1
            }}>
                {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
                ) : (
                    <span>{item.icon || '📊'}</span>
                )}
            </div>

            {/* Title (Company Name) */}
            <h3 style={{
                color: 'var(--text-primary)',
                fontSize: 'var(--text-2xl)',
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 700,
                zIndex: 1
            }}>
                {item.title}
            </h3>

            {/* Job Title - New Field */}
            {item.jobTitle && (
                <div style={{
                    color: 'var(--accent-primary)',
                    fontSize: 'var(--text-lg)',
                    marginBottom: 'var(--spacing-xs)',
                    fontWeight: 600,
                    zIndex: 1
                }}>
                    {item.jobTitle}
                </div>
            )}

            {/* Value (Duration) */}
            <div style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 500,
                color: 'var(--text-muted)',
                marginBottom: 'var(--spacing-xs)',
                fontFamily: 'var(--font-primary)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
            }}>
                {item.value ?? <LoadingDots size={6} />}
            </div>

            {/* Visual Graph/Bar */}
            <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '2px',
                marginTop: 'var(--spacing-md)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: (index * 0.1) + 0.2 }}
                    style={{
                        height: '100%',
                        background: 'var(--accent-primary)',
                        borderRadius: '2px',
                        boxShadow: `0 0 10px var(--accent-primary)`
                    }}
                />
            </div>
        </motion.div>
    );
};

const CpAnalysis = () => {
    const [analysis, setAnalysis] = useState(getAnalysisSync());

    useEffect(() => {
        const unsubscribe = subscribeToAnalysis(setAnalysis);
        return () => unsubscribe();
    }, []);

    return (
        <section className="section" id="cp-analysis">
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
                    </motion.span>
                    <h2 className="section-title" style={{ margin: 0 }}>
                        Analysis
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: 'var(--spacing-md) auto 0'
                    }}>
                        Tracking my progress
                    </p>
                </motion.div>

                <div className="grid grid-3" style={{ justifyContent: 'center' }}>
                    {analysis.map((item, index) => (
                        <StatCard
                            key={item.id}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CpAnalysis;

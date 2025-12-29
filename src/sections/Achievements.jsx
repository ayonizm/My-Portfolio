import { motion } from 'framer-motion';
import { getAchievementsSync, subscribeToAchievements } from '../utils/dataStore';
import { useEffect, useState } from 'react';

const AchievementCard = ({ achievement, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: 'spring',
                damping: 15
            }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-xl)'
            }}
        >
            {/* Timeline dot */}
            <motion.div
                whileHover={{ scale: 1.2 }}
                style={{
                    width: '60px',
                    height: '60px',
                    minWidth: '60px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    border: '3px solid var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {achievement.icon || achievement.image ? (
                    achievement.image ? (
                        <img
                            src={achievement.image}
                            alt={achievement.title}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span>{achievement.icon}</span>
                    )
                ) : (
                    <span>✨</span>
                )}
            </motion.div>

            {/* Content card */}
            <motion.div
                className="glass-card"
                whileHover={{ x: 10 }}
                style={{
                    flex: 1,
                    padding: 'var(--spacing-lg)',
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '0',
                    height: '0',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderRight: '8px solid var(--border-color)'
                }} />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}>
                        {achievement.title}
                    </h3>
                    {achievement.date && (
                        <span style={{
                            color: 'var(--accent-primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500
                        }}>
                            {achievement.date}
                        </span>
                    )}
                </div>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.6
                }}>
                    {achievement.description}
                </p>
            </motion.div>
        </motion.div>
    );
};

const Achievements = () => {
    const [achievements, setAchievements] = useState(getAchievementsSync());

    useEffect(() => {
        const unsubscribe = subscribeToAchievements(setAchievements);
        return () => unsubscribe();
    }, []);

    return (
        <section id="achievements" className="section" style={{ position: 'relative', zIndex: 1 }}>
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
                        Milestones
                    </motion.span>
                    <h2 className="section-title" style={{ margin: 0 }}>Achievements</h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: 'var(--spacing-md) auto 0'
                    }}>
                        Key accomplishments and recognitions throughout my journey as a developer.
                    </p>
                </motion.div>

                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    {/* Timeline line */}
                    <div style={{
                        position: 'absolute',
                        left: '29px',
                        top: '30px',
                        bottom: '30px',
                        width: '2px',
                        background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))',
                        opacity: 0.3
                    }} />

                    {achievements.map((achievement, index) => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;

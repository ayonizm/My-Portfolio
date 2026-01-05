import { motion } from 'framer-motion';
import { SiCodeforces, SiGithub } from 'react-icons/si';
import { FaScroll } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import atcoderIcon from '../assets/atcoder.svg';
import vjudgeIcon from '../assets/vjudge.svg';
import LoadingDots from '../components/LoadingDots';
import { fetchCodeforces } from '../utils/codeforces';

const StatCard = ({ title, value, icon: Icon, subtext, color, delay, type }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
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
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                zIndex: 0
            }} />

            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-md)',
                color: color,
                fontSize: '1.8rem',
                border: `1px solid ${color}30`,
                zIndex: 1
            }}>
                <Icon />
            </div>

            <h3 style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 500,
                zIndex: 1
            }}>
                {title}
            </h3>

            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)',
                fontFamily: 'var(--font-display)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
            }}>
                {value ?? <LoadingDots size={8} />}
            </div>

            <p style={{
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
                zIndex: 1
            }}>
                {subtext}
            </p>

            {/* Visual Graph/Bar based on type */}
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
                    whileInView={{ width: '100%' }} // Just full width for effect, or calculated
                    transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                    style={{
                        height: '100%',
                        background: color,
                        width: type === 'research' ? '0%' : '75%', // Mock percentage
                        borderRadius: '2px',
                        boxShadow: `0 0 10px ${color}`
                    }}
                />
            </div>
        </motion.div>
    );
};

const CpAnalysis = () => {
    // Initialize with null so we can show loading '...' until data arrives or fallback triggers
    const [cfStats, setCfStats] = useState({ solved: null, rating: '...', rank: '...' });
    const [ghStats, setGhStats] = useState({ repos: 3, desc: 'Public Repositories' });
    const [acStats, setAcStats] = useState({ solved: null, rating: '...', rank: '...' });
    const [vjStats, setVjStats] = useState({ solved: 904, desc: 'Total Solved' }); // Default 904 as requested

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const promises = [
                // Codeforces Rating/Rank
                fetchCodeforces('user.info', { handles: 'ayon6594' }),
                // Codeforces Submissions
                fetchCodeforces('user.status', { handle: 'ayon6594', from: 1, count: 50000 }),
                // AtCoder History
                fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/contest_history?user=ayonizm').then(res => res.json()),
                // AtCoder Submissions
                fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=ayonizm&from_second=0').then(res => res.json()),
                // VJudge Data (via Proxy)
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://vjudge.net/user/solveDetail/ayon6594')}`).then(res => res.json())
            ];

            const results = await Promise.allSettled(promises);

            if (!isMounted) return;

            // Process Codeforces
            const cfInfoResult = results[0];
            const cfStatusResult = results[1];

            if (cfInfoResult.status === 'fulfilled' && cfStatusResult.status === 'fulfilled') {
                const infoData = cfInfoResult.value;
                const statusData = cfStatusResult.value;

                if (infoData.status === 'OK' && statusData.status === 'OK') {
                    const user = infoData.result[0];
                    const solvedProblems = new Set();
                    statusData.result.forEach(submission => {
                        if (submission.verdict === 'OK') {
                            const key = submission.problem.contestId
                                ? `${submission.problem.contestId}-${submission.problem.index}`
                                : submission.problem.name;
                            solvedProblems.add(key);
                        }
                    });

                    // Offset corrected to 79 as requested (Total 696)
                    const PRIVATE_SOLVED_OFFSET = 79;
                    setCfStats({
                        rating: user.maxRating || 0,
                        rank: user.maxRank ? (user.maxRank.charAt(0).toUpperCase() + user.maxRank.slice(1)) : 'Unrated',
                        solved: solvedProblems.size + PRIVATE_SOLVED_OFFSET
                    });
                } else {
                    // Fallback
                    setCfStats({ rating: '1420', rank: 'Specialist', solved: 696 });
                }
            } else {
                setCfStats({ rating: '1420', rank: 'Specialist', solved: 696 });
            }

            // Process AtCoder
            const acHistoryResult = results[2];
            const acSubResult = results[3];
            let acRating = 212;
            let acSolved = 119;
            let acRank = 'Gray';

            if (acHistoryResult.status === 'fulfilled' && Array.isArray(acHistoryResult.value) && acHistoryResult.value.length > 0) {
                acRating = acHistoryResult.value[acHistoryResult.value.length - 1].NewRating;
            }

            if (acSubResult.status === 'fulfilled' && Array.isArray(acSubResult.value)) {
                const uniqueAc = new Set();
                acSubResult.value.forEach(sub => {
                    if (sub.result === 'AC') uniqueAc.add(sub.problem_id);
                });
                acSolved = uniqueAc.size;
            }

            if (acRating < 400) acRank = 'Gray';
            else if (acRating < 800) acRank = 'Brown';
            else if (acRating < 1200) acRank = 'Green';
            else if (acRating < 1600) acRank = 'Cyan';
            else if (acRating < 2000) acRank = 'Blue';
            else if (acRating < 2400) acRank = 'Yellow';
            else if (acRating < 2800) acRank = 'Orange';
            else acRank = 'Red';

            setAcStats({ solved: acSolved, rating: acRating, rank: acRank });

            // Process VJudge
            const vjResult = results[4];
            if (vjResult.status === 'fulfilled' && vjResult.value.contents) {
                try {
                    const parsed = JSON.parse(vjResult.value.contents);
                    if (parsed.acRecords) {
                        setVjStats({ solved: Object.keys(parsed.acRecords).length, desc: 'Total Solved' });
                    }
                } catch (e) {
                    console.warn('VJudge parse error', e);
                    // Fallback to 904
                    setVjStats({ solved: 904, desc: 'Total Solved' });
                }
            } else {
                setVjStats({ solved: 904, desc: 'Total Solved' });
            }
        };

        fetchData();
        return () => { isMounted = false; };
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
                        Problem Solving
                    </motion.span>
                    <h2 className="section-title" style={{ margin: 0 }}>
                        Ayon's CP Analysis
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: 'var(--spacing-md) auto 0'
                    }}>
                        Tracking my progress in competitive programming, open source contributions, and research.
                    </p>
                </motion.div>

                <div className="grid grid-3" style={{ justifyContent: 'center' }}>
                    <StatCard
                        title="Codeforces Solved"
                        value={cfStats.solved}
                        icon={SiCodeforces}
                        subtext={`Max Rating: ${cfStats.rating} (${cfStats.rank})`}
                        color="#F44336" // Codeforces red
                        delay={0.1}
                        type="problems"
                    />
                    <StatCard
                        title="GitHub Repos"
                        value={ghStats.repos}
                        icon={SiGithub}
                        subtext={ghStats.desc}
                        color="#2dba4e" // GitHub green
                        delay={0.2}
                        type="commits"
                    />
                    <StatCard
                        title="AtCoder Solved"
                        value={acStats.solved}
                        icon={() => <img src={atcoderIcon} alt="AtCoder" style={{ width: '1em', height: '1em' }} />}
                        color="#000000" // AtCoder Black
                        delay={0.3}
                        type="problems"
                    />
                    <StatCard
                        title="VJudge Solved"
                        value={vjStats.solved}
                        icon={() => <img src={vjudgeIcon} alt="VJudge" style={{ width: '1em', height: '1em' }} />}
                        subtext={vjStats.desc}
                        color="#ffffff" // White/VJudge color
                        delay={0.35}
                        type="problems"
                    />
                    <StatCard
                        title="Research Papers"
                        value="0"
                        icon={FaScroll}
                        subtext="Will do in future"
                        color="#8b5cf6" // Purple
                        delay={0.4}
                        type="research"
                    />
                </div>

                <div style={{
                    marginTop: 'var(--spacing-2xl)',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <motion.a
                        href="/analysis"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        View Detailed Analysis
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default CpAnalysis;

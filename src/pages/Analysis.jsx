import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const Analysis = () => {
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        cfSolved: 0,
        acSolved: 0,
        totalSolved: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch CF Submissions
                const cfRes = await fetch('https://codeforces.com/api/user.status?handle=ayon6594&from=1&count=50000');
                const cfData = await cfRes.json();

                // Fetch AC Submissions
                const acRes = await fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=ayonizm&from_second=0');
                const acData = await acRes.json();

                const timestamps = new Set();
                const cfSolvedByTime = [];
                const acSolvedByTime = [];

                // Process Codeforces
                if (cfData.status === 'OK') {
                    const solvedSet = new Set();
                    // Process in chronological order (API returns reverse chronological)
                    const submissions = cfData.result.reverse();

                    submissions.forEach(sub => {
                        if (sub.verdict === 'OK') {
                            const key = sub.problem.contestId
                                ? `${sub.problem.contestId}-${sub.problem.index}`
                                : sub.problem.name;

                            if (!solvedSet.has(key)) {
                                solvedSet.add(key);
                                const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
                                timestamps.add(date);
                                cfSolvedByTime.push({ date, count: solvedSet.size });
                            }
                        }
                    });
                }

                // Process AtCoder
                if (Array.isArray(acData)) {
                    const solvedSet = new Set();
                    // API returns chronological order usually, ensure it by sorting
                    const submissions = acData.sort((a, b) => a.epoch_second - b.epoch_second);

                    submissions.forEach(sub => {
                        if (sub.result === 'AC') {
                            if (!solvedSet.has(sub.problem_id)) {
                                solvedSet.add(sub.problem_id);
                                const date = new Date(sub.epoch_second * 1000).toISOString().split('T')[0];
                                timestamps.add(date);
                                acSolvedByTime.push({ date, count: solvedSet.size });
                            }
                        }
                    });
                }

                // Merge Data
                const sortedDates = Array.from(timestamps).sort();
                let currentCf = 0;
                let currentAc = 0;
                const mergedData = [];

                // Helper to find count at a specific date
                const getCountAtDate = (arr, date) => {
                    // This assumes arrays are sorted by date. 
                    // We need to carry forward the previous value if no entry for this date.
                    const entry = arr.find(x => x.date === date);
                    return entry ? entry.count : null;
                };

                sortedDates.forEach(date => {
                    const cfCount = getCountAtDate(cfSolvedByTime, date);
                    const acCount = getCountAtDate(acSolvedByTime, date);

                    if (cfCount !== null) currentCf = cfCount;
                    if (acCount !== null) currentAc = acCount;

                    mergedData.push({
                        date,
                        Codeforces: currentCf + 79, // Adding the private/group offset
                        AtCoder: currentAc,
                        Total: currentCf + 79 + currentAc
                    });
                });

                // Downsample if too many points (optional, but good for performance)
                const downsampled = mergedData.length > 100
                    ? mergedData.filter((_, i) => i % Math.ceil(mergedData.length / 100) === 0 || i === mergedData.length - 1)
                    : mergedData;

                setGraphData(downsampled);
                setStats({
                    cfSolved: currentCf + 79,
                    acSolved: currentAc,
                    totalSolved: currentCf + 79 + currentAc
                });

            } catch (error) {
                console.error("Error fetching analysis data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="min-h-screen relative">
            <ParticleBackground />

            <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--spacing-lg)',
                    textDecoration: 'none'
                }}>
                    <FiArrowLeft /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: 'var(--spacing-xl)' }}
                >
                    <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
                        Detailed CP Analysis
                    </h1>

                    <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>Total Solved</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                {loading ? '...' : stats.totalSolved}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>Codeforces</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#F44336' }}>
                                {loading ? '...' : stats.cfSolved}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>AtCoder</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
                                {loading ? '...' : stats.acSolved}
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '500px', width: '100%' }}>
                        {loading ? (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                Loading data...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--text-muted)"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={str => new Date(str).toLocaleDateString()}
                                    />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                        labelStyle={{ color: 'var(--text-secondary)' }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Codeforces"
                                        stroke="#F44336"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="AtCoder"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Total"
                                        stroke="var(--accent-primary)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Analysis;

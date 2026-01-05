import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid,
    FiAward,
    FiImage,
    FiLogOut,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSave,
    FiX
} from 'react-icons/fi';
import {
    getProjects, getProjectsSync, addProject, updateProject, deleteProject, cleanData,
    getAchievements, getAchievementsSync, addAchievement, updateAchievement, deleteAchievement,
    getHero, getHeroSync, updateHero, logout, convertToBase64, cleanupFirebaseDuplicates,
    getAnalysis, getAnalysisSync, addAnalysis, updateAnalysis, deleteAnalysis
} from '../utils/dataStore';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState(getProjectsSync());
    const [achievements, setAchievements] = useState(getAchievementsSync());
    const [analysis, setAnalysis] = useState(getAnalysisSync());
    const [hero, setHero] = useState(getHeroSync());
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [p, a, an, h] = await Promise.all([
            getProjects(),
            getAchievements(),
            getAnalysis(),
            getHero()
        ]);
        setProjects(p);
        setAchievements(a);
        setAnalysis(an);
        setHero(h);
    };

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 512) { // 512KB limit
                alert('Image too large! Please use an image smaller than 512KB.');
                return;
            }
            const base64 = await convertToBase64(file);
            setFormData(prev => ({ ...prev, image: base64 }));
        }
    };

    // Project handlers
    const handleSaveProject = async () => {
        if (editingItem) {
            const updated = await updateProject(editingItem.id, formData);
            setProjects(prev => prev.map(p => p.id === editingItem.id ? updated : p));
        } else {
            const newProj = await addProject({ ...formData, featured: true });
            setProjects(prev => [...prev, newProj]);
        }
        // await loadData();
        resetForm();
    };

    const handleDeleteProject = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (confirmDelete) {
            try {
                await deleteProject(id);
                // Refresh the projects list immediately using sync getter
                const updatedProjects = getProjectsSync();
                setProjects(updatedProjects);
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project');
            }
        }
    };

    // Achievement handlers
    const handleSaveAchievement = async () => {
        if (editingItem) {
            const updated = await updateAchievement(editingItem.id, formData);
            setAchievements(prev => prev.map(a => a.id === editingItem.id ? updated : a));
        } else {
            const newAch = await addAchievement(formData);
            setAchievements(prev => [...prev, newAch]);
        }
        // await loadData();
        resetForm();
    };

    const handleDeleteAchievement = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this achievement?');
        if (confirmDelete) {
            try {
                await deleteAchievement(id);
                // Refresh the achievements list immediately using sync getter
                const updatedAchievements = getAchievementsSync();
                setAchievements(updatedAchievements);
            } catch (error) {
                console.error('Error deleting achievement:', error);
                alert('Failed to delete achievement');
            }
        }
    };


    const handleSaveAnalysis = async () => {
        // Validation: Check for Title and Value (Job Duration)
        if (!formData.title || !formData.value) {
            alert('Please fill in Title and Job Duration fields.');
            return;
        }

        setLoading(true);
        try {
            if (editingItem) {
                const updatedItem = await updateAnalysis(editingItem.id, formData);
                setAnalysis(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
            } else {
                const newItem = await addAnalysis(formData);
                setAnalysis(prev => [...prev, newItem]);
            }
            // await loadData(); // Don't reload, it causes sync issues
            resetForm();
        } catch (error) {
            console.error('Error saving:', error);
            if (error.code === 'unavailable' || error.message.includes('offline')) {
                alert('Connection failed. Please check your internet or Firebase configuration.');
            } else {
                alert(`Failed to save: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };



    const handleDeleteAnalysis = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this analysis card?');
        if (confirmDelete) {
            try {
                await deleteAnalysis(id);
                // Refresh the analysis list immediately using sync getter
                const updatedAnalysis = getAnalysisSync();
                setAnalysis(updatedAnalysis);
            } catch (error) {
                console.error('Error deleting analysis:', error);
                alert('Failed to delete analysis');
            }
        }
    };

    // Hero handlers
    const handleSaveHero = async () => {
        await updateHero(formData);
        const newHero = await getHero();
        setHero(newHero);
        resetForm();
    };

    const resetForm = () => {
        setEditingItem(null);
        setShowForm(false);
        setFormData({});
    };

    const startEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'projects') {
            setFormData({ ...item, tags: item.tags?.join(', ') || '' });
        } else if (activeTab === 'Jobs') {
            setFormData({ ...item, jobTitle: item.jobTitle || '' });
        } else {
            setFormData({ ...item });
        }
        setShowForm(true);
    };

    const startAdd = () => {
        setEditingItem(null);
        if (activeTab === 'projects') {
            setFormData({ title: '', description: '', tags: '', demoLine: '', githubLink: '', image: '' });
        } else if (activeTab === 'achievements') {
            setFormData({ title: '', description: '', date: '', icon: '' });
        } else if (activeTab === 'Jobs') {
            setFormData({ title: '', jobTitle: '', value: '', image: '', icon: '' });
        } else {
            setFormData({});
        }
        setShowForm(true);
    };

    const tabs = [
        { id: 'projects', label: 'Projects', icon: FiGrid },
        { id: 'achievements', label: 'Achievements', icon: FiAward },
        { id: 'Jobs', label: 'Jobs', icon: FiGrid },
        { id: 'hero', label: 'Hero Settings', icon: FiImage }
    ];

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700
                }}>
                    <span className="gradient-text">Admin Dashboard</span>
                </h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <motion.a
                        href="/"
                        target="_blank"
                        className="btn btn-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View Site
                    </motion.a>
                    <motion.button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiLogOut />
                        Logout
                    </motion.button>
                </div>
            </header>

            {/* Tabs */}
            <div className="admin-tabs">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); resetForm(); }}
                        className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <tab.icon />
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'projects' && (
                    <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {!showForm && (
                            <motion.button
                                onClick={startAdd}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FiPlus />
                                Add New Project
                            </motion.button>
                        )}

                        {showForm && (
                            <motion.div
                                className="admin-form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                                        {editingItem ? 'Edit Project' : 'Add New Project'}
                                    </h3>
                                    <motion.button
                                        onClick={resetForm}
                                        whileHover={{ scale: 1.1 }}
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <FiX size={24} />
                                    </motion.button>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter project name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter project description"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Link</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.link || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ marginBottom: 'var(--spacing-sm)' }}
                                    />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-sm)' }} />
                                    )}
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured || false}
                                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                        />
                                        <span className="form-label" style={{ margin: 0 }}>Featured on homepage</span>
                                    </label>
                                </div>

                                <motion.button
                                    onClick={handleSaveProject}
                                    className="btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FiSave />
                                    {editingItem ? 'Update Project' : 'Save Project'}
                                </motion.button>
                            </motion.div>
                        )}

                        <div className="admin-grid">
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className="admin-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <img src={project.image} alt={project.name} className="admin-card-image" />
                                    <div className="admin-card-content">
                                        <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{project.name}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '8px' }}>
                                            {project.description?.substring(0, 80)}...
                                        </p>
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
                                        <div className="admin-card-actions">
                                            <motion.button
                                                onClick={() => startEdit(project)}
                                                className="btn-edit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiEdit2 style={{ marginRight: '4px' }} />
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="btn-delete"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiTrash2 style={{ marginRight: '4px' }} />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'achievements' && (
                    <motion.div
                        key="achievements"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {!showForm && (
                            <motion.button
                                onClick={startAdd}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FiPlus />
                                Add New Achievement
                            </motion.button>
                        )}

                        {showForm && (
                            <motion.div
                                className="admin-form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                                        {editingItem ? 'Edit Achievement' : 'Add New Achievement'}
                                    </h3>
                                    <motion.button
                                        onClick={resetForm}
                                        whileHover={{ scale: 1.1 }}
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <FiX size={24} />
                                    </motion.button>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Achievement Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter achievement title"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter achievement description"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.icon || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                        placeholder="🏆"
                                        style={{ maxWidth: '100px' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date/Year</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.date || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        placeholder="2024"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ marginBottom: 'var(--spacing-sm)' }}
                                    />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100px', borderRadius: '50%', marginTop: 'var(--spacing-sm)' }} />
                                    )}
                                </div>

                                <motion.button
                                    onClick={handleSaveAchievement}
                                    className="btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FiSave />
                                    {editingItem ? 'Update Achievement' : 'Save Achievement'}
                                </motion.button>
                            </motion.div>
                        )}

                        <div className="admin-grid">
                            {achievements.map((achievement) => (
                                <motion.div
                                    key={achievement.id}
                                    className="admin-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="admin-card-content">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                            <span style={{ fontSize: '2rem' }}>{achievement.icon || '✨'}</span>
                                            <div>
                                                <h4 style={{ fontWeight: 600 }}>{achievement.title}</h4>
                                                {achievement.date && (
                                                    <span style={{ color: 'var(--accent-primary)', fontSize: 'var(--text-sm)' }}>{achievement.date}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                            {achievement.description?.substring(0, 100)}...
                                        </p>
                                        <div className="admin-card-actions">
                                            <motion.button
                                                onClick={() => startEdit(achievement)}
                                                className="btn-edit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiEdit2 style={{ marginRight: '4px' }} />
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeleteAchievement(achievement.id)}
                                                className="btn-delete"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiTrash2 style={{ marginRight: '4px' }} />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'Jobs' && (
                    <motion.div
                        key="jobs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {!showForm && (
                            <motion.button
                                onClick={startAdd}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FiPlus />
                                Add New Job Card
                            </motion.button>
                        )}

                        {showForm && (
                            <motion.div
                                className="admin-form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                                        {editingItem ? 'Edit Job Card' : 'Add New Job Card'}
                                    </h3>
                                    <motion.button
                                        onClick={resetForm}
                                        whileHover={{ scale: 1.1 }}
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <FiX size={24} />
                                    </motion.button>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Company Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g. Google"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Role / Job Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.jobTitle || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                                        placeholder="e.g. Senior Software Engineer"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Job Duration *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.value || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                        placeholder="e.g. 2023 - Present"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Company Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ marginBottom: 'var(--spacing-sm)' }}
                                    />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100px', borderRadius: '50%', marginTop: 'var(--spacing-sm)' }} />
                                    )}
                                </div>

                                <motion.button
                                    onClick={handleSaveAnalysis}
                                    className="btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                                >
                                    <FiSave />
                                    {loading ? 'Saving...' : (editingItem ? 'Update Card' : 'Save Card')}
                                </motion.button>
                            </motion.div>
                        )}

                        <div className="admin-grid">
                            {analysis.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="admin-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="admin-card-content">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '2rem' }}>{item.icon || '📊'}</span>
                                            )}
                                            <div>
                                                <h4 style={{ fontWeight: 600 }}>{item.title}</h4>
                                                <span style={{ color: 'var(--accent-primary)', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{item.value}</span>
                                            </div>
                                        </div>

                                        <div className="admin-card-actions">
                                            <motion.button
                                                onClick={() => startEdit(item)}
                                                className="btn-edit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiEdit2 style={{ marginRight: '4px' }} />
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeleteAnalysis(item.id)}
                                                className="btn-delete"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiTrash2 style={{ marginRight: '4px' }} />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'hero' && (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <motion.div
                            className="admin-form"
                            style={{ maxWidth: '600px' }}
                        >
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>
                                Hero Section Settings
                            </h3>

                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name ?? hero.name ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tagline</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.tagline ?? hero.tagline ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                    placeholder="e.g., Full Stack Developer"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description ?? hero.description ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter a brief description about yourself"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ marginBottom: 'var(--spacing-sm)' }}
                                />
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginTop: 'var(--spacing-sm)' }}>
                                    {(formData.image || hero.image) && (
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '8px' }}>
                                                {formData.image ? 'New Image:' : 'Current Image:'}
                                            </p>
                                            <img
                                                src={formData.image || hero.image}
                                                alt="Profile Preview"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '3px solid var(--accent-primary)'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                onClick={handleSaveHero}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FiSave />
                                Save Hero Settings
                            </motion.button>


                            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)', color: 'var(--text-danger)' }}>
                                    Danger Zone
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-md)' }}>
                                    If you see duplicate items or data issues, try running the cleanup tool. This will remove duplicate entries from the database.
                                </p>
                                <motion.button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure? This will permanently delete duplicate entries.')) {
                                            try {
                                                const result = await cleanupFirebaseDuplicates();
                                                alert(`Cleanup complete!\nRemoved ${result.projects} duplicate projects, ${result.achievements} duplicate achievements and analysis duplicates.`);
                                                await loadData();
                                            } catch (error) {
                                                alert('Cleanup failed. Check console for details.');
                                                console.error(error);
                                            }
                                        }
                                    }}
                                    className="btn"
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiTrash2 />
                                    Cleanup Duplicates
                                </motion.button>
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminDashboard;

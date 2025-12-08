
import { motion } from 'framer-motion';
import { therapies } from '../data/therapies';
import { ArrowRight, Calendar, Bell, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&q=80&w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '800px' }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)', color: '#f9f7f2' }}>
                        Discover the Power of Ayurveda
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.6, opacity: 0.9 }}>
                        Reconnect with nature, rejuvenate your energies, and experience holistic healing rooted in 5,000+ years of trusted knowledge.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/portal" className="btn-primary" style={{ textDecoration: 'none', background: 'var(--color-secondary)', color: 'var(--color-text-main)' }}>
                            Book Consultation
                        </Link>
                        <a href="#therapies" style={{
                            padding: '0.75rem 1.5rem',
                            border: '2px solid white',
                            borderRadius: '8px',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}>
                            Explore Therapies
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '3rem' }}>Why Choose Ayursutra?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: Calendar, title: 'Smart Scheduling', desc: 'Seamlessly book and manage your therapy sessions online with automated reminders.' },
                        { icon: Bell, title: 'Precautions Alerts', desc: 'Receive timely notifications for pre- and post-procedure care to ensure best results.' },
                        { icon: Activity, title: 'Real-Time Tracking', desc: 'Monitor your progress and recovery milestones with our integrated digital tracker.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="premium-card"
                            style={{ padding: '2rem', textAlign: 'center' }}
                        >
                            <div style={{ background: 'var(--color-cream)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <feature.icon color="var(--color-primary)" size={28} />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6 }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Therapies List */}
            <section id="therapies" style={{ padding: '4rem 2rem', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Our Therapies</h2>
                    <p style={{ marginBottom: '3rem', color: 'var(--color-text-light)', maxWidth: '600px' }}>Comprehensive Panchakarma treatments tailored to your unique constitution.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {therapies.map((therapy) => (
                            <motion.div
                                key={therapy.id}
                                whileHover={{ scale: 1.02 }}
                                className="premium-card"
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img src={therapy.imageUrl} alt={therapy.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{therapy.sanskritName}</h3>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', fontWeight: 600 }}>{therapy.duration.split(' ')[0]} Mins</span>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#666', marginBottom: '1rem' }}>{therapy.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                        {therapy.description}
                                    </p>
                                    <Link to={`/therapy/${therapy.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Learn More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

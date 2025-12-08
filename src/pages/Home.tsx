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
                height: '92vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(44, 62, 45, 0.4), rgba(44, 62, 45, 0.2)), url(https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&q=80&w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // Parallax effect
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ maxWidth: '900px' }}
                >
                    <span className="animate-fade-in" style={{
                        display: 'inline-block',
                        marginBottom: '1rem',
                        padding: '0.5rem 1.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 500
                    }}>
                        Ancient Wisdom, Modern Care
                    </span>
                    <h1 style={{
                        fontSize: '4.5rem',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                        Discover the Power of <br /> <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Ayurveda</span>
                    </h1>
                    <p style={{ fontSize: '1.35rem', marginBottom: '3rem', lineHeight: 1.6, opacity: 0.95, maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                        Reconnect with nature, rejuvenate your energies, and experience holistic healing rooted in 5,000+ years of trusted knowledge.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/portal" className="btn-primary hover-lift" style={{
                            textDecoration: 'none',
                            background: 'white',
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem'
                        }}>
                            Book Consultation
                        </Link>
                        <a href="#therapies" className="hover-lift" style={{
                            padding: '1rem 2.5rem',
                            border: '1px solid rgba(255,255,255,0.6)',
                            borderRadius: '8px',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '1.1rem',
                            backdropFilter: 'blur(5px)'
                        }}>
                            Explore Therapies
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Ayursutra?</h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>We combine traditional Vedic sciences with modern technology for a seamless healing journey.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {[
                        { icon: Calendar, title: 'Smart Scheduling', desc: 'Seamlessly book and manage your therapy sessions online with automated reminders.' },
                        { icon: Bell, title: 'Precautions Alerts', desc: 'Receive timely notifications for pre- and post-procedure care to ensure best results.' },
                        { icon: Activity, title: 'Real-Time Tracking', desc: 'Monitor your progress and recovery milestones with our integrated digital tracker.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="premium-card hover-lift"
                            style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: '4px solid var(--color-primary)' }}
                        >
                            <div style={{ background: 'var(--color-cream)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <feature.icon color="var(--color-primary)" size={32} />
                            </div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, fontSize: '1rem' }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Therapies List */}
            <section id="therapies" style={{ padding: '6rem 2rem', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Our Therapies</h2>
                            <p style={{ color: 'var(--color-text-light)', maxWidth: '500px' }}>Comprehensive Panchakarma treatments tailored to your unique constitution.</p>
                        </div>
                        <Link to="/portal" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                        {therapies.map((therapy) => (
                            <motion.div
                                key={therapy.id}
                                whileHover={{ y: -5 }}
                                className="premium-card hover-lift"
                                style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }}></div>
                                    <img src={therapy.imageUrl} alt={therapy.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                                    <span style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, zIndex: 2 }}>
                                        {therapy.duration.split(' ')[0]} Mins
                                    </span>
                                </div>
                                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)', fontSize: '1.5rem' }}>{therapy.sanskritName}</h3>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#888', marginBottom: '1rem', marginTop: 0 }}>{therapy.name}</h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                                        {therapy.description}
                                    </p>
                                    <Link to={`/portal`} className="hover-lift" style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        textAlign: 'center',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: '6px',
                                        color: 'var(--color-primary)',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        background: 'transparent',
                                        display: 'block'
                                    }}>
                                        Book Now
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

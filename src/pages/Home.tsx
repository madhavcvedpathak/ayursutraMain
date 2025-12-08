import { motion } from 'framer-motion';
import { therapies } from '../data/therapies';
import { ArrowRight, Calendar, Bell, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="landing-shell">
            {/* Hero Section */}
            <motion.section
                className="landing-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-2xl">
                    <span className="eyebrow">Ayursutra Health</span>
                    <h1>Discover the Power of <span className="italic text-brand-teal">Ayurveda</span></h1>
                    <p className="lede mt-4">
                        Reconnect with nature, rejuvenate your energies, and experience holistic healing rooted in 5,000+ years of trusted knowledge.
                    </p>
                    <div className="cta-row">
                        <Link to="/portal" className="btn primary">
                            Book Consultation
                        </Link>
                        <a href="#therapies" className="btn outline">
                            Explore Therapies
                        </a>
                    </div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <section className="px-4 md:px-0">
                <div className="mb-8 text-center">
                    <span className="eyebrow">Our Promise</span>
                    <h2 className="text-3xl font-semibold">Why Choose Ayursutra?</h2>
                </div>

                <div className="landing-grid">
                    {[
                        { icon: Calendar, title: 'Smart Scheduling', desc: 'Seamlessly book and manage your therapy sessions online with automated reminders.' },
                        { icon: Bell, title: 'Precautions Alerts', desc: 'Receive timely notifications for pre- and post-procedure care to ensure best results.' },
                        { icon: Activity, title: 'Real-Time Tracking', desc: 'Monitor your progress and recovery milestones with our integrated digital tracker.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="landing-card"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage text-brand-ocean">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                            <p className="text-brand-muted">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Therapies List */}
            <section id="therapies" className="px-4 md:px-0">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <span className="eyebrow">Treatments</span>
                        <h2 className="text-3xl font-semibold text-brand-deep">Our Therapies</h2>
                    </div>
                    <Link to="/therapies" className="btn small outline">
                        View All <ArrowRight size={16} className="ml-2" />
                    </Link>
                </div>

                <div className="landing-grid">
                    {therapies.map((therapy) => (
                        <motion.div
                            key={therapy.id}
                            whileHover={{ y: -4 }}
                            className="landing-card group p-0 overflow-hidden"
                            style={{ padding: 0 }}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img src={therapy.imageUrl} alt={therapy.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                    {therapy.duration.split(' ')[0]} Mins
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="mb-1 text-xl font-semibold text-brand-deep">{therapy.sanskritName}</h3>
                                <h4 className="mb-3 text-sm text-brand-muted">{therapy.name}</h4>
                                <p className="mb-4 text-sm text-brand-deep/80 line-clamp-3">
                                    {therapy.description}
                                </p>
                                <Link to={`/portal`} className="btn ghost w-full text-xs">
                                    Book Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

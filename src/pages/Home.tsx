import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { therapies } from '../data/therapies';
import { ArrowRight, Calendar, Bell, Activity } from 'lucide-react';

export const Home = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    return (
        <div className="landing-shell">
            {/* Hero Section */}
            <motion.section
                className="landing-hero relative overflow-hidden text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop"
                        alt="Ayurveda Banner"
                        className="h-full w-full object-cover opacity-90 brightness-50"
                    />
                </div>

                <div className="max-w-2xl relative z-10 p-4">
                    <span className="eyebrow text-white/80">Ayursutra Health</span>
                    <h1 className="text-white">Discover the Power of <span className="italic text-brand-teal text-white">Ayurveda</span></h1>
                    <p className="lede mt-4 text-white/90">
                        Reconnect with nature, rejuvenate your energies, and experience holistic healing rooted in 5,000+ years of trusted knowledge.
                    </p>
                    <div className="cta-row mt-6">
                        <Link to="/portal" className="btn bg-brand-teal text-white border-none hover:bg-brand-ocean">
                            Book Consultation
                        </Link>
                        <a href="#therapies" className="btn outline border-white text-white hover:bg-white hover:text-brand-deep">
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
                    {therapies.map((therapy, i) => (
                        <motion.div
                            key={therapy.id}
                            whileHover={{ y: -4 }}
                            className="landing-card group p-0 overflow-hidden"
                            style={{ padding: 0 }}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={
                                        // HD+ Unsplash Images for each therapy index
                                        i === 0 ? "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" : // Vamana (Massage/Spa)
                                            i === 1 ? "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop" : // Virechana (Relax)
                                                i === 2 ? "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1000&auto=format&fit=crop" : // Basti (Nature/Leaf)
                                                    i === 3 ? "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop" : // Nasya (Oil/Face)
                                                        i === 4 ? "https://images.unsplash.com/photo-1579126038374-6064e9370f0f?q=80&w=1000&auto=format&fit=crop" : // Raktamokshana (Herbal/Bowls)
                                                            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop"         // Vamana Karma (Zen/Meditation)
                                    }
                                    alt={therapy.name}
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                />
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

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ThemeProvider } from '../context/ThemeContext';
import Header from '@/Components/Partials/Header'; 
import Footer from '@/Components/Partials/Footer'; 
import '../../scss/Home.scss';

// Enhanced Feature Card
const FeatureCard = ({ title, description, youtubeLink, index }) => (
  <motion.article
    className={`feature ${index % 2 === 0 ? 'feature-left' : 'feature-right'}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    <div className="feature-description" id="#features">
      <h2>{title}</h2>
      {description}
    </div>
    <motion.div 
      className="feature-tutorial"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {youtubeLink ? (
        <iframe
          src={youtubeLink}
          title={`${title} Tutorial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="video-placeholder">
          <p>Coming Soon</p>
        </div>
      )}
    </motion.div>
  </motion.article>
);

const Home = () => {
  const features = [
    {
      title: 'Progressive Mode',
      description: (
        <p>
          Start your coding journey with beginner-friendly challenges and gradually advance.
          TechnoClash provides a structured path where each challenge builds upon the last.
        </p>
      ),
      youtubeLink: null,
    },
    {
      title: 'Ranked Mode',
      description: (
        <>
          <p>Battle it out in competitive matches to test your speed and skill.</p>
          <ul>
            <li><strong>Battle Royale (Solo)</strong> – Last one standing wins.</li>
            <li><strong>Blitz Mode</strong> – Solve under strict time pressure.</li>
            <li><strong>Skill-based Matchmaking</strong> – Fair and competitive.</li>
          </ul>
        </>
      ),
      youtubeLink: null,
    },
    {
      title: 'Contests & Events',
      description: (
        <>
          <p>
            Join exclusive coding contests hosted by TechnoClash or partners to win prizes and boost your portfolio.
          </p>
          <ul>
            <li><strong>Weekly & Monthly Contests</strong></li>
            <li><strong>Real-world Sponsorship Challenges</strong></li>
          </ul>
        </>
      ),
      youtubeLink: null,
    },
  ];

  return (
    <ThemeProvider>
      <div className="home">
        <Header />

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Train like a Warrior.
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Compete like a <span>Champion.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Improve your skills, climb the ranks, and challenge the best!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Link href="/login" className="hero-cta">
                Start Playing!
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="explore" className="features">
          <motion.h2
            className="features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Unleash your coding potential with our <br /> game modes and <span>challenges!</span>
          </motion.h2>
          <div className="features-content">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section id="leaderboard" className="leaderboard">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Track Your Progress in <span>Real Time!</span>
          </motion.h2>
          <motion.div
            className="leaderboard-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="leaderboard-placeholder">
              <div className="coming-soon">COMING SOON</div>
              <div className="leaderboard-mock">
                <div className="rank-item"></div>
                <div className="rank-item"></div>
                <div className="rank-item"></div>
                <div className="rank-item"></div>
                <div className="rank-item"></div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default Home;

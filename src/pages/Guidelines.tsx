import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Palette, Sparkles } from 'lucide-react';

const Guidelines = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const rules = [
    {
      id: 1,
      title: "Icons Over Emojis",
      description: "Never use emojis. Use icons from lucide-react for consistent and professional visual elements.",
      icon: BookOpen,
      example: "Use <Heart /> instead of ❤️"
    },
    {
      id: 2,
      title: "Modern Pastel Palette",
      description: "Use a modern, pastel colour palette when constructing the site to maintain a soft, contemporary aesthetic.",
      icon: Palette,
      example: "Soft lavenders, mint greens, peachy pinks, and gentle blues"
    },
    {
      id: 3,
      title: "Framer Motion Integration",
      description: "Use framer motion when developing the site to create smooth, engaging animations and transitions.",
      icon: Sparkles,
      example: "Implement page transitions, hover effects, and loading animations"
    }
  ];

  return (
    <div className="guidelines-container">
      <motion.div
        className="guidelines-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header className="guidelines-header" variants={itemVariants}>
          <h1>Design Guidelines</h1>
          <p>Essential rules for maintaining consistency and quality across the project</p>
        </motion.header>

        <motion.div className="rules-grid" variants={itemVariants}>
          {rules.map((rule) => {
            const IconComponent = rule.icon;
            return (
              <motion.div
                key={rule.id}
                className="rule-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="rule-header">
                  <div className="rule-icon">
                    <IconComponent size={24} />
                  </div>
                  <h2>Rule {rule.id}</h2>
                </div>
                <h3>{rule.title}</h3>
                <p className="rule-description">{rule.description}</p>
                <div className="rule-example">
                  <span className="example-label">Example:</span>
                  <span className="example-text">{rule.example}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.footer className="guidelines-footer" variants={itemVariants}>
          <p>These guidelines ensure our project maintains a cohesive, modern, and professional appearance.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Guidelines;

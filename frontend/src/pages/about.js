import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTitleHovered, setIsTitleHovered] = useState(false);

    return (
        <div style={styles.container}>
            <Navbar />

            <div 
                style={isHovered ? { ...styles.aboutContainer, ...styles.hover } : styles.aboutContainer}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <h1 
                    style={isTitleHovered ? { ...styles.title, ...styles.titleHover } : styles.title}
                    onMouseEnter={() => setIsTitleHovered(true)}
                    onMouseLeave={() => setIsTitleHovered(false)}
                >
                    About Us
                </h1>
                <p style={styles.text}>
                    Welcome to our dietary analysis and nutrient deficiency detection application! Our mission is to promote healthy eating habits, especially among children and adolescents.
                </p>
                <p style={styles.text}>
                    At our core, we believe that nutrition is a fundamental aspect of overall health and well-being. Growing bodies require a balanced diet rich in essential nutrients to support development, boost immunity, and maintain energy levels. Our team of nutritionists and health experts has developed a comprehensive tool to help families assess their dietary habits and identify potential nutrient deficits.
                </p>
                <p style={styles.text}>
                    Our application provides personalized dietary recommendations based on individual dietary patterns and nutritional needs. Whether it’s increasing iron intake, ensuring adequate calcium levels, or incorporating more fruits and vegetables, our goal is to empower families with actionable insights to improve their nutrition.
                </p>
                <p style={styles.text}>
                    We utilize the latest research in nutrition science to guide our recommendations, ensuring that our users receive evidence-based advice tailored to their specific needs. Our user-friendly interface makes it easy for families to track their food intake and understand their nutritional status.
                </p>
                <p style={styles.text}>
                    Join us on this journey toward better health and nutrition! Together, we can build healthier communities and ensure that every child has the opportunity to thrive.
                </p>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fff',
    },
    aboutContainer: {
        padding: '40px 20px',
        textAlign: 'left',
        maxWidth: '1000px',
        margin: '20px auto',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    hover: {
        boxShadow: '0 4px 20px rgba(0, 186, 255, 0.5)', // Shadow on hover
        transform: 'scale(1.02)', // Slightly scale on hover
    },
    title: {
        color: '#333',
        fontSize: '2.5rem',
        marginBottom: '20px',
        transition: 'text-shadow 0.3s, transform 0.3s', // Transition for the title
    },
    titleHover: {
        textShadow: '0 4px 10px rgba(0, 186, 255, 0.5)', // Shadow effect on title hover
        transform: 'scale(1.02)', // Scale effect on title hover
    },
    text: {
        color: '#555',
        lineHeight: 1.8,
        margin: '10px 0',
        fontSize: '1.1rem',
    },
    navbar: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
};

export default AboutUs;

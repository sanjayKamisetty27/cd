import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList, faAppleAlt, faDumbbell, faHeartbeat, faChartLine, faCog, faClock } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Carousel from 'react-bootstrap/Carousel'; // Import Carousel component from Bootstrap
import img1 from '../images/track2.jpg';
import img2 from '../images/eat healthy.png';
import img3 from '../images/stayfit.jpg';
import img4 from '../images/healthy.png';

export default function Home() {
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <div>
      {/* Set overflow for the body */}
      <style>
        {`
          body {
            overflow-x: hidden; /* Prevent horizontal scroll */
          }
          h1, h2 {
            transition: all 0.3s ease-in-out;
          }
          h1:hover, h2:hover {
            text-shadow: 0 4px 10px rgba(0, 186, 255, 0.5);
            transform: scale(1.05);
          }
          .feature-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background-color: #fff;
            text-align: center;
          }
          .feature-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 191, 255, 0.7); /* Changed shadow color to sky blue */
          }
          .feature-icon {
            transition: transform 0.3s ease-in-out;
          }
          .feature-icon:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* Navbar */}
      <Navbar />

      {/* Circles on the left bottom corner */}
      <div style={{ position: 'absolute', bottom: '0', left: '0', zIndex: '-1',top:'-50px' }}>
        {/* First Circle (Left) */}
        <div style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'skyblue',
          borderRadius: '50%',
          position: 'absolute',
          left: '-150px', // Half of the width to position it partially outside the page
          bottom: '50px',
          zIndex: '-1',
        }} />
        {/* Second Circle (Left) */}
        <div style={{
          width: '400px',
          height: '400px',
          backgroundColor: 'skyblue',
          borderRadius: '50%',
          position: 'absolute',
          left: '-200px', // Slightly larger and more to the left
          top:'100px',
          bottom: '250px',
          zIndex: '-1',
        }} />
      </div>

      {/* Circles on the right bottom corner */}
      <div style={{ position: 'absolute', bottom: '0', right: '0', zIndex: '-1',top: '0' }}>
        {/* First Circle (Right) */}
        <div style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'skyblue',
          right: '-150px',
          borderRadius: '50%',
          position: 'absolute',
          bottom: '50px',
          zIndex: '-1',
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
        }} />
        {/* Second Circle (Right) */}
        <div style={{
          width: '400px',
          height: '400px',
          backgroundColor: 'skyblue',
          borderRadius: '50%',
          position: 'absolute',
          bottom: '250px',
          right: '-200px',
          top:'60px',
          zIndex: '-1',
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
        }} />
      </div>

      {/* Main Content with Carousel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between', /* Align text and carousel side by side */
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 100px)',
        paddingBottom: '10px',
        paddingLeft: '50px',
        color: '#000',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ marginLeft: '-50px', flex: '1' }}>
          <h1 style={{ fontWeight: 'bold', fontSize: '3rem', margin: '150px 0 20px', color: '#000' }}>
            Eat smarter.
          </h1>
          <h1 style={{ fontWeight: 'bold', fontSize: '3rem', margin: '20px 0 30px', color: '#000' }}>
            Live better.
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '40px', color: '#000' }}>
            Track your diet, exercise, and health data.
          </p>

          {/* Sign Up Button */}
          <button
            onClick={redirectToSignup}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              backgroundColor: '#00bfff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '50px',
              marginLeft: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#008fbf')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00bfff')}
          >
            SIGN UP – It’s Free
          </button>
        </div>

{/* Centered and Enlarged Carousel */}
<div style={{ flex: '1', textAlign: 'center', marginLeft: '50px', marginTop: '100px' }}>
  <style>
    {`
      .carousel-container {
        max-width: 800px; /* Increased max width for the carousel */
        margin: 0 auto;
        border-radius: 15px; /* Rounded corners for the carousel */
        overflow: hidden; /* Ensures that the images don't overflow */
        box-shadow: 0 7px 50px rgba(0, 191, 255, 0.8); /* Add box shadow */
        transition: transform 0.3s; /* Transition for the entire carousel */
      }

      .carousel-container:hover {
        transform: scale(1.05); /* Enlarge the carousel on hover */
      }

      .carousel-container img {
        border-radius: 0; /* No border radius for images */
        transition: transform 0.3s; /* Optional: smooth image scaling */
        height: 450px; /* Increased height for images */
      }
    `}
  </style>

          <div className="carousel-container"> {/* Added wrapper for styling */}
            <Carousel indicators={true} controls={false} interval={1000} className="custom-carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img1}
                  alt="First slide"
                  style={{ objectFit: 'cover', height: '450px', width:'550px' }}
                />
                <Carousel.Caption>
                  <h3>Track Your Health</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img2}
                  alt="Second slide"
                  style={{ objectFit: 'cover', height: '450px', width:'550px' }}
                  
                />
                <Carousel.Caption>
                  <h3>Eat Healthy</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img3}
                  alt="Third slide"
                  style={{ objectFit: 'cover', height: '450px', width:'550px' }}
                />
                <Carousel.Caption>
                  <h3>Stay Fit</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
        </div>

      {/* Grid Section for Health Features */}
      <div style={{ padding: '40px 50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#00bfff', marginBottom: '40px', textAlign: 'center' }}>Develop healthy habits</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
        }}>
          {/* Feature 1 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faClipboardList} className="feature-icon" style={{ color: '#00bfff', height: '100px', width: '100px' }} />
            <h3 style={{ color: '#00bfff' }}>Track up to 84 nutrients</h3>
            <p>Log your meals and track all your macro and micronutrients.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div>
              <FontAwesomeIcon icon={faAppleAlt} className="feature-icon" style={{ color: '#00bfff', height: '60px', marginRight: '10px' }} />
              <FontAwesomeIcon icon={faDumbbell} className="feature-icon" style={{ color: '#00bfff', height: '60px', marginRight: '10px' }} />
              <FontAwesomeIcon icon={faHeartbeat} className="feature-icon" style={{ color: '#00bfff', height: '60px' }} />
            </div>
            <h3 style={{ color: '#00bfff' }}>Log meals, exercise and health data</h3>
            <p>Track your food, exercise, blood pressure, blood sugar, and cholesterol.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" style={{ color: '#00bfff', height: '100px', width: '100px' }} />
            <h3 style={{ color: '#00bfff' }}>Create custom reports</h3>
            <p>Analyze your nutrition and health trends with our advanced reports.</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faCog} className="feature-icon" style={{ color: '#00bfff', height: '100px', width: '100px' }} />
            <h3 style={{ color: '#00bfff' }}>Customize your experience</h3>
            <p>Set your goals and track your progress.</p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faClock} className="feature-icon" style={{ color: '#00bfff', height: '100px', width: '100px' }} />
            <h3 style={{ color: '#00bfff' }}>Daily reminders</h3>
            <p>Get daily reminders to stay on track.</p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faSeedling} className="feature-icon" style={{ color: '#00bfff', height: '100px', width: '100px' }} />
            <h3 style={{ color: '#00bfff' }}>Nutrient suggestions</h3>
            <p>Receive personalized suggestions for your diet.</p>
          </div>
        </div>
      </div>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        {/* Increased marginTop */}
        <h2 style={{ fontSize: '2.5rem', color: '#00bfff', marginBottom: '20px' }}>Discover your nutrition</h2>
        <p style={{ fontSize: '1.5rem', color: '#000', maxWidth: '700px', margin: 'auto', lineHeight: '1.8', marginBottom: '70px' }}>
          Protein Pro encourages you to not just count your calories but to focus on your nutrition as a whole.
        </p>
        </div>
        {/* New section for checkmarks and image on the right side */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', // Space between image and checkmarks
          alignItems: 'flex-start', // Align items at the top
          height: '100vh', // Set the height to 100vh to fill the viewport
          padding: '0 50px', // Add padding to both sides
          backgroundColor: 'white', // Optional: Add background color for contrast
        }}>
          
          <div style={{
          flex: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '500px', // Increased width
            height: '600px', // Keep height as needed
            overflow: 'hidden',
            borderRadius: '150px 150px 0 0', // Rounded top corners
            boxShadow: '0 7px 50px rgba(0, 191, 255, 0.8)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition effect
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'; // Enlarge on hover
          }} 
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'; // Reset size on leave
          }} 
          >
            <img 
              src={img4} 
              alt="Nutrition visualization" 
              style={{
                width: '100%', // Maintain full width of the container
                height: '100%',
                objectFit: 'cover', // Cover to maintain aspect ratio
                borderRadius: '150px 150px 0 0', // Rounded top corners
              }} 
            />
          </div>
        </div>
        {/* Right Side Checkmarks */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column', // Stack checkmarks vertically
          justifyContent: 'center', // Center vertically within the column
          alignItems: 'flex-start', // Align items to the left
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '70px' , marginTop: '70px' }}>
            {/* Checkmark with background */}
            <div style={{
              width: '60px',
              height: '40px',
              backgroundColor: 'skyblue',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
            }}>
              <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            {/* Text for the first checkmark */}
            <div>
              <h4 style={{ color: '#00bfff', margin: '0' }}>Accurate nutrition data</h4>
              <p style={{ fontSize: '1.5rem', color: '#000', lineHeight: '1.6' }}>
                Be confident that the food you log has the correct nutrition data. We verify every food submission for accuracy.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '70px' }}>
            {/* Checkmark with background */}
            <div style={{
              width: '60px',
              height: '40px',
              backgroundColor: 'skyblue',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
            }}>
              <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            {/* Text for the second checkmark */}
            <div>
              <h4 style={{ color: '#00bfff', margin: '0' }}>Data privacy & security</h4>
              <p style={{ fontSize: '1.5rem', color: '#000', lineHeight: '1.6' }}>
                We don't sell your account data to third parties and take the security of our users' accounts seriously.
              </p>
            </div>
          </div>

          {/* New checkmark for User-friendly interface */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {/* Checkmark with background */}
            <div style={{
              width: '60px',
              height: '40px',
              backgroundColor: 'skyblue',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
            }}>
              <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            {/* Text for the third checkmark */}
            <div>
              <h4 style={{ color: '#00bfff', margin: '0' }}>User-friendly interface</h4>
              <p style={{ fontSize: '1.5rem', color: '#000', lineHeight: '1.6' }}>
                Our intuitive design makes it easy to track your nutrition and reach your goals with minimal effort.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

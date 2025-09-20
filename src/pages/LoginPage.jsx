// src/pages/LandingPage.jsx
import React from 'react';
import '../style/landing.css'; // Correct CSS import

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <h1 style={{ color: '#d15d86', textAlign: 'center' }}>Mithai Magic</h1>

        <div className="bento-grid">
          {/* Left Column */}
          <div>
            <div className="card master-card">
              <h2 className="card-title">Master the art of Bento Cakes in London</h2>
              <div className="content-box">
                <p>Placeholder for introductory text.</p>
              </div>

              <h3 className="sue-ellen-francisc">Meet your sweet mentors</h3>
              <div className="mentors-grid">
                <div className="mentor-profile">
                  <img src="https://placehold.co/80x80/d15d86/white?text=Mentor1" alt="Mentor 1" />
                  <p>Mentor Name</p>
                </div>
                <div className="mentor-profile">
                  <img src="https://placehold.co/80x80/d15d86/white?text=Mentor2" alt="Mentor 2" />
                  <p>Mentor Name</p>
                </div>
              </div>
            </div>

            <div className="card workshop-agenda" style={{ marginTop: '20px' }}>
              <h2 className="sue-ellen-francisc">Culinary workshop agenda</h2>
              <ul className="agenda-list">
                <li>Placeholder for agenda item 1</li>
                <li>Placeholder for agenda item 2</li>
                <li>Placeholder for agenda item 3</li>
              </ul>
            </div>

            <div className="card deal-card" style={{ marginTop: '20px' }}>
              <h2 className="card-title">Delicious deal</h2>
              <div className="deal-content">
                <span className="price">50€</span>
                <button className="button">Book now</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="card">
              <h2 className="card-title">What we have done together</h2>
              <div className="achievements-grid">
                <div className="achievement-box"></div>
                <div className="achievement-box"></div>
                <div className="achievement-box"></div>
                <div className="achievement-box"></div>
                <div className="achievement-box"></div>
                <div className="achievement-box"></div>
              </div>
            </div>

            <div className="card testimonials" style={{ marginTop: '20px' }}>
              <h2 className="card-title">Happy Bakers</h2>
              <div className="testimonial-card">
                <p>"Placeholder testimonial text."</p>
                <p style={{ textAlign: 'right', fontWeight: 'bold', color: '#d15d86' }}>- User Name</p>
              </div>
              <div className="testimonial-card">
                <p>"Another placeholder testimonial."</p>
                <p style={{ textAlign: 'right', fontWeight: 'bold', color: '#d15d86' }}>- Another User</p>
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h2 className="card-title">Join the cake crew</h2>
              <div className="cake-crew">
                <button className="button">Join</button>
                <div className="social-icons">
                  <div className="social-icon"></div>
                  <div className="social-icon"></div>
                  <div className="social-icon"></div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h2 className="card-title">Frequently baked questions</h2>
              <ul className="faq-list">
                <li className="faq-item">Question 1?</li>
                <li className="faq-item">Question 2?</li>
                <li className="faq-item">Question 3?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

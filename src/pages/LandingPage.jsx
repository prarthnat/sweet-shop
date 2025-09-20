// src/pages/LandingPage.jsx
import React from 'react';
import '../style/LandingPage.css'; // Ensure your CSS includes Bokor/Quicksand fonts

const LandingPage = () => {
  return (
    <div className="container bokor-regular">
      <h1 style={{ color: '#d15d86', textAlign: 'center' }}>Mithai Magic</h1>

      <div className="bento-grid">
        {/* Left Column */}
        <div>
          <div className="card master-card">
            <h2 className="card-title">Master the art of Bento Cakes</h2>
            <div className="content-box">
              <p>
                Indulge in a delightful selection of sweets, from classic favorites like Gulab Jamun
                and Rasmalai to modern treats like Cupcakes and Cheesecakes. Browse our collection,
                filter by availability, and make your purchase with ease.
              </p>
            </div>
            <h3 className="card-subtitle">Meet your sweet mentors</h3>
            <div className="mentors-grid">
              <div className="mentor-profile">
                <img
                  src="/screenshots/prarthna.jpeg"
                  alt="Mentor 1"
                />
                <p>Prarthna Tiwari</p>
              </div>
              <div className="mentor-profile">
                <img
                  src="/screenshots/sarthak.jpeg"
                  alt="Mentor 2"
                />
                <p>Sarthak Tiwari</p>
              </div>
            </div>
          </div>

          <div className="card workshop-agenda" style={{ marginTop: '20px' }}>
            <h2 className="card-title">Culinary Workshop Agenda</h2>
            <ul className="agenda-list">
              <li>Introduction & Welcome</li>
              <li>Hands-on Cooking Session</li>
              <li>Tasting & Feedback</li>
              <li>Q&A and Closing Remarks</li>
            </ul>
          </div>

          <div className="card deal-card" style={{ marginTop: '20px' }}>
            <h2 className="card-title">Delicious Deal</h2>
            <div className="deal-content">
              <span className="price">50€</span>
              <button className="button">Book Now</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="card">
            <h2 className="card-title">What We Have Done Together</h2>
            <div className="achievements-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="achievement-box"></div>
              ))}
            </div>
          </div>

          <div className="card testimonials" style={{ marginTop: '20px' }}>
            <h2 className="card-title">Happy Bakers</h2>
            <div className="testimonial-card">
              <p>
                "The cupcakes from Happy Bakers are absolutely delightful! Every bite is a burst of flavor."
              </p>
              <p style={{ textAlign: 'right', fontWeight: 'bold', color: '#d15d86' }}>
                - Anvita Mishra
              </p>
            </div>
            <div className="testimonial-card">
              <p>
                "Amazing desserts with fantastic presentation! Truly a sweet experience."
              </p>
              <p style={{ textAlign: 'right', fontWeight: 'bold', color: '#d15d86' }}>
                - Sampada Naik
              </p>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <h2 className="card-title">Join the Cake Crew</h2>
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
            <h2 className="card-title">Frequently Baked Questions</h2>
            <ul className="faq-list">
              <li className="faq-item"><strong>Do you take custom cake orders?</strong></li>
              <li className="faq-item">Yes! We love creating personalized cakes for birthdays, weddings, and special occasions.</li>
              <li className="faq-item"><strong>Are your sweets freshly made daily?</strong></li>
              <li className="faq-item">Absolutely! All our desserts, including cupcakes, gulab jamun, and cheesecakes, are freshly prepared every day.</li>
              <li className="faq-item"><strong>Do you offer delivery?</strong></li>
              <li className="faq-item">Yes, we provide home delivery for most items. Delivery charges may vary based on location.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

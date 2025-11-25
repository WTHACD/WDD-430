import Header from './components/Header';

export default function HomePage() {
  return (
    <>
      <Header />

      <header className="hero">
        <div className="container">
          <h1>Discover Unique Handcrafted Treasures</h1>
          <p>Connect directly with talented artisans and find sustainable, one-of-a-kind products made with passion and care.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <a href="#" className="btn btn-primary">Shop Now</a>
            <a href="#" className="btn btn-secondary">Meet the Artisans</a>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Featured Collections</h2>

        <div className="product-grid">
          <article className="product-card">
            <div className="card-image" style={{ backgroundImage: "url('placeholder1.jpg')" }}></div>
            <div className="card-content">
              <span className="category">Ceramics</span>
              <h3 className="product-title">Earthenware Vase</h3>
              <p className="artisan">by Maria Gomez</p>
              <div className="card-footer">
                <span className="price">$45.00</span>
                <span className="rating">★ 4.8 (24)</span>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div className="card-image"></div>
            <div className="card-content">
              <span className="category">Textiles</span>
              <h3 className="product-title">Handwoven Scarf</h3>
              <p className="artisan">by The Wool Studio</p>
              <div className="card-footer">
                <span className="price">$32.00</span>
                <span className="rating">★ 5.0 (12)</span>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div className="card-image"></div>
            <div className="card-content">
              <span className="category">Woodwork</span>
              <h3 className="product-title">Oak Cutting Board</h3>
              <p className="artisan">by Forest Crafts</p>
              <div className="card-footer">
                <span className="price">$60.00</span>
                <span className="rating">★ 4.9 (8)</span>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div className="card-image"></div>
            <div className="card-content">
              <span className="category">Jewelry</span>
              <h3 className="product-title">Silver Leaf Ring</h3>
              <p className="artisan">by Silver Soul</p>
              <div className="card-footer">
                <span className="price">$28.00</span>
                <span className="rating">★ 4.7 (40)</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <h3>Handcrafted Haven</h3>
          <p>Supporting local artisans and sustainable consumption.</p>
          <br />
          <p>&copy; 2025 Handcrafted Haven. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
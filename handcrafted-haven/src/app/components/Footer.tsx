export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3>Handcrafted Haven</h3>
        <p>Discover and support talented artisans — handcrafted with care.</p>
        <p style={{ marginTop: 12, opacity: 0.9 }}>© {new Date().getFullYear()} Handcrafted Haven</p>
      </div>
    </footer>
  );
}

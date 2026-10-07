const footerContainer = document.getElementById("footer-container");

if (footerContainer) {
  const bubbles = Array.from({ length: 12 }, (_, index) => {
    const position = 4 + index * 8.2;
    const size = 2.2 + (index % 4) * 0.7;
    const time = 3.5 + (index % 5) * 0.6;
    const delay = -index * 0.45;
    const distance = 5 + (index % 3) * 2;
    return `<span class="bubble" style="--position:${position}%;--size:${size}rem;--time:${time}s;--delay:${delay}s;--distance:${distance}rem"></span>`;
  }).join("");
  footerContainer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-bubbles" aria-hidden="true">${bubbles}</div>
      <div class="footer-content">
        <div class="footer-copy"><strong>Hasib Alam</strong><p>Building elegant simulations, data solutions, AI systems, and scientific visualizations.</p></div>
        <nav class="footer-links" aria-label="Footer links">
          <a href="https://www.linkedin.com/in/hasib-alam-b58987214/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span></a>
          <a href="https://hasibportfolio.netlify.app/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-globe" aria-hidden="true"></i><span>Website</span></a>
          <a href="mailto:hasibalamsadat2001@gmail.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>Email</span></a>
          <a href="documents/Hasib_Alam_Resume.pdf" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i><span>Resume</span></a>
          <a href="https://github.com/HasibAlam" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i><span>GitHub</span></a>
        </nav>
      </div>
    </footer>
    <svg class="footer-filter" aria-hidden="true"><defs><filter id="footer-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo"/></filter></defs></svg>`;
}

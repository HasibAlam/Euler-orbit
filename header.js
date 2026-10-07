const headerContainer = document.getElementById("header-container");

if (headerContainer) {
  headerContainer.innerHTML = `
    <header class="portfolio-header hb">
      <a class="identity" href="https://hasibportfolio.netlify.app/" target="_blank" rel="noopener noreferrer" aria-label="Hasib Alam portfolio">
        <img class="profile-image" src="https://github.com/HasibAlam.png" alt="Hasib Alam" />
        <span class="identity-copy">
          <strong>Hasib Alam</strong>
          <small>Data Analyst <b>|</b> Python Developer <b>|</b> Full Stack</small>
        </span>
      </a>
      <button class="header-toggle" type="button" aria-expanded="false" aria-controls="orbit-header-panel" aria-label="Open navigation"><i></i><i></i><i></i></button>
      <nav class="header-panel" id="orbit-header-panel" aria-label="Portfolio links">
        <a href="https://www.linkedin.com/in/hasib-alam-b58987214/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span></a>
        <a href="https://hasibportfolio.netlify.app/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-globe" aria-hidden="true"></i><span>Website</span></a>
        <a href="mailto:hasibalamsadat2001@gmail.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>Email</span></a>
        <a href="documents/Hasib_Alam_Resume.pdf" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i><span>Resume</span></a>
        <a href="https://github.com/HasibAlam" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i><span>GitHub</span></a>
      </nav>
    </header>`;

  const toggle = headerContainer.querySelector(".header-toggle");
  const panel = headerContainer.querySelector(".header-panel");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    panel.toggleAttribute("data-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
}

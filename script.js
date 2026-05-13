/**
 * Academic Personal Website — JavaScript
 * Navbar effects, smooth scrolling, and mobile menu
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- DOM refs ----------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = navLinks.querySelectorAll('a');

  // ---------- Mobile menu toggle ----------
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ---------- Navbar shadow on scroll ----------
  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id], header[id]');
    let currentId = '';
    const offset = 100;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const bottom = top + section.offsetHeight;
      if (window.scrollY + offset >= top && window.scrollY + offset < bottom) {
        currentId = section.id;
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Smooth scroll for all anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Paper link hover feedback ----------
  document.querySelectorAll('.paper-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-1px)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });

});

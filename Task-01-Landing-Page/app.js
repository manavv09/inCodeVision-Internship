document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // 1. Sticky Navigation on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic Active Link Update on Scroll
    const sections = document.querySelectorAll('section');
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // 2. Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 3. Typewriter Mockup Animation
  animateTerminal();

  // 4. Live Node Graph Hover Interactions
  initNodeGraph();

  // 5. Scroll Reveal Intersection Observer
  initScrollReveal();
});

/* ==========================================================================
   Typewriter Mockup Animation
   ========================================================================== */
function animateTerminal() {
  const terminalBody = document.querySelector('.terminal-body code');
  if (!terminalBody) return;

  // Cache the original HTML structure
  const originalHTML = terminalBody.innerHTML;
  terminalBody.innerHTML = ''; // Clear terminal

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';
  cursor.textContent = '█';
  terminalBody.parentNode.appendChild(cursor);

  // We parse the HTML structure and type characters inside text nodes sequentially
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;

  const nodes = [];
  function collectTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      nodes.push({ type: 'text', parent: node.parentNode, text: node.nodeValue, node: node });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Create empty duplicate element in terminalBody to preserve hierarchy
      const clone = node.cloneNode(false);
      node.clonedNode = clone;
      
      // Find parent clone
      if (node.parentNode === tempDiv) {
        terminalBody.appendChild(clone);
      } else {
        node.parentNode.clonedNode.appendChild(clone);
      }
      
      for (let i = 0; i < node.childNodes.length; i++) {
        collectTextNodes(node.childNodes[i]);
      }
    }
  }

  // Traverse and clone elements
  for (let i = 0; i < tempDiv.childNodes.length; i++) {
    collectTextNodes(tempDiv.childNodes[i]);
  }

  let nodeIndex = 0;
  let charIndex = 0;

  function typeNextChar() {
    if (nodeIndex >= nodes.length) {
      cursor.classList.add('blink');
      return;
    }

    const currentNode = nodes[nodeIndex];
    let parentToAppend = terminalBody;
    if (currentNode.parent !== tempDiv) {
      parentToAppend = currentNode.parent.clonedNode;
    }

    // Append text node if not yet created for this segment
    if (charIndex === 0) {
      currentNode.newTextNode = document.createTextNode('');
      parentToAppend.appendChild(currentNode.newTextNode);
    }

    currentNode.newTextNode.nodeValue += currentNode.text[charIndex];
    charIndex++;

    if (charIndex >= currentNode.text.length) {
      charIndex = 0;
      nodeIndex++;
    }

    // Faster speed for comments/spaces, normal for keywords
    const delay = currentNode.text[charIndex] === ' ' ? 10 : 25;
    setTimeout(typeNextChar, delay);
  }

  setTimeout(typeNextChar, 1000);
}

/* ==========================================================================
   Live Node Graph Interactions
   ========================================================================== */
function initNodeGraph() {
  const parentNode = document.querySelector('.node.parent');
  const childNodes = document.querySelectorAll('.node.child');
  const branchLines = document.querySelectorAll('.node-branch-line');

  if (!parentNode) return;

  // Add hover effect to parent: glows all child nodes
  parentNode.addEventListener('mouseenter', () => {
    childNodes.forEach(child => child.classList.add('glow'));
    branchLines.forEach(line => line.classList.add('active'));
  });

  parentNode.addEventListener('mouseleave', () => {
    childNodes.forEach(child => child.classList.remove('glow'));
    branchLines.forEach(line => line.classList.remove('active'));
    // Make sure Home.jsx keeps its default glow
    const homeNode = document.querySelector('.node.child:nth-child(1)');
    if (homeNode) homeNode.classList.add('glow');
  });

  // Hover individual children to light up their specific paths
  childNodes.forEach((child, index) => {
    child.addEventListener('mouseenter', () => {
      child.classList.add('glow-strong');
      parentNode.classList.add('glow-cyan');
      document.body.style.setProperty('--branch-highlight-color', 'var(--accent-pink)');
    });

    child.addEventListener('mouseleave', () => {
      child.classList.remove('glow-strong');
      parentNode.classList.remove('glow-cyan');
    });
  });
}

/* ==========================================================================
   IntersectionObserver for Section Reveal
   ========================================================================== */
function initScrollReveal() {
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('section-reveal');
    observer.observe(section);
  });
}

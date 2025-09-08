// Ponto de entrada: espera o HTML ser totalmente carregado para executar os scripts.
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSmoothScroll();
  initActiveLinkObserver();
  initScrollAnimations();
  initFormHandler();
  initFooterYear();
});

/**
 * 1. Inicializa a funcionalidade do menu mobile (hamburger).
 */
function initMobileMenu() {
  const toggleButton = document.querySelector(".header__toggle");
  const nav = document.querySelector(".nav");

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--is-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });
}

/**
 * 2. Inicializa o scroll suave para todos os links internos (âncoras).
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Fecha o menu mobile se estiver aberto ao clicar em um link
        document.querySelector(".nav")?.classList.remove("nav--is-open");
        document
          .querySelector(".header__toggle")
          ?.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/**
 * 3. Usa IntersectionObserver para destacar o link de navegação da seção visível na tela.
 * Esta é uma abordagem de alta performance.
 */
function initActiveLinkObserver() {
  const navLinks = Array.from(
    document.querySelectorAll('.nav__link[href^="#"]')
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.remove("nav__link--active");
            if (link.getAttribute("href") === id) {
              link.classList.add("nav__link--active");
            }
          });
        }
      });
    },
    {
      // A "zona de ativação" está no meio da tela (entre 40% do topo e 55% da base)
      rootMargin: "-40% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Usa IntersectionObserver para animar elementos quando eles entram na tela.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    "[data-animate-on-scroll]"
  );
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, parseInt(delay, 10));
          observer.unobserve(entry.target); // Anima apenas uma vez
        }
      });
    },
    {
      threshold: 0.1, // Ativa quando 10% do elemento está visível
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * 5. Manipula o envio do formulário de contato, exibindo uma mensagem de sucesso.
 */
function initFormHandler() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const successMessage = document.querySelector(".contact-form__success");

    // Simulação de envio de dados para um servidor
    const formData = new FormData(form);
    const customerData = Object.fromEntries(formData.entries());
    customerData.data_contato = new Date().toISOString();
    console.log("Dados a serem enviados para a API:", customerData);

    if (successMessage) {
      form.hidden = true;
      successMessage.hidden = false;
    }

    // Reseta o formulário após 5 segundos
    setTimeout(() => {
      form.reset();
    }, 5000);
  });
}

/**
 * 6. Atualiza o ano no rodapé para o ano atual.
 */
function initFooterYear() {
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

//Todo: armazenar dados do cliente no cliente.json

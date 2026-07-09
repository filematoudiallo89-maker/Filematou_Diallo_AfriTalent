/**
 * AfriTalent - Script principal
 * Fonctionnalités communes aux 5 pages
 * Utilise uniquement JavaScript vanilla (ES6)
 */

document.addEventListener('DOMContentLoaded', function() {

    // ================================================================
    // 1. DARK / LIGHT MODE avec localStorage
    // ================================================================
    const toggleThemeBtn = document.getElementById('theme-toggle');
    if (toggleThemeBtn) {
        // Récupérer le thème sauvegardé ou 'light' par défaut
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', currentTheme);
        updateThemeIcon(currentTheme);

        // Basculer le thème au clic
        toggleThemeBtn.addEventListener('click', function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-bs-theme');
            const newTheme = (current === 'dark') ? 'light' : 'dark';
            html.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    /**
     * Met à jour l'icône du bouton en fonction du thème
     * @param {string} theme - 'dark' ou 'light'
     */
    function updateThemeIcon(theme) {
        if (toggleThemeBtn) {
            const icon = toggleThemeBtn.querySelector('i');
            if (icon) {
                icon.className = (theme === 'dark') ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // ================================================================
    // 2. NAVBAR DYNAMIQUE AU SCROLL
    // ================================================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // ================================================================
    // 3. BOUTON RETOUR EN HAUT
    // ================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================================================================
    // 4. COMPTEURS ANIMÉS AU SCROLL (IntersectionObserver)
    // ================================================================
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    let current = 0;
                    const increment = target / 100; // 100 étapes pour l'animation
                    const timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 20);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    // ================================================================
    // 5. FADE-IN DES SECTIONS AU SCROLL (IntersectionObserver)
    // ================================================================
    const fadeElements = document.querySelectorAll('.fade-section');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        fadeElements.forEach(function(el) {
            fadeObserver.observe(el);
        });
    }

    // ================================================================
    // 6. FILTRAGE DES FREELANCES (page freelances.html)
    // ================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const freelanceCards = document.querySelectorAll('.freelance-card');

    if (filterBtns.length > 0 && freelanceCards.length > 0) {
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;

                freelanceCards.forEach(function(card) {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Mettre à jour l'état actif des boutons
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }

    // ================================================================
    // 7. VALIDATION DU FORMULAIRE DE CONTACT (page contact.html)
    // ================================================================
    const form = document.getElementById('contact-form');
    if (form) {
        const nom = document.getElementById('nom');
        const prenom = document.getElementById('prenom');
        const email = document.getElementById('email');
        const sujet = document.getElementById('sujet');
        const message = document.getElementById('message');
        const successMsg = document.getElementById('success-message');

        // Fonction utilitaire pour afficher une erreur sous un champ
        function showError(input, errorId, msg) {
            input.classList.add('is-invalid');
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.textContent = msg;
            }
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Réinitialiser les messages et les classes de validation
            document.querySelectorAll('.error-message').forEach(function(el) {
                el.textContent = '';
            });
            document.querySelectorAll('.form-control, .form-select').forEach(function(el) {
                el.classList.remove('is-invalid', 'is-valid');
            });
            if (successMsg) {
                successMsg.style.display = 'none';
            }

            // --- Validation Nom ---
            if (!nom.value.trim()) {
                showError(nom, 'nom-error', 'Le nom est requis.');
                isValid = false;
            } else {
                nom.classList.add('is-valid');
            }

            // --- Validation Prénom ---
            if (!prenom.value.trim()) {
                showError(prenom, 'prenom-error', 'Le prénom est requis.');
                isValid = false;
            } else {
                prenom.classList.add('is-valid');
            }

            // --- Validation Email ---
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError(email, 'email-error', 'Veuillez entrer un email valide (ex: nom@domaine.com).');
                isValid = false;
            } else {
                email.classList.add('is-valid');
            }

            // --- Validation Sujet ---
            if (!sujet.value) {
                showError(sujet, 'sujet-error', 'Veuillez sélectionner un sujet.');
                isValid = false;
            } else {
                sujet.classList.add('is-valid');
            }

            // --- Validation Message (minimum 20 caractères) ---
            if (message.value.trim().length < 20) {
                showError(message, 'message-error', 'Le message doit contenir au moins 20 caractères.');
                isValid = false;
            } else {
                message.classList.add('is-valid');
            }

            // --- Si tout est valide ---
            if (isValid) {
                if (successMsg) {
                    successMsg.style.display = 'block';
                }
                form.reset();
                // Supprimer les classes 'is-valid' après reset
                document.querySelectorAll('.form-control, .form-select').forEach(function(el) {
                    el.classList.remove('is-valid');
                });
                // Masquer le message de succès après 5 secondes
                setTimeout(function() {
                    if (successMsg) {
                        successMsg.style.display = 'none';
                    }
                }, 5000);
            }
        });
    }

    // ================================================================
    // 8. ANNÉE DYNAMIQUE DANS LE COPYRIGHT DU FOOTER
    // ================================================================
    const copyright = document.getElementById('copyright');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.textContent = '© ' + year + ' AfriTalent. Tous droits réservés.';
    }

}); // Fin de DOMContentLoaded
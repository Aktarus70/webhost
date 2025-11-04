// Chiudi menu hamburger al click su una voce
document.querySelectorAll('#mainNavbar .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.getElementById('mainNavbar');
        if (navbarCollapse.classList.contains('show')) {
            // Usa Bootstrap collapse API se disponibile
            if (typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                bsCollapse.hide();
            } else {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});
// JS Vanilla per:
// 1. Scroll smooth anchor
// 2. Validazione form real-time
// 3. Modal successo invio

// Navbar nera dopo scroll di 2cm (20px)
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 20) {
        header.classList.add('scrolled-navbar');
    } else {
        header.classList.remove('scrolled-navbar');
    }
});

// Blocca la navbar nera dopo il primo scroll oltre il 2cm
let navbarLocked = false;
window.addEventListener('scroll', function lockNavbar() {
    const header = document.getElementById('header');
    if (!navbarLocked && window.scrollY > 20) {
        header.classList.add('scrolled-navbar');
        navbarLocked = true;
    }
    if (navbarLocked) {
        window.removeEventListener('scroll', lockNavbar);
    }
});

// Smooth scroll per anchor links e accessibilità
document.querySelectorAll('a.nav-link, .cta-btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) {
                e.preventDefault();
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                section.setAttribute('tabindex', '-1');
                section.focus();
            }
        }
    });
});

//------------- FORM LOGICA COMPLETA --------------//

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

// Helper validazione regex
const onlyLettersRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]{2,}$/;

function validateNome(nome) {
    if (nome.length < 2) return "Nome troppo corto";
    if (!onlyLettersRegex.test(nome)) return "Solo lettere ammesse";
    return "";
}
function validateCognome(cognome) {
    if (cognome.length < 2) return "Cognome troppo corto";
    if (!onlyLettersRegex.test(cognome)) return "Solo lettere ammesse";
    return "";
}
function validateDob(dob) {
    // Regex formato base
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return "Formato data non valido (gg/mm/aaaa)";
    const [d, m, y] = dob.split("/");
    const birthDate = new Date(`${y}-${m}-${d}`);
    if (isNaN(birthDate.getTime())) return "Data non valida";
    // Calcola età
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
        today.getMonth() < (birthDate.getMonth())
        || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) age--;
    if (age < 18) return "Devi essere maggiorenne";
    return "";
}
function validateMessaggio(msg) {
    if (msg.length < 10) return "Messaggio troppo corto";
    return "";
}

// Event delegation: validazione durante digitazione
["nome", "cognome", "dob", "messaggio"].forEach(field => {
    document.getElementById(field).addEventListener("input", validateField);
    document.getElementById(field).addEventListener("blur", validateField);
});
function validateField(e) {
    const field = e.target;
    let error = "";
    switch(field.id) {
        case "nome": error = validateNome(field.value.trim()); break;
        case "cognome": error = validateCognome(field.value.trim()); break;
        case "dob": error = validateDob(field.value.trim()); break;
        case "messaggio": error = validateMessaggio(field.value.trim()); break;
    }
    const errorDiv = document.getElementById(field.id + "Error");
    if (error) {
        field.classList.add("invalid");
        errorDiv.textContent = error;
    } else {
        field.classList.remove("invalid");
        errorDiv.textContent = "";
    }
    checkFormValid();
}

// Abilita/disabilita bottone submit in base validità
function checkFormValid() {
    // Togli spazi per sicurezza
    const nome = document.getElementById("nome").value.trim();
    const cognome = document.getElementById("cognome").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const messaggio = document.getElementById("messaggio").value.trim();

    if (
        validateNome(nome) === "" &&
        validateCognome(cognome) === "" &&
        validateDob(dob) === "" &&
        validateMessaggio(messaggio) === ""
    ) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Submit form: mostra alert/modal successo, reset campi
contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    // Modal/alert di successo (accessibile)
    showSuccessModal();
    contactForm.reset();
    Array.from(contactForm.querySelectorAll(".invalid")).forEach(el => el.classList.remove("invalid"));
    Array.from(contactForm.querySelectorAll(".invalid-feedback")).forEach(el => el.textContent = "");
});

// Modal di successo
function showSuccessModal() {
    // Solo JS (no framework): box centrato, auto dismiss
    const modal = document.createElement("div");
    modal.setAttribute("role", "alertdialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Richiesta inviata");
    modal.tabIndex = -1;
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(26,102,166,0.22)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.innerHTML = `
        <div style="
            background: #fff;
            padding: 2em 2.5em;
            border-radius: 18px;
            box-shadow: 0 2px 18px 6px rgba(207,165,57,0.15);
            color: var(--color-blue);
            font-family: var(--font-title);
            font-size: 1.25rem;
            text-align: center;
        ">
            <span style="display: block; margin-bottom: 18px;">
                <i class="fa fa-check-circle text-success" aria-hidden="true" style="font-size:2.5em;color:var(--color-green);"></i>
            </span>
            Grazie! La tua richiesta è stata inviata.
        </div>
    `;
    document.body.appendChild(modal);
    modal.focus();
    setTimeout(() => {
        modal.remove();
    }, 2700); // Chiudi dopo 2,7s
}

// Keyboard navigation: focus visibile
document.body.addEventListener("keyup", function(e) {
    if (e.key === "Tab") {
        document.activeElement.classList.add("tab-focus");
    }
});
document.body.addEventListener("mousedown", function() {
    document.querySelectorAll(".tab-focus").forEach(el => el.classList.remove("tab-focus"));
});

document.addEventListener("DOMContentLoaded", () => {

    loadComponents();

});

async function loadComponents(){

    const navbarContainer =
    document.getElementById("navbar-container");

    const footerContainer =
    document.getElementById("footer-container");


    if(navbarContainer){

        const navbar =
        await fetch("/components/navbar.html");

        navbarContainer.innerHTML =
        await navbar.text();
    }


    if(footerContainer){

        const footer =
        await fetch("/components/footer.html");

        footerContainer.innerHTML =
        await footer.text();
    }
}
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "/index.html";
}
const user = JSON.parse(localStorage.getItem("loggedUser"));

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const logoutLink = document.getElementById("logout-link");

if (user) {
    // si hay sesión
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "block";
} else {
    // si no hay sesión
    if (loginLink) loginLink.style.display = "block";
    if (registerLink) registerLink.style.display = "block";
    if (logoutLink) logoutLink.style.display = "none";
}
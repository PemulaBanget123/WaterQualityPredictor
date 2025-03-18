document.addEventListener("DOMContentLoaded", function() {
    // Navbar Toggle
    const menuIcon = document.getElementById("menu-icon");
    const menuList = document.getElementById("menu-list");

    if (menuIcon && menuList) {
        menuIcon.addEventListener("click", () => {
            menuList.classList.toggle("hidden");
        });
    }

    // Form Submission with AJAX
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Save current scroll position
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            // Collect form data
            const formData = new FormData(form);

            // Send AJAX request to Flask
            fetch("/predict", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Restore scroll position before showing alert
                setTimeout(() => {
                    window.scrollTo(scrollX, scrollY);
                }, 0);

                Swal.fire({
                    title: "Prediction Result",
                    text: `Water is ${data.prediction} for human consumption.`,
                    icon: data.prediction === "safe" ? "success" : "error",
                    position: "center", // Show in the center
                    allowOutsideClick: true, // Do not force user interaction
                    backdrop: true, // Keep background dimmed
                    scrollbarPadding: false, // Prevents adding padding that causes movement
                    willOpen: () => {
                        document.body.style.overflow = "hidden"; // Disable scrolling while pop-up is open
                    },
                    willClose: () => {
                        document.body.style.overflow = ""; // Re-enable scrolling when pop-up closes
                    }
                });
            })
            .catch(error => {
                console.error("Error:", error);

                setTimeout(() => {
                    window.scrollTo(scrollX, scrollY);
                }, 0);

                Swal.fire({
                    title: "Error",
                    text: "An unexpected error occurred. Please try again.",
                    icon: "error",
                    position: "center",
                    allowOutsideClick: true,
                    backdrop: true,
                    scrollbarPadding: false,
                    willOpen: () => {
                        document.body.style.overflow = "hidden";
                    },
                    willClose: () => {
                        document.body.style.overflow = "";
                    }
                });
            });
        });
    }

    function revealOnScroll() {
        const elements = document.querySelectorAll(".fade-in");
        const windowHeight = window.innerHeight;
    
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;
    
            if (position < windowHeight - 100) {
                element.classList.add("visible");
            }
        });
    }
    
    // Listen for scroll event
    window.addEventListener("scroll", revealOnScroll);
    
    // Run once on load
    revealOnScroll();

    // Smooth Scrolling for Buttons
const predictButton = document.getElementById("predict-btn");
const howToUseButton = document.getElementById("howToUse-btn");

// Adjust this value to control where scrolling stops (e.g., for a fixed navbar)
const OFFSET = 80; // Adjust this value as needed

function scrollToTop(element) {
    if (element) {
        window.scrollTo({
            top: element.offsetTop - OFFSET, // Subtract offset for spacing
            behavior: "smooth"
        });
    }
}

if (predictButton) {
    predictButton.addEventListener("click", function() {
        const predictSection = document.getElementById("predict-section");
        scrollToTop(predictSection);
    });
}

if (howToUseButton) {
    howToUseButton.addEventListener("click", function() {
        const howToUseSection = document.getElementById("howtouse-section");
        scrollToTop(howToUseSection);
    });
}

});

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menu-icon");
    const menuList = document.getElementById("menu-list");

    if (menuIcon && menuList) {
        menuIcon.addEventListener("click", () => {
            menuList.classList.toggle("hidden");
        });
    };

    const items = document.querySelectorAll(".item");
    const carousel = document.getElementById("carousel");

    items.forEach(item => {
        item.addEventListener("click", function () {
            const targetId = this.id;
            const targetItem = document.getElementById(targetId);
            
            if (targetItem) {
                targetItem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        });
    });
});

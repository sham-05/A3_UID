const top_images = {
    bats: "assets/pngimg.com - cricket_PNG27.png"
};

const products = {
    bats: [
        {name: "Gray Niccols"},
        {name: "Adidas Bat"}
    ],
    gloves: [
        {
            name: "Kookaburra Gloves"
        },
        {
            name: "Adidas Gloves"
        }
    ]
};
//get cat from url
const param = new URLSearchParams(window.location.search);
const category = param.get("type");

//set page title
document.getElementById("product-header").textContent = category ? category.toUpperCase(): "Products";
document.getElementById("breadcrumb-item").textContent = category ? category.toUpperCase(): "Products";
const grid = document.getElementById("product-grid");
const top_area = document.getElementById("top-image");
const img_comp = document.createElement("img");

if (top_images[category]){
    img_comp.src=top_images[category];
    img_comp.classList.add("top_img");
    top_area.appendChild(img_comp);

}
if (products[category]){
    products[category].forEach(item=>{

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML= `<h3>${item.name}</h3>`
        grid.appendChild(card);
    });
}

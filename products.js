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


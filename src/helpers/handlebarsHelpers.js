const Handlebars = require("handlebars");

// Registrar helpers
Handlebars.registerHelper("multiply", (a, b) => (a * b).toFixed(2));
Handlebars.registerHelper("cartTotal", (cart) => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
});

module.exports = Handlebars;

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Errores 400 - Datos inválidos proporcionados por el cliente
    const errores400 = {
        producto: [
            "El título es obligatorio y debe ser un string",
            "La descripción es obligatoria y debe ser un string",
            "El código es obligatorio y debe ser un string",
            "La categoría es obligatoria y debe ser un string",
            "El status es obligatorio y debe ser un booleano",
            "El precio debe ser un numero y mayor a 0",
            "El Stock debe ser un numero y mayor a 0",
            "El Codigo proporcionado ya existe",
            "Thumbnails debe ser un array",
            "Los datos de actualización deben ser un objeto no vacio"
        ],
        validacionesQuery: [
            "El parámetro 'page' debe ser un número entero positivo.",
            "El parámetro 'limit' debe ser un número entero positivo.",
            "El parámetro 'status' solo puede ser 'true' o 'false'.",
            "El parámetro 'sort' solo puede ser 'asc' o 'desc'."
        ],
        carrito: [
            "La cantidad debe ser un numero entero y mayor a 0",
            "¡Los productos deben ser un array no vacio!",
            "Error en el campo del producto. Cada producto debe tener: -Un ID valido de mongoose. -Una Quantity que sea de tipo numero, entero y mayor a 0"
        ]
    };

    // Errores 404 - Recursos no encontrados
    const errores404 = {
        producto: [
            "No existe ningun producto con el ID proporcionado",
            "No existe ningun producto con ID",
            "No hay productos disponibles",
            "El ID proporcionado del Producto no es valido"
        ],
        carrito: [
            "Carrito o producto no encontrado",
            "Carrito con el ID proporcionado no existe",
            "El ID proporcionado del Carrito no es valido"
        ],
        ids: [
            "El ID proporcionado no es valido"
        ]
    };

    // Error 500 - Error interno específico
    const errores500 = [
        "Formato invalido de productos"
    ];

    // --- Evaluación de errores ---

    if (
        Object.values(errores400).flat().includes(err.message)
    ) {
        console.error("Error 400: Invalid request data -", err.message);
        return res.status(400).json({ error: err.message });
    }

    if (
        Object.values(errores404).flat().includes(err.message)
    ) {
        console.error("Error 404: Resource not found -", err.message);
        return res.status(404).json({ error: err.message });
    }

    if (errores500.includes(err.message)) {
        console.error("Error 500: Internal server error -", err.message);
        return res.status(500).json({ error: err.message });
    }

    // Error 500 genérico
    console.error("Error 500: Unexpected internal error -", err);
    res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = errorHandler;

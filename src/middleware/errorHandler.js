const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Errores 400: Solicitudes mal formadas o datos inválidos proporcionados por el cliente
    if (err.message === "El título es obligatorio y debe ser un texto" || 
        err.message === "La descripción es obligatoria y debe ser un texto" || 
        err.message === "El código es obligatorio y debe ser un texto" || 
        err.message === "La categoría es obligatoria y debe ser un texto" || 
        err.message === "El status es obligatorio y debe ser un booleano" || 
        err.message === "El precio debe ser un numero y mayor a 0" || 
        err.message === "El Stock debe ser un numero y mayor a 0" || 
        err.message === "El Codigo proporcionado ya existe" ||
        err.message === "Thumbnails debe ser un array") {
        console.error("Error 400: Invalid request data -", err.message);
        return res.status(400).json({ error: err.message });
    }

    // Errores 404: No se encontró el recurso
    if (err.message === "El ID proporcionado no es valido" || 
        err.message === "No existe ningun producto con ID proporcionado" || 
        err.message === "No existe ningun producto con ID" ||
        err.message === "Carrito con el ID proporcionado no existe" || 
        err.message === "El ID proporcionado del Carrrito no es valido" ||
        err.message === "El ID proporcionado del Producto no es valido") {
        console.error("Error 404: Resource not found -", err.message);
        return res.status(404).json({ error: err.message });
    }

    // Error 500: Error interno del servidor 
    if (err.message === "Formato invalido de productos") {
        console.error("Error 500: Internal server error -", err.message);
        return res.status(500).json({ error: err.message });
    }

    // Manejo de errores genéricos 
    console.error("Error 500: Unexpected internal error -", err);
    res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = errorHandler;

module.exports = errorHandler;

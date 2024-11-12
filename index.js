// Importa las dependencias necesarias para el servidor
const express = require('express');  // Express es un framework para crear servidores web
const fs = require('fs');  // fs (File System) permite trabajar con archivos del sistema
const app = express();  // Inicia una instancia de Express

// para que Express entienda los datos en formato JSON en las solicitudes
app.use(express.json());

// Función para leer un archivo JSON y convertir su contenido en un objeto de JS
function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

// Función para escribir un objeto JavaScript en un archivo JSON
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// CRUD para Estudiantes
// Ruta GET para obtener la lista de estudiantes
app.get('/estudiantes', (req, res) => {
    const estudiantes = readJSON('Estudiantes.json');  // Lee el archivo Estudiantes.json
    const estudiantesActivos = estudiantes.filter(estudiante => estudiante.activo !== false); // Filtra solo los estudiantes activos
    res.json(estudiantesActivos);  // Envia la lista de estudiantes como respuesta
});
// Ruta GET para obtener la lista de estudiantes desactivados
app.get('/estudiantesDesactivados', (req, res) => {
    const estudiantes = readJSON('Estudiantes.json');
    const estudiantesDesactivados = estudiantes.filter(estudiante => estudiante.activo === false);
    res.json(estudiantesDesactivados);
});

// Ruta POST para agregar un nuevo estudiante
app.post('/estudiantes', (req, res) => {
    const estudiantes = readJSON('Estudiantes.json');  // Lee la lista actual de estudiantes
    const nuevoEstudiante = req.body;  // Obtiene los datos del nuevo estudiante del body de la solicitud
    estudiantes.push(nuevoEstudiante);  // Agrega el nuevo estudiante a la lista
    writeJSON('Estudiantes.json', estudiantes);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Estudiante agregado', estudiante: nuevoEstudiante });  // Envia confirmación
}); 

// Ruta PUT para actualizar un estudiante existente basado en su ID
app.put('/estudiantes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // convierte el id a número
    const estudiantes = readJSON('Estudiantes.json');  // Lee la lista actual de estudiantes
    const estudianteIndex = estudiantes.findIndex(est => est.id === id);  // Busca el estudiante por su ID
    
    if (estudianteIndex === -1) {  // Si el estudiante no existe, envia un error
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    estudiantes[estudianteIndex] = { ...estudiantes[estudianteIndex], ...req.body };  // Actualiza los datos del estudiante
    writeJSON('Estudiantes.json', estudiantes);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Estudiante actualizado', estudiante: estudiantes[estudianteIndex] });  // Envia confirmación
});

// Ruta DELETE para eliminar un estudiante basado en su ID 
app.delete('/estudiantes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const estudiantes = readJSON('Estudiantes.json');  // Lee la lista actual de estudiantes
    // Busca el índice del estudiante en el array de estudiantes según el id proporcionado
    const estudianteIndex = estudiantes.findIndex(est => est.id === id);
    // Si el estudiante no se encuentra (índice -1), se envía una respuesta 404 con mensaje de error
    if (estudianteIndex === -1) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    // Marca el estudiante como inactivo, cambiando la propiedad 'activo' a false
    estudiantes[estudianteIndex].activo = false;
    // Guarda los cambios en el archivo JSON sobrescribiendo con el array actualizado
    writeJSON('Estudiantes.json', estudiantes);
    // Envía una respuesta confirmando la desactivación del estudiante
    res.json({ message: 'Estudiante desactivado' });
});

// CRUD para Profesores
// Ruta GET para obtener la lista de profesores
app.get('/profesores', (req, res) => {
    const profesores = readJSON('Profesores.json');  // Lee el archivo Profesores.json
    const profesoresActivos = profesores.filter(profesor => profesor.activo !== false); // Filtra solo los profesores activos
    res.json(profesoresActivos);  // Envia la lista de profesores como respuesta
});
// Ruta GET para obtener la lista de estudiantes desactivados
app.get('/profesoresDesactivados', (req, res) => {
    const profesores = readJSON('Profesores.json');
    const profesoresDesactivados = profesores.filter(profesor => profesor.activo === false);
    res.json(profesoresDesactivados);
});

// Ruta POST para agregar un nuevo profesor
app.post('/profesores', (req, res) => {
    const profesores = readJSON('Profesores.json');  // Lee la lista actual de profesores
    const nuevoProfesor = req.body;  // Obtiene los datos del nuevo profesor del cuerpo de la solicitud
    profesores.push(nuevoProfesor);  // Agrega el nuevo profesor a la lista
    writeJSON('Profesores.json', profesores);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Profesor agregado', profesor: nuevoProfesor });  // Envia confirmación
});

// Ruta PUT para actualizar un profesor existente basado en su ID
app.put('/profesores/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const profesores = readJSON('Profesores.json');  // Lee la lista actual de profesores
    const profesorIndex = profesores.findIndex(prof => prof.id === id);  // Busca el profesor por su ID
    
    if (profesorIndex === -1) {  // Si el profesor no existe, envia un error
        return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    profesores[profesorIndex] = { ...profesores[profesorIndex], ...req.body };  // Actualiza los datos del profesor
    writeJSON('Profesores.json', profesores);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Profesor actualizado', profesor: profesores[profesorIndex] });  // Envia confirmación
});

// Ruta DELETE para eliminar un profesor basado en su ID
app.delete('/profesores/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const profesores = readJSON('Profesores.json');
    const profesorIndex = profesores.findIndex(prof => prof.id === id);
    if (profesorIndex === -1) {
        return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    profesores[profesorIndex].activo = false;
    writeJSON('Profesores.json', profesores);
    res.json({ message: 'Profesor desactivado' });
});

// CRUD para Materias
// Ruta GET para obtener la lista de materias
app.get('/materias', (req, res) => {
    const materias = readJSON('Materias.json');  // Lee el archivo Materias.json
    const materiasActivos = materias.filter(materia => materia.activo !== false); // Filtra solo las materias activas
    res.json(materiasActivos);  // Envia la lista de materias como respuesta
});
// Ruta GET para obtener la lista de estudiantes desactivados
app.get('/materiasDesactivados', (req, res) => {
    const materias = readJSON('Materias.json');
    const materiasDesactivados = materias.filter(materia => materia.activo === false);
    res.json(materiasDesactivados);
});

// Ruta POST para agregar una nueva materia
app.post('/materias', (req, res) => {
    const materias = readJSON('Materias.json');  // Lee la lista actual de materias
    const nuevaMateria = req.body;  // Obtiene los datos de la nueva materia del cuerpo de la solicitud
    materias.push(nuevaMateria);  // Agrega la nueva materia a la lista
    writeJSON('Materias.json', materias);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Materia agregada', materia: nuevaMateria });  // Envia confirmación
});

// Ruta PUT para actualizar una materia existente basada en su ID
app.put('/materias/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const materias = readJSON('Materias.json');  // Lee la lista actual de materias
    const materiaIndex = materias.findIndex(mat => mat.id === id);  // Busca la materia por su ID
    
    if (materiaIndex === -1) {  // Si la materia no existe, envia un error
        return res.status(404).json({ message: 'Materia no encontrada' });
    }

    materias[materiaIndex] = { ...materias[materiaIndex], ...req.body };  // Actualiza los datos de la materia
    writeJSON('Materias.json', materias);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Materia actualizada', materia: materias[materiaIndex] });  // Envia confirmación
});

// Ruta DELETE para eliminar una materia basada en su ID
app.delete('/materias/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const materias = readJSON('Materias.json');
    const materiaIndex = materias.findIndex(mat => mat.id === id);
    if (materiaIndex === -1) {
        return res.status(404).json({ message: 'Materia no encontrada' });
    }
    materias[materiaIndex].activo = false;
    writeJSON('Materias.json', materias);
    res.json({ message: 'Materia desactivada' });
});

// CRUD para Calificaciones
// Ruta GET para obtener la lista de calificaciones
app.get('/calificaciones', (req, res) => {
    const calificaciones = readJSON('Calificaciones.json');  // Lee el archivo Calificaciones.json
    const calificacionesActivos = calificaciones.filter(calificacion => calificacion.activo !== false); // Filtra solo las calificaciones activas
    res.json(calificacionesActivos);  // Enviam la lista de calificaciones como respuesta
});
// Ruta GET para obtener la lista de estudiantes desactivados
app.get('/calificacionesDesactivados', (req, res) => {
    const calificaciones = readJSON('Calificaciones.json');
    const calificacionesDesactivados = calificaciones.filter(calificacion => calificacion.activo === false);
    res.json(calificacionesDesactivados);
});

// Ruta POST para agregar una nueva calificación
app.post('/calificaciones', (req, res) => {
    const calificaciones = readJSON('Calificaciones.json');  // Lee la lista actual de calificaciones
    const nuevaCalificacion = req.body;  // Obtiene los datos de la nueva calificación del cuerpo de la solicitud
    calificaciones.push(nuevaCalificacion);  // Agrega la nueva calificación a la lista
    writeJSON('Calificaciones.json', calificaciones);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Calificación agregada', calificacion: nuevaCalificacion });  // Envia confirmación
});

// Ruta PUT para actualizar una calificación existente basada en su ID
app.put('/calificaciones/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const calificaciones = readJSON('Calificaciones.json');  // Lee la lista actual de calificaciones
    const calificacionIndex = calificaciones.findIndex(calif => calif.id === id);  // Busca la calificación por su ID
    
    if (calificacionIndex === -1) {  // Si la calificación no existe, envia un error
        return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    calificaciones[calificacionIndex] = { ...calificaciones[calificacionIndex], ...req.body };  // Actualiza los datos de la calificación
    writeJSON('Calificaciones.json', calificaciones);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Calificación actualizada', calificacion: calificaciones[calificacionIndex] });  // Envia confirmación
});

// Ruta DELETE para eliminar una calificación basada en su ID
app.delete('/calificaciones/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const calificaciones = readJSON('Calificaciones.json');
    const calificacionIndex = calificaciones.findIndex(calif => calif.id === id);
    if (calificacionIndex === -1) {
        return res.status(404).json({ message: 'Calificación no encontrada' });
    }
    calificaciones[calificacionIndex].activo = false;
    writeJSON('Calificaciones.json', calificaciones);
    res.json({ message: 'Calificación desactivada' });
});

// CRUD para Reportes de Calificaciones
// Ruta GET para obtener la lista de reportes
app.get('/reportes', (req, res) => {
    const reportes = readJSON('Reportes.json');  // Lee el archivo Reportes.json
    const reportesActivos = reportes.filter(reporte => reporte.activo !== false); // Filtra solo los reportes activos
    res.json(reportesActivos);  // Envía la lista de reportes como respuesta
});
// Ruta GET para obtener la lista de estudiantes desactivados
app.get('/reportesDesactivados', (req, res) => {
    const reportes = readJSON('Reportes.json');
    const reportesDesactivados = reportes.filter(reporte => reporte.activo === false);
    res.json(reportesDesactivados);
});
// Ruta POST para agregar un nuevo reporte
app.post('/reportes', (req, res) => {
    const reportes = readJSON('Reportes.json');  // Lee la lista actual de reportes
    const nuevoReporte = req.body;  // Obtiene los datos del nuevo reporte del cuerpo de la solicitud
    reportes.push(nuevoReporte);  // Agrega el nuevo reporte a la lista
    writeJSON('Reportes.json', reportes);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Reporte agregado', reporte: nuevoReporte });  // Envía confirmación
});
// Ruta PUT para actualizar un reporte existente basado en su ID
app.put('/reportes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const reportes = readJSON('Reportes.json');  // Lee la lista actual de reportes
    const reporteIndex = reportes.findIndex(rep => rep.id === id);  // Busca el reporte por su ID
    if (reporteIndex === -1) {  // Si el reporte no existe, envía un error
        return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    reportes[reporteIndex] = { ...reportes[reporteIndex], ...req.body };  // Actualiza los datos del reporte
    writeJSON('Reportes.json', reportes);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Reporte actualizado', reporte: reportes[reporteIndex] });  // Envía confirmación
});
// Ruta DELETE para desactivar un reporte basado en su ID
app.delete('/reportes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);  // Convierte el ID a número
    const reportes = readJSON('Reportes.json');  // Lee la lista actual de reportes
    const reporteIndex = reportes.findIndex(rep => rep.id === id);  // Busca el reporte por su ID
    if (reporteIndex === -1) {  // Si el reporte no existe, envía un error
        return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    reportes[reporteIndex].activo = false;  // Marca el reporte como inactivo
    writeJSON('Reportes.json', reportes);  // Guarda la lista actualizada en el archivo
    res.json({ message: 'Reporte desactivado' });  // Envía confirmación
});

// Configuración del puerto donde escuchará el servidor
const port = 3001;  
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

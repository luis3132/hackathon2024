import { NextResponse, NextRequest } from "next/server";
import connection from "../conector";

interface Estudiante {
    cedula: string;
    nombre: string;
    curso: string;
    ciudad: string;
    curso_asignado: string;
}

// manage the GET requests
export async function GET() {
    try {
        const [rows] = await connection.execute('SELECT * FROM estudiantes');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the POST requests
export async function POST(req: NextRequest) {
    const estudiante: Estudiante = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM estudiantes WHERE cedula = ?', [estudiante.cedula]);
        const estudianteExists = rows[0];
        if (estudianteExists !== undefined) {
            return NextResponse.json({ message: 'Estudiante ya existe' }, { status: 400 });
        } else {
            await connection.execute('INSERT INTO estudiantes (cedula, nombre, curso, ciudad, curso_asignado) VALUES (?, ?, ?, ?, ?)', [estudiante.cedula, estudiante.nombre, estudiante.curso, estudiante.ciudad, estudiante.curso_asignado]);
            return NextResponse.json({ message: 'Estudiante creado' }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the PUT requests
export async function PUT(req: NextRequest) {
    const estudiante: Estudiante = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM estudiantes WHERE cedula = ?', [estudiante.cedula]);
        const estudianteExists = rows[0];
        if (estudianteExists === undefined) {
            return NextResponse.json({ message: 'Estudiante no existe' }, { status: 404 });
        } else {
            await connection.execute('UPDATE estudiantes SET nombre = ?, curso = ?, ciudad = ?, curso_asignado = ? WHERE cedula = ?', [estudiante.nombre, estudiante.curso, estudiante.ciudad, estudiante.curso_asignado, estudiante.cedula]);
            return NextResponse.json({ message: 'Estudiante actualizado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the DELETE requests
export async function DELETE(req: NextRequest) {
    const estudiante: Estudiante = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM estudiantes WHERE cedula = ?', [estudiante.cedula]);
        const estudianteExists = rows[0];
        if (estudianteExists === undefined) {
            return NextResponse.json({ message: 'Estudiante no existe' }, { status: 404 });
        } else {
            await connection.execute('DELETE FROM estudiantes WHERE cedula = ?', [estudiante.cedula]);
            return NextResponse.json({ message: 'Estudiante eliminado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
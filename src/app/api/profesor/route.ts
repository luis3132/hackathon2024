import { NextRequest, NextResponse } from 'next/server';
import connection from "../conector";

interface Profesor {
    cedula: string;
    nombre: string;
    cargo: string;
}

// manage the GET requests
export async function GET() {
    try {
        const [rows] = await connection.execute('SELECT * FROM profesor');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the POST requests
export async function POST(req: NextRequest) {
    const profesor: Profesor = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM profesor WHERE cedula = ?', [profesor.cedula]);
        const profesorExists = rows[0];
        if (profesorExists !== undefined) {
            return NextResponse.json({ message: 'Profesor ya existe' }, { status: 400 });
        } else {
            await connection.execute('INSERT INTO profesor (cedula, nombre, cargo) VALUES (?, ?, ?)', [profesor.cedula, profesor.nombre, profesor.cargo]);
            return NextResponse.json({ message: 'Profesor creado' }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the PUT requests
export async function PUT(req: NextRequest) {
    const profesor: Profesor = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM profesor WHERE cedula = ?', [profesor.cedula]);
        const profesorExists = rows[0];
        if (profesorExists === undefined) {
            return NextResponse.json({ message: 'Profesor no existe' }, { status: 404 });
        } else {
            await connection.execute('UPDATE profesor SET nombre = ?, cargo = ? WHERE cedula = ?', [profesor.nombre, profesor.cargo, profesor.cedula]);
            return NextResponse.json({ message: 'Profesor actualizado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the DELETE requests
export async function DELETE(req: NextRequest) {
    const profesor: Profesor = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM profesor WHERE cedula = ?', [profesor.cedula]);
        const profesorExists = rows[0];
        if (profesorExists === undefined) {
            return NextResponse.json({ message: 'Profesor no existe' }, { status: 404 });
        } else {
            await connection.execute('DELETE FROM profesor WHERE cedula = ?', [profesor.cedula]);
            return NextResponse.json({ message: 'Profesor eliminado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
import { NextResponse, NextRequest } from "next/server";
import connection from "../conector";

interface Cursos {
    id: number;
    curso: string;
    modalidad: boolean;
    profesor: string;
    ingles: string;
    habilidades_poder: string;
    mentor: string;
    monitor: string;
    capacidad: number;
}

interface CursosSinId {
    curso: string;
    modalidad: boolean;
    profesor: string;
    ingles: string;
    habilidades_poder: string;
    mentor: string;
    monitor: string;
    capacidad: number;
}

// manage the GET requests
export async function GET() {
    try {
        const [rows] = await connection.execute('SELECT * FROM cursos');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the POST requests
export async function POST(req: NextRequest) {
    const cursos: CursosSinId = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM cursos WHERE curso = ? AND modalidad = ? AND capacidad = ?', [cursos.curso, cursos.modalidad, cursos.capacidad]);
        const cursosExists = rows[0];
        if (cursosExists !== undefined) {
            return NextResponse.json({ message: 'Curso ya existe' }, { status: 400 });
        } else {
            await connection.execute('INSERT INTO cursos (curso, modalidad, profesor, ingles, habilidades_poder, mentor, monitor, capacidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [cursos.curso, cursos.modalidad, cursos.profesor, cursos.ingles, cursos.habilidades_poder, cursos.mentor, cursos.monitor, cursos.capacidad]);
            const [rows1] = await connection.execute('SELECT * FROM cursos WHERE curso = ? AND modalidad = ? AND capacidad = ?', [cursos.curso, cursos.modalidad, cursos.capacidad]);
            return NextResponse.json(rows1, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the PUT requests
export async function PUT(req: NextRequest) {
    const cursos: Cursos = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM cursos WHERE id = ?', [cursos.id]);
        const cursosExists = rows[0];
        if (cursosExists === undefined) {
            return NextResponse.json({ message: 'Curso no existe' }, { status: 400 });
        } else {
            await connection.execute('UPDATE cursos SET curso = ?, modalidad = ?, profesor = ?, ingles = ?, habilidades_poder = ?, mentor = ?, monitor = ?, capacidad = ? WHERE id = ?', [cursos.curso, cursos.modalidad, cursos.profesor, cursos.ingles, cursos.habilidades_poder, cursos.mentor, cursos.monitor, cursos.capacidad, cursos.id]);
            const [rows1] = await connection.execute('SELECT * FROM cursos WHERE id = ?', [cursos.id]);
            return NextResponse.json(rows1, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the DELETE requests
export async function DELETE(req: NextRequest) {
    const cursos: Cursos = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM cursos WHERE id = ?', [cursos.id]);
        const cursosExists = rows[0];
        if (cursosExists === undefined) {
            return NextResponse.json({ message: 'Curso no existe' }, { status: 400 });
        } else {
            await connection.execute('DELETE FROM cursos WHERE id = ?', [cursos.id]);
            return NextResponse.json({ message: 'Curso eliminado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
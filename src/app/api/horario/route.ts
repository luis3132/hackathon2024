import { NextResponse, NextRequest } from "next/server";
import connection from "../conector";

interface Horario {
    id: number;
    dia_inicio: string;
    dia_fin: string;
    hora_inicio: Date;
    hora_fin: Date;
}

interface HorarioSinId {
    dia_inicio: string;
    dia_fin: string;
    hora_inicio: Date;
    hora_fin: Date;
}

// manage the GET requests
export async function GET() {
    try {
        const [rows] = await connection.execute('SELECT * FROM horario');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the POST requests
export async function POST(req: NextRequest) {
    const horario: HorarioSinId = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM horario WHERE dia_inicio = ? AND dia_fin = ? AND hora_inicio = ? AND hora_fin = ?', [horario.dia_inicio, horario.dia_fin, horario.hora_inicio, horario.hora_fin]);
        const horarioExists = rows[0];
        if (horarioExists !== undefined) {
            return NextResponse.json({ message: 'Horario ya existe' }, { status: 400 });
        } else {
            await connection.execute('INSERT INTO horario (dia_inicio, dia_fin, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)', [horario.dia_inicio, horario.dia_fin, horario.hora_inicio, horario.hora_fin]);
            const [rows1] = await connection.execute('SELECT * FROM horario WHERE dia_inicio = ? AND dia_fin = ? AND hora_inicio = ? AND hora_fin = ?', [horario.dia_inicio, horario.dia_fin, horario.hora_inicio, horario.hora_fin]);
            return NextResponse.json(rows1, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the PUT requests
export async function PUT(req: NextRequest) {
    const horario: Horario = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM horario WHERE id = ?', [horario.id]);
        const horarioExists = rows[0];
        if (horarioExists === undefined) {
            return NextResponse.json({ message: 'Horario no existe' }, { status: 400 });
        } else {
            await connection.execute('UPDATE horario SET dia_inicio = ?, dia_fin = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?', [horario.dia_inicio, horario.dia_fin, horario.hora_inicio, horario.hora_fin, horario.id]);
            const [rows1] = await connection.execute('SELECT * FROM horario WHERE id = ?', [horario.id]);
            return NextResponse.json(rows1, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the DELETE requests
export async function DELETE(req: NextRequest) {
    const horario: Horario = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM horario WHERE id = ?', [horario.id]);
        const horarioExists = rows[0];
        if (horarioExists === undefined) {
            return NextResponse.json({ message: 'Horario no existe' }, { status: 404 });
        } else {
            await connection.execute('DELETE FROM horario WHERE id = ?', [horario.id]);
            return NextResponse.json({ message: 'Horario eliminado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
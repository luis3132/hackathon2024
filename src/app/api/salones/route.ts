import { NextResponse, NextRequest } from "next/server";
import connection from "../conector";

interface Salones {
    id: number;
    Ciudad: string;
    sede: string;
    direccion: string;
    estado: boolean;
    bloque: string;
    piso: number;
    aula: string;
    capacidad: number;
    pc: number;
    salon: number;
}

interface SalonesSinId {
    Ciudad: string;
    sede: string;
    direccion: string;
    estado: boolean;
    bloque: string;
    piso: number;
    aula: string;
    capacidad: number;
    pc: number;
    salon: number;
}

// manage the GET requests
export async function GET() {
    try {
        const [rows] = await connection.execute('SELECT * FROM salones');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the POST requests
export async function POST(req: NextRequest) {
    const salones: SalonesSinId = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM salones WHERE direccion = ? AND bloque = ? AND piso = ? AND aula = ?', [salones.direccion, salones.bloque, salones.piso, salones.aula]);
        const salonesExists = rows[0];
        if (salonesExists !== undefined) {
            return NextResponse.json({ message: 'Salon ya existe' }, { status: 400 });
        } else {
            await connection.execute('INSERT INTO salones (Ciudad, sede, direccion, estado, bloque, piso, aula, capacidad, pc, salon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [salones.Ciudad, salones.sede, salones.direccion, salones.estado, salones.bloque, salones.piso, salones.aula, salones.capacidad, salones.pc, salones.salon]);
            const [rows1] = await connection.execute('SELECT * FROM salones WHERE direccion = ? AND bloque = ? AND piso = ? AND aula = ?', [salones.direccion, salones.bloque, salones.piso, salones.aula]);
            return NextResponse.json(rows1, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the PUT requests
export async function PUT(req: NextRequest) {
    const salones: Salones = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM salones WHERE id = ?', [salones.id]);
        const salonesExists = rows[0];
        if (salonesExists === undefined) {
            return NextResponse.json({ message: 'Salon no existe' }, { status: 404 });
        } else {
            await connection.execute('UPDATE salones SET Ciudad = ?, sede = ?, direccion = ?, estado = ?, bloque = ?, piso = ?, aula = ?, capacidad = ?, pc = ?, salon = ? WHERE id = ?', [salones.Ciudad, salones.sede, salones.direccion, salones.estado, salones.bloque, salones.piso, salones.aula, salones.capacidad, salones.pc, salones.id, salones.salon]);
            return NextResponse.json({ message: 'Salon actualizado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// manage the DELETE requests
export async function DELETE(req: NextRequest) {
    const salones: Salones = await req.json();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM salones WHERE id = ?', [salones.id]);
        const salonesExists = rows[0];
        if (salonesExists === undefined) {
            return NextResponse.json({ message: 'Salon no existe' }, { status: 404 });
        } else {
            await connection.execute('DELETE FROM salones WHERE id = ?', [salones.id]);
            return NextResponse.json({ message: 'Salon eliminado' }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
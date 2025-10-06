export interface Division {
    id: number;
    name: string;
    parentDivision?: Division | null;
    subdivisions?: Division[];
    level: number;
    collaborators: number;
    ambassador?: string | null;
    isActive: boolean;
    checked?: boolean;
}

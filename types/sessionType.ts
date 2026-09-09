export interface SessionProps {
    accessToken: string;
    expires: string;
    user: {
        id: number | null;
        image: string;
        name: string;
        role: string;
    }
}
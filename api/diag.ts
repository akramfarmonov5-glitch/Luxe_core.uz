export default async function handler(req: any, res: any) {
    const getEnv = (key: string): string => {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key] as string;
        }
        return '';
    };

    res.status(200).json({
        has_supabase_url: !!getEnv('SUPABASE_URL'),
        has_vite_supabase_url: !!getEnv('VITE_SUPABASE_URL'),
        has_supabase_anon_key: !!getEnv('SUPABASE_ANON_KEY'),
        has_vite_supabase_key: !!getEnv('VITE_SUPABASE_KEY'),
        has_service_role_key: !!getEnv('SUPABASE_SERVICE_ROLE_KEY'),
        node_version: process.version,
        env_keys: Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('TOKEN') && !k.includes('SECRET')),
    });
}

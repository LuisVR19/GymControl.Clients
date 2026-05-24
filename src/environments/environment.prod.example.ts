// Template — used by CI/CD. Supply values via pipeline environment variables.
// environment.prod.ts is gitignored and must NOT be committed.
export const environment = {
  production: true,
  supabaseUrl: 'https://<your-project-ref>.supabase.co',
  supabaseKey: '<your-supabase-anon-key>',
};

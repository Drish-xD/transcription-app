import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create Supabase client for storage and auth
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Database client with connection pooling for Supabase
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });

const db = drizzle({ client, schema, casing: "snake_case" });

export { db, schema, supabaseClient };

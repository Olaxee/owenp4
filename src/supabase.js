
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://whdxywfgwbyfxbikoceo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZHh5d2Znd2J5ZnhiaWtvY2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjkxNjcsImV4cCI6MjA3NzUwNTE2N30.UMBwK_9nzui_ZvTcsLnlHFnLtwpB2B0AH3XhZ2VQLIQ'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
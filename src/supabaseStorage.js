import { createClient } from '@supabase/supabase-js';

// --- DÁN 2 GIÁ TRỊ NÀY SAU KHI TẠO PROJECT SUPABASE ---
// Vào Project Settings > API để lấy 2 giá trị này
const SUPABASE_URL = 'https://ethdiikzlwfrvuetwxar.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_pSFf3cne98bxhsgo76kjfA_Tc5FLqkB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gắn window.storage bằng bản lưu trên Supabase (theo từng tài khoản đăng nhập)
// Toàn bộ phần còn lại của app không cần sửa gì vì vẫn gọi window.storage.get/set/... như cũ.
export function installSupabaseStorage() {
  window.storage = {
    async get(key) {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error('not logged in');
      const { data, error } = await supabase
        .from('kv_store')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('not found');
      return { key, value: data.value };
    },
    async set(key, value) {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error('not logged in');
      const { error } = await supabase.from('kv_store').upsert(
        {
          user_id: user.id,
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,key' }
      );
      if (error) throw error;
      return { key, value };
    },
    async delete(key) {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error('not logged in');
      const { error } = await supabase
        .from('kv_store')
        .delete()
        .eq('user_id', user.id)
        .eq('key', key);
      if (error) throw error;
      return { key, deleted: true };
    },
    async list(prefix) {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error('not logged in');
      let query = supabase
        .from('kv_store')
        .select('key')
        .eq('user_id', user.id);
      if (prefix) query = query.like('key', `${prefix}%`);
      const { data, error } = await query;
      if (error) throw error;
      return { keys: (data || []).map((r) => r.key), prefix };
    },
  };
}

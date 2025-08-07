import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useAvatarUrl(avatarPath: string | null) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (avatarPath) {
      downloadImage(avatarPath);
    } else {
      setAvatarUrl(null);
    }
  }, [avatarPath]);

  async function downloadImage(path: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
        setLoading(false);
      };
    } catch (error) {
      console.log("Error downloading image: ", error);
      setAvatarUrl(null);
      setLoading(false);
    }
  }

  return { avatarUrl, loading };
}
import { getSupabaseClient } from './supabaseClient';
import { Comment } from '@adsspot/types';

/**
 * Toggle Like on a Post (Supabase Cloud + Local sync)
 */
export async function toggleLikePost(userId: string, postId: string, currentLikedState: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  try {
    if (!currentLikedState) {
      // Add like
      const { error } = await supabase.from('likes').insert([{ user_id: userId, post_id: postId }]);
      if (error && error.code !== '23505') {
        console.warn('Supabase insert like warning:', error.message);
      }
      return true;
    } else {
      // Remove like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
      if (error) {
        console.warn('Supabase delete like warning:', error.message);
      }
      return false;
    }
  } catch (err) {
    console.warn('Fallback to local like state toggle:', err);
    return !currentLikedState;
  }
}

/**
 * Fetch Comments for a Post
 */
export async function fetchPostComments(postId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient();
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as Comment[];
  } catch (err) {
    return [];
  }
}

/**
 * Add Comment to a Post
 */
export async function addCommentToPost(userId: string, postId: string, content: string): Promise<Comment | null> {
  const supabase = getSupabaseClient();
  try {
    const newComment = {
      id: `comm-${Date.now()}`,
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select('*, user:users(*)')
      .single();

    if (error || !data) {
      return newComment as Comment;
    }
    return data as Comment;
  } catch (err) {
    return {
      id: `comm-${Date.now()}`,
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    };
  }
}

/**
 * Toggle Save/Bookmark Post
 */
export async function toggleSavePost(userId: string, postId: string, isSaved: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  try {
    if (!isSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .insert([{ user_id: userId, post_id: postId }]);
      if (error && error.code !== '23505') {
        console.warn('Supabase insert saved_post warning:', error.message);
      }
      return true;
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
      if (error) {
        console.warn('Supabase delete saved_post warning:', error.message);
      }
      return false;
    }
  } catch (err) {
    return !isSaved;
  }
}

/**
 * Toggle Follow Business
 */
export async function toggleFollowBusiness(userId: string, businessId: string, isFollowing: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  try {
    if (!isFollowing) {
      const { error } = await supabase
        .from('follows')
        .insert([{ user_id: userId, business_id: businessId }]);
      if (error && error.code !== '23505') {
        console.warn('Supabase insert follow warning:', error.message);
      }
      return true;
    } else {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('user_id', userId)
        .eq('business_id', businessId);
      if (error) {
        console.warn('Supabase delete follow warning:', error.message);
      }
      return false;
    }
  } catch (err) {
    return !isFollowing;
  }
}

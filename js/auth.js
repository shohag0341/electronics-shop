// Authentication Module
import { supabaseClient } from './supabaseClient.js';

/**
 * Login with email and password
 */
export async function login(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) throw error;

    // Get user role from profiles table
    const role = await getUserRole(data.user.id);

    return {
      success: true,
      user: data.user,
      role: role || 'staff'
    };
  } catch (error) {
    console.error('Login error:', error.message);
    return {
      success: false,
      message: error.message || 'লগইন ব্যর্থ হয়েছে'
    };
  }
}

/**
 * Logout
 */
export async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Session error:', error.message);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get user error:', error.message);
    return null;
  }
}

/**
 * Get user role from profiles table
 */
export async function getUserRole(userId) {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('role, full_name')
      .eq('id', userId)
      .single();

    if (error) {
      // If profiles table doesn't exist or no row, default to staff
      console.warn('Could not fetch role:', error.message);
      return 'staff';
    }

    return data?.role || 'staff';
  } catch (error) {
    console.error('Role fetch error:', error.message);
    return 'staff';
  }
}

/**
 * Password reset request
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/reset-password.html'
    });

    if (error) throw error;

    return {
      success: true,
      message: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে'
    };
  } catch (error) {
    console.error('Password reset error:', error.message);
    return {
      success: false,
      message: error.message || 'পাসওয়ার্ড রিসেট অনুরোধ ব্যর্থ হয়েছে'
    };
  }
}

/**
 * Protect page - redirect to login if not authenticated
 * Call this at the top of protected pages
 */
export async function protectPage(allowedRoles = ['admin', 'staff']) {
  const session = await getSession();

  if (!session) {
    window.location.href = 'index.html';
    return null;
  }

  const role = await getUserRole(session.user.id);

  if (!allowedRoles.includes(role)) {
    // Role not allowed
    alert('আপনার এই পেজে প্রবেশের অনুমতি নেই');
    window.location.href = 'index.html';
    return null;
  }

  return {
    user: session.user,
    role: role
  };
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  const role = await getUserRole(user.id);
  return role === 'admin';
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BusinessDetails, TransporterDetails, DriverDetails, UserRole } from '../types';
import { mockStore } from '../lib/mockStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  businessDetails: BusinessDetails | null;
  transporterDetails: TransporterDetails | null;
  driverDetails: DriverDetails | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendConnected: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    role: UserRole;
    business_name?: string;
    company_name?: string;
    license_number?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'loadsaathi_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [transporterDetails, setTransporterDetails] = useState<TransporterDetails | null>(null);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile from supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile);
              // Fetch role-specific details
              if (profile.role === 'business') {
                const { data: bz } = await supabase.from('businesses').select('*').eq('user_id', profile.id).single();
                if (bz) setBusinessDetails(bz);
              } else if (profile.role === 'transporter') {
                const { data: tr } = await supabase.from('transporters').select('*').eq('user_id', profile.id).single();
                if (tr) setTransporterDetails(tr);
              } else if (profile.role === 'driver') {
                const { data: dr } = await supabase.from('drivers').select('*').eq('user_id', profile.id).single();
                if (dr) setDriverDetails(dr);
              }
              setIsLoading(false);
              return;
            }
          }
        }

        // Local / Demo Session check
        const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUserId) {
          const userObj = mockStore.findUserById(savedUserId);
          if (userObj) {
            setUser(userObj.profile);
            setBusinessDetails(userObj.business || null);
            setTransporterDetails(userObj.transporter || null);
            setDriverDetails(userObj.driver || null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, _password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _password,
        });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            setUser(profile);
            if (profile.role === 'business') {
              const { data: bz } = await supabase.from('businesses').select('*').eq('user_id', profile.id).single();
              setBusinessDetails(bz || null);
            } else if (profile.role === 'transporter') {
              const { data: tr } = await supabase.from('transporters').select('*').eq('user_id', profile.id).single();
              setTransporterDetails(tr || null);
            } else if (profile.role === 'driver') {
              const { data: dr } = await supabase.from('drivers').select('*').eq('user_id', profile.id).single();
              setDriverDetails(dr || null);
            }
            return { success: true };
          }
        }
      }

      // Fallback / Demo Store Login
      const userObj = mockStore.findUserByEmail(email);
      if (!userObj) {
        return { success: false, error: 'No account registered with this email address.' };
      }

      if (!userObj.profile.is_active) {
        return { success: false, error: 'This account has been suspended by administration.' };
      }

      setUser(userObj.profile);
      setBusinessDetails(userObj.business || null);
      setTransporterDetails(userObj.transporter || null);
      setDriverDetails(userObj.driver || null);

      if (rememberMe) {
        localStorage.setItem(CURRENT_USER_KEY, userObj.profile.id);
      } else {
        sessionStorage.setItem(CURRENT_USER_KEY, userObj.profile.id);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    role: UserRole;
    business_name?: string;
    company_name?: string;
    license_number?: string;
  }) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              phone: data.phone,
              role: data.role
            }
          }
        });

        if (authErr) throw authErr;
        if (authData.user) {
          // Profile inserted via trigger or manual insert
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            role: data.role,
            is_active: true
          });

          if (data.role === 'business') {
            await supabase.from('businesses').insert({
              user_id: authData.user.id,
              business_name: data.business_name || `${data.full_name}'s Enterprise`,
              business_type: 'Logistics Shipper'
            });
          } else if (data.role === 'transporter') {
            await supabase.from('transporters').insert({
              user_id: authData.user.id,
              company_name: data.company_name || `${data.full_name} Freight`,
              verification_status: 'pending'
            });
          } else if (data.role === 'driver') {
            await supabase.from('drivers').insert({
              user_id: authData.user.id,
              license_number: data.license_number || 'DL-PENDING',
              verification_status: 'pending'
            });
          }
        }
      }

      // Also register in mock store for instant reactivity
      const newUserObj = mockStore.registerUser(data);
      setUser(newUserObj.profile);
      setBusinessDetails(newUserObj.business || null);
      setTransporterDetails(newUserObj.transporter || null);
      setDriverDetails(newUserObj.driver || null);
      localStorage.setItem(CURRENT_USER_KEY, newUserObj.profile.id);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
      }
      return { 
        success: true, 
        message: `Password reset instructions have been dispatched to ${email}.` 
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send reset email.' };
    }
  };

  const resetPassword = async (_password: string) => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.updateUser({ password: _password });
      }
      return { success: true, message: 'Password has been updated successfully.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update password.' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut error', e);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setBusinessDetails(null);
    setTransporterDetails(null);
    setDriverDetails(null);
  };

  const switchDemoUser = (role: UserRole) => {
    const userMap: Record<UserRole, string> = {
      business: 'usr-biz-01',
      transporter: 'usr-trans-01',
      driver: 'usr-drv-01',
      admin: 'usr-adm-01'
    };
    const targetUserId = userMap[role];
    const userObj = mockStore.findUserById(targetUserId);
    if (userObj) {
      setUser(userObj.profile);
      setBusinessDetails(userObj.business || null);
      setTransporterDetails(userObj.transporter || null);
      setDriverDetails(userObj.driver || null);
      localStorage.setItem(CURRENT_USER_KEY, userObj.profile.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        businessDetails,
        transporterDetails,
        driverDetails,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        isBackendConnected: isSupabaseConfigured,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


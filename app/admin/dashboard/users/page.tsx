'use client';

import { useState, useEffect } from 'react';
import { FetchUsers, UpdateUserRole, UserListProp } from '@/lib/api/userService';
import { Shield, ShieldAlert, User, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function UsersPage() {
  const [users, setUsers] = useState<UserListProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await FetchUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        setStatusType('error');
        setStatusMessage('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleRoleToggle = async (user: UserListProp) => {
    // Role 1 = Admin, Role 2 = Customer
    const newRoleId = user.role_id === 1 ? 2 : 1;
    const newRoleName = newRoleId === 1 ? 'Admin' : 'Customer';
    
    try {
      await UpdateUserRole(user.id, newRoleId);
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, role_id: newRoleId, role: { ...u.role!, role_name: newRoleName } } : u
      ));
      setStatusType('success');
      setStatusMessage(`${user.name} is now an ${newRoleName}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      setStatusType('error');
      setStatusMessage(error.message || 'Failed to update user role');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-[#d9e3f4] h-full">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Users & Roles</h1>
        <p className="text-[#a6a7a6] text-sm mt-1">
          Manage customer accounts and assign administrator privileges.
        </p>
      </div>

      {/* FILTER */}
      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl p-4 flex flex-col gap-y-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a6a7a6]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a1420] border border-[#303a47] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb77c]/50 transition-colors"
          />
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl flex flex-col flex-1 overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 p-5 border-b border-[#2c3542] items-center bg-[#16202c]">
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">User</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Email Address</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Joined</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Role</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider text-right pr-4">Action</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-[#a6a7a6]">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-[#a6a7a6]">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 p-5 items-center border-b border-[#212b37] hover:bg-[#16202c]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#212b37] flex items-center justify-center text-[#ffb77c] font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-white font-bold text-sm">{user.name}</span>
                </div>
                <div className="text-[#a6a7a6] text-sm truncate">{user.email}</div>
                <div className="text-[#a6a7a6] text-xs">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${
                    user.role_id === 1 
                    ? 'bg-[#1a2e1d] border-emerald-500/20 text-emerald-400' 
                    : 'bg-[#212b37] border-[#303a47] text-[#a6a7a6]'
                  }`}>
                    {user.role_id === 1 ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role?.role_name || (user.role_id === 1 ? 'Admin' : 'Customer')}
                  </span>
                </div>
                <div className="flex justify-end pr-2">
                  <button
                    onClick={() => handleRoleToggle(user)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      user.role_id === 1 
                      ? 'bg-[#2e1a1a] text-[#ffb4ab] hover:bg-[#ffb4ab]/10 border border-[#ffb4ab]/20' 
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                  >
                    {user.role_id === 1 ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Revoke Admin
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        Make Admin
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
              statusType === 'success' ? 'bg-[#1a2e1d] border-emerald-500/30' : 'bg-[#2e1a1a] border-[#ffb4ab]/30'
            }`}
          >
            {statusType === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#ffb4ab] shrink-0" />
            )}
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${statusType === 'success' ? 'text-emerald-400' : 'text-[#ffb4ab]'} uppercase tracking-wider`}>
                {statusType === 'success' ? 'Success' : 'Error'}
              </span>
              <p className="text-white text-sm font-medium mt-0.5">{statusMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

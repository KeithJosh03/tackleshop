'use client';

import React from 'react';
import { UserListProp } from '@/lib/api/userService';
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react';

type UserListItemProps = {
    user: UserListProp;
    onRoleToggle: (user: UserListProp) => void;
};

export const UserListItem = ({ user, onRoleToggle }: UserListItemProps) => {
    const isAdmin = user.role_id === 1;
    const roleName = user.role?.role_name || (isAdmin ? 'Admin' : 'Customer');

    return (
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 p-5 items-center border-b border-[#212b37] hover:bg-[#16202c]/50 transition-colors">
            {/* User Name & Avatar */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#212b37] flex items-center justify-center text-[#ffb77c] font-bold uppercase shrink-0">
                    {user.name.charAt(0)}
                </div>
                <span className="text-white font-bold text-sm truncate">{user.name}</span>
            </div>

            {/* Email Address */}
            <div className="text-[#a6a7a6] text-sm truncate">{user.email}</div>

            {/* Joined Date */}
            <div className="text-[#a6a7a6] text-xs">
                {new Date(user.created_at).toLocaleDateString()}
            </div>

            {/* Role Badge */}
            <div>
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${isAdmin
                        ? 'bg-[#1a2e1d] border-emerald-500/20 text-emerald-400'
                        : 'bg-[#212b37] border-[#303a47] text-[#a6a7a6]'
                        }`}
                >
                    {isAdmin ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {roleName}
                </span>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pr-2">
                <button
                    onClick={() => onRoleToggle(user)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${isAdmin
                        ? 'bg-[#2e1a1a] text-[#ffb4ab] hover:bg-[#ffb4ab]/10 border border-[#ffb4ab]/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        }`}
                >
                    {isAdmin ? (
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
    );
};
import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { mockStore } from '../../lib/mockStorage';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Briefcase,
  Truck,
  Check,
  X
} from 'lucide-react';
import { VerificationStatus } from '../../types';

export const UserManagementPage: React.FC = () => {
  const { verifyTransporter, toggleUserActive } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const allUsers = mockStore.getUsers();

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.business?.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.transporter?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' || u.profile.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleToggleActive = async (userId: string) => {
    await toggleUserActive(userId);
  };

  const handleVerifyTransporter = async (transporterId: string, status: VerificationStatus) => {
    await verifyTransporter(transporterId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User & Account Administration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          KYC verification, transporter approvals, and account access controls
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['ALL', 'business', 'transporter', 'driver'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                roleFilter === r
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Business / Organization</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => {
                const isTransporter = u.profile.role === 'transporter';
                const transporter = u.transporter;

                return (
                  <tr key={u.profile.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{u.profile.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.profile.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {u.profile.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {u.business?.business_name ? (
                        <div>
                          <div className="font-bold text-slate-800">{u.business.business_name}</div>
                          <div className="text-[10px] text-slate-400">{u.business.city || 'Delhi NCR'}</div>
                        </div>
                      ) : u.transporter?.company_name ? (
                        <div>
                          <div className="font-bold text-slate-800">{u.transporter.company_name}</div>
                          <div className="text-[10px] text-slate-400">{u.transporter.fleet_size} Trucks in Fleet</div>
                        </div>
                      ) : u.driver?.license_number ? (
                        <div className="font-mono text-slate-600">
                          License: {u.driver.license_number}
                        </div>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono">
                      {u.profile.phone || '+91 98000 00000'}
                    </td>
                    <td className="py-4 px-4">
                      {isTransporter && transporter ? (
                        <StatusBadge status={transporter.verification_status} />
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">&check; Active User</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.profile.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.profile.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isTransporter && transporter && transporter.verification_status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyTransporter(transporter.id, 'verified')}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition"
                            title="Verify Transporter"
                          >
                            Approve KYC
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleActive(u.profile.id)}
                          className={`px-2.5 py-1 rounded font-bold text-[11px] transition ${
                            u.profile.is_active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.profile.is_active ? 'Suspend' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


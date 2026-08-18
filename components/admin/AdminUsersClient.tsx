'use client';

import React, { useState, useTransition } from 'react';
import {
  MdPeople,
  MdSearch,
  MdShield,
  MdPerson,
  MdCheckCircle,
  MdOutlineMarkEmailRead,
  MdShoppingBag,
  MdClose,
  MdSwapHoriz,
} from 'react-icons/md';
import { Role } from '@prisma/client';
import { updateUserRoleAction } from '@/src/actions/admin/users';

interface UserData {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  emailVerified?: Date | string | null;
  createdAt: Date | string;
  ordersCount: number;
  totalSpent: number;
  defaultPhone: string;
  defaultZone: string;
}

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: UserData[];
}) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newRoleInput, setNewRoleInput] = useState<Role>('CUSTOMER');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtrado
  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q));

    return matchesRole && matchesSearch;
  });

  const openRoleModal = (user: UserData) => {
    setSelectedUser(user);
    setNewRoleInput(user.role);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      try {
        const res = await updateUserRoleAction(selectedUser.id, newRoleInput);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRoleInput } : u))
          );
          setSuccessMsg(`¡Rol de ${selectedUser.email} cambiado a ${newRoleInput}!`);
          setTimeout(() => setSelectedUser(null), 1200);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al actualizar el rol');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdPeople className="text-[#72594e]" />
            <span>Gestión de Usuarios & Roles ({filteredUsers.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Administra la base de clientes registrados y concede o remueve permisos de Administrador.
          </p>
        </div>
      </div>

      {/* CONTENEDOR CON TABS Y TABLA */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
        {/* TABS DE ROL */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-100">
          {[
            { key: 'ALL', label: 'Todos los Usuarios' },
            { key: 'ADMIN', label: '🛡️ Administradores' },
            { key: 'CUSTOMER', label: '👤 Clientes Registrados' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedRole(tab.key)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRole === tab.key
                  ? 'bg-[#72594e] text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BÚSQUEDA */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuario por nombre o correo electrónico..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-stone-200/60 text-stone-700 flex items-center justify-center mx-auto text-xl">
              👥
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              No se encontraron usuarios
            </h3>
            <p className="text-xs text-stone-500">
              No hay cuentas registradas que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Usuario</th>
                  <th className="px-3.5 py-2.5">Rol de Acceso</th>
                  <th className="px-3.5 py-2.5">Estado Email</th>
                  <th className="px-3.5 py-2.5">Compras Realizadas</th>
                  <th className="px-3.5 py-2.5">Total Invertido</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((user) => {
                  const initial = (user.name || user.email)[0].toUpperCase();
                  const isAdmin = user.role === 'ADMIN';

                  return (
                    <tr key={user.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-[6px] font-bold text-xs flex items-center justify-center text-white shrink-0 ${
                              isAdmin ? 'bg-[#72594e]' : 'bg-stone-600'
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-stone-800 flex items-center gap-1">
                              <span>{user.name || 'Sin Nombre'}</span>
                            </div>
                            <div className="text-[11px] text-stone-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3.5 py-3">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 rounded-[4px]">
                            <MdShield className="text-xs text-[#206776]" />
                            <span>ADMINISTRADOR</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 rounded-[4px]">
                            <MdPerson className="text-xs text-stone-500" />
                            <span>CLIENTE</span>
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-3">
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                            <MdCheckCircle className="text-xs text-emerald-600" />
                            <span>Verificado</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-3 font-semibold text-stone-800">
                        <div className="flex items-center gap-1">
                          <MdShoppingBag className="text-stone-400 text-sm" />
                          <span>{user.ordersCount} pedidos</span>
                        </div>
                      </td>

                      <td className="px-3.5 py-3 font-bold text-stone-800">
                        ${user.totalSpent.toFixed(2)}
                      </td>

                      <td className="px-3.5 py-3 text-right">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-[6px] transition-colors flex items-center gap-1 ml-auto border border-stone-200/80"
                        >
                          <MdSwapHoriz className="text-sm" />
                          <span>Cambiar Rol</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE CAMBIO DE ROL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdShield className="text-[#206776]" />
                <span>Asignar Rol de Acceso</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-emerald-800 text-xs font-semibold">
                ✅ {successMsg}
              </div>
            )}

            <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-[8px] text-xs space-y-1">
              <p className="text-stone-500 font-semibold">Usuario Seleccionado:</p>
              <p className="font-bold text-stone-800">{selectedUser.name || 'Sin Nombre'}</p>
              <p className="text-stone-600 font-mono">{selectedUser.email}</p>
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Selecciona el Nuevo Rol *
                </label>
                <select
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value as Role)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-semibold"
                >
                  <option value="CUSTOMER">👤 CLIENTE (Acceso estándar a tienda)</option>
                  <option value="ADMIN">🛡️ ADMINISTRADOR (Acceso total al Panel Admin)</option>
                </select>
              </div>

              <p className="text-[11px] text-stone-500 bg-amber-50 p-2.5 rounded-[6px] border border-amber-200/70 text-amber-900">
                💡 Los usuarios con rol <strong>ADMINISTRADOR</strong> pueden editar el catálogo, procesar pedidos y modificar configuraciones del negocio.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : 'Confirmar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

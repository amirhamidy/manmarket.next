"use client";

import { useState, useEffect } from "react";
import AddressHeader from "@/components/ProfileComponents/address/AddressHeader";
import AddNewAddressCard from "@/components/ProfileComponents/address/AddNewAddressCard";
import AddressModal from "@/components/ProfileComponents/address/AddressModal";
import DeleteConfirmModal from "@/components/ProfileComponents/address/DeleteConfirmModal";
import {
  UserAddressCard,
  UserAddressCardSkeleton,
  EmptyAddressCard,
} from "@/components/ProfileComponents/address/UserAddressCard";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function AddressPage() {
  const { theme } = useTheme();
  const { accessToken, api } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const bgColor = theme === "dark" ? "#000" : "#fff";
  useEffect(() => {
    const testAddress = async () => {
      try {
        const { data } = await api.get(
          "https://api.manmarket.ir/dashboard/v1/user/address/",
        );
        console.log("آدرس‌ها:", data.results);
      } catch (error) {
        console.error(error);
      }
    };
    testAddress();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "https://api.manmarket.ir/dashboard/v1/user/address/",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setAddresses(res.data?.results || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchAddresses();
  }, [accessToken]);

  const handleDelete = async (id) => {
    await api.delete(
      `https://api.manmarket.ir/dashboard/v1/user/address/${id}/`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setDeleteTarget(null);
    fetchAddresses();
  };

  const handleEdit = (addr) => {
    setEditAddress(addr);
    setModalOpen(true);
  };

  return (
    <div className="flex justify-center" style={{ backgroundColor: bgColor }}>
      <main className="flex flex-col w-full max-w-[556px] items-center">
        <div className="w-full text-end">
          <AddressHeader />
        </div>
        {loading ? (
          <UserAddressCardSkeleton />
        ) : addresses.length === 0 ? (
          <EmptyAddressCard />
        ) : (
          addresses.map((addr) => (
            <UserAddressCard
              key={addr.id}
              data={addr}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))
        )}

        <AddNewAddressCard
          onClick={() => {
            setEditAddress(null);
            setModalOpen(true);
          }}
        />

        <AddressModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchAddresses}
          initialData={editAddress}
        />

        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget)}
        />
      </main>
    </div>
  );
}

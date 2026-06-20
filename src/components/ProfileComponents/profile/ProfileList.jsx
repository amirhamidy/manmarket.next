"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileListItem from "./ProfileListItem";
import Icons from "./profileIcons";
import { useAuth } from "@/context/AuthContext";
import LogoutModal from "./logoutModal";

export default function ProfileList({ profileData }) {
  const icons = Icons();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [openLogout, setOpenLogout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirmLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <ul dir="rtl" className="flex flex-col px-4 mt-3 gap-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <li key={idx} className="flex items-center gap-3 m-2">
            <div className="w-6 h-6 rounded-full mt-1 bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-6 w-full bg-gray-300 mt-1 dark:bg-gray-700 rounded animate-pulse" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul dir="rtl" className="flex flex-col px-4 mt-3 pb-[18%]">

        <li>
          <Link href="profile/details">
            <ProfileListItem icon={icons.orders} title="مشخصات" />
          </Link>
        </li>

        <li>
          <Link href="profile/cart">
            <ProfileListItem icon={icons.CartIcon} title="سبد خرید" />
          </Link>
        </li>

        <li>
          <Link href="profile/order">
            <ProfileListItem icon={icons.orders} title="سفارشات" />
          </Link>
        </li>

        <li>
          <Link href="profile/favorites">
            <ProfileListItem icon={icons.favorites} title="سبک من" />
          </Link>
        </li>

        {/* <li>
          <Link href="profile/wallet">
            <ProfileListItem icon={icons.payment} title="کیف پول" />
          </Link>
        </li> */}

        <li>
          <Link href="profile/address">
            <ProfileListItem icon={icons.MapIcon} title="آدرس" danger />
          </Link>
        </li>

        <li onClick={() => setOpenLogout(true)}>
          <ProfileListItem icon={icons.logout} title="خروج" danger />
        </li>

      </ul>

      <LogoutModal
        isOpen={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

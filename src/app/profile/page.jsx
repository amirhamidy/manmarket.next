"use client";

import Navbar from "@/base/navbar";
import ProfileAvatar from "@/components/ProfileComponents/profile/ProfileAvatar";
import ProfileHeader from "@/components/ProfileComponents/profile/ProfileHeader";
import ProfileList from "@/components/ProfileComponents/profile/ProfileList";

import { useRouter } from "next/navigation";

export default function ProfilePage() {


    return (
        <section className="w-full flex justify-center">
            <main dir="ltr" className="w-full max-w-[556px]">
                    <ProfileHeader />
                <ProfileAvatar imageSrc="/images/profile.jpg" />
                <ProfileList />
            </main>
            <Navbar activeItem="profile" />
        </section>
    );
}

"use client"

import FaceBokIcon from "@/components/icons/facebokIcon"
import TelegramIcon from "@/components/icons/telegramIcon"
import YouTubeIcon from "@/components/icons/youtubeIcon"
import Link from "next/link"

const { default: InstagramIcon } = require("@/components/icons/instagramIcon")



const Footer = () => {
    return (
        <div>
            <h4 className="text-dark my-10 text-nowrap text-center">
                ارزش شما برای ما بینهایت است
            </h4>
            <div className="flex justify-center flex-col items-center max-w-[556px] w-full mt-3">
                <div className="flex justify-center gap-4 items-center">
                    <Link href="https://www.instagram.com/manmarket_ir/" className="cs-in text-white p-2 rounded-full">
                        <InstagramIcon />
                    </Link>
                    <Link href="https://t.me/Manmarket_ir" className="cs-tl text-white p-2 rounded-full">
                        <TelegramIcon />
                    </Link>
                </div>
            </div>
            <div className="flex justify-center px-5 flex-wrap mt-7">
                <span className="w-[30%] p-4 shadow m-1 rounded-xl">
                    <Link href="https://qr.mojavez.ir/track/11011459" target="_blank">
                        <img className="w-full" src="/assets/en/e_namad.png" />
                    </Link>
                </span>
                <span className="w-[30%] p-4 shadow m-1 rounded-xl">
                    <Link href="https://trustseal.enamad.ir/?id=527464&Code=pPrrLy886QxLMhLkgAStOwlJBtPaDni4" target="_blank">
                        <img className="w-full" src="/assets/en/e_namd5.png" />
                    </Link>
                </span>
                <span className="w-[30%] p-4 shadow m-1 rounded-xl">
                    <Link href="https://logo.samandehi.ir/Verify.aspx?id=372520&p=xlaojyoeuiwkdshwuiwkobpd" target="_blank">
                        <img className="w-full" src="/assets/en/e_namd6.png" />
                    </Link>
                </span>

            </div>
        </div>
    )
}

export default Footer
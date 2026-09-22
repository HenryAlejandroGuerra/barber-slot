/* ================================================
    web/src/components/layout/PublicFooter.tsx
    Diseño del Footer Público
================================================ */
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
    {
        name: "Facebook",
        href: "#",
        icon: "/images/social/facebook.svg"
    },
    {
        name: "WhatsApp",
        href: "#",
        icon: "/images/social/whatsapp.svg"
    },
    {
        name: "Instagram",
        href: "#",
        icon: "/images/social/instagram.svg"
    }
];

export default function Footer() {
    return (
        <footer className="footer-base">
            <div className="app-container flex flex-col items-center justify-between gap-6 md:flex-row">
                <p className="font-bold">
                    Lun-sab 9:00am-5:00pm, Santa Tecla
                </p>

                <div className="flex items-center gap-3">
                    {socialLinks.map((social) => (
                        <Link key={social.name}
                                href={social.href}
                                aria-label={social.name}
                                className="transition hover:scale-105" >
                            <Image src={social.icon}
                                    alt={social.name}
                                    width={48}
                                    height={48} />
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}

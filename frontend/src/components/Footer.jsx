import { IoIosMail } from "react-icons/io";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="Footer">
            <span>&copy; {new Date().getFullYear()} Ben Du</span>
            <div className="Footer-socials">
                <a
                    aria-label="GitHub"
                    href="https://github.com/ben-du1"
                    rel="noreferrer"
                    target="_blank"
                >
                    <FaGithub />
                </a>
                <a
                    aria-label="LinkedIn"
                    href="https://linkedin.com/in/bingzhoudu"
                    rel="noreferrer"
                    target="_blank"
                >
                    <FaLinkedin />
                </a>
                <a aria-label="Email" href="mailto:bennybob156@gmail.com">
                    <IoIosMail />
                </a>
            </div>
        </footer>
    )
}

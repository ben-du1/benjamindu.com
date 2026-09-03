import { Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosMail } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import {useEffect, useRef, useState} from 'react'

export default function Nav() {

    const [menuOpen,setMenuOpen] = useState(false)
    const [logoText, setLogoText] = useState("ben du")
    const [logoGlitching, setLogoGlitching] = useState(false)
    const logoAnimation = useRef(null)
    const logoStopTimeout = useRef(null)
    const logoHovered = useRef(false)
    const unicodeCharacters = "あЖ中∆ΩЖλ¤§※░▒▓█<>/\\\\|{}[]()$#@!?";

    const startLogoAnimation = (automatic = false) => {
        if (logoAnimation.current) {
            return
        }

        setLogoGlitching(true)
        logoAnimation.current = setInterval(() => {
            setLogoText(
                Array.from("ben du", (_, index) =>
                    Math.random() > 0.2
                        ? unicodeCharacters[Math.floor(Math.random() * unicodeCharacters.length)]
                        : "ben du"[index]
                ).join("")
            )
        }, 55)

        if (automatic) {
            logoStopTimeout.current = setTimeout(() => {
                if (!logoHovered.current) {
                    stopLogoAnimation()
                }
            }, 350)
        }
    }

    const stopLogoAnimation = () => {
        clearInterval(logoAnimation.current)
        clearTimeout(logoStopTimeout.current)
        logoAnimation.current = null
        logoStopTimeout.current = null
        setLogoGlitching(false)
        setLogoText("ben du")
    }

    useEffect(() => {
        const randomGlitch = setInterval(() => {
            if (Math.random() < 0.2) {
                startLogoAnimation(true)
            }
        }, 1000)

        return () => {
            clearInterval(randomGlitch)
            clearInterval(logoAnimation.current)
            clearTimeout(logoStopTimeout.current)
        }
    }, [])
    
    return (
        <div className="Nav">
            <Link
                to="/"
                onMouseEnter={() => {
                    logoHovered.current = true
                    startLogoAnimation()
                }}
                onMouseLeave={() => {
                    logoHovered.current = false
                    stopLogoAnimation()
                }}
            >
                <h1>
                    <b>&lt;</b>
                    <span className={`logo-name ${logoGlitching ? "glitching" : ""}`}>
                        <span className="logo-name-base">ben du</span>
                        <span className="logo-name-glitch">{logoText}</span>
                    </span>
                    <b>/&gt;</b>
                </h1>
            </Link>
            <i className={menuOpen ? "opened" : ''} onClick={() => setMenuOpen(!menuOpen)}><GiHamburgerMenu color="white" size={42}/></i>
            <li >
                {/* <h2><b>/</b>about</h2>
                <Link to="/console"><h2><b>/</b>extras</h2></Link> */}
                <div class="socials">
                    <a target="_blank" href="https://github.com/ben-du1"><FaGithub size={35} /></a>
                    <a target="_blank" href="https://linkedin.com/in/bingzhoudu"><FaLinkedin size={35} /></a>
                    <a target="_blank" href="mailto:bennybob156@gmail.com"><IoIosMail size={49} /></a>
                </div>
            </li>
            
            <style>
                {`
                @media (max-width:600px) {
                    .Nav li {
                        display: ${menuOpen ? 'block' : 'none'};
                    }
                
                }
                `}
            </style>
        </div>
    )
}
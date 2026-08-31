import { Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosMail } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import {useState} from 'react'

export default function Nav() {

    const [menuOpen,setMenuOpen] = useState(false)
    
    return (
        <div className="Nav">
            <Link to="/"><h1><b>&lt;</b>ben du<b>/&gt;</b></h1></Link>
            <i className={menuOpen ? "opened" : ''} onClick={() => setMenuOpen(!menuOpen)}><GiHamburgerMenu color="white" size={42}/></i>
            <li >
                {/* <h2><b>/</b>about</h2>
                <Link to="/console"><h2><b>/</b>extras</h2></Link> */}
                <div class="socials">
                    <a target="_blank" href="https://github.com/ben-du1"><FaGithub color="mediumorchid" size={35} /></a>
                    <a target="_blank" href="https://linkedin.com/in/bingzhoudu"><FaLinkedin color="mediumorchid" size={35} /></a>
                    <a target="_blank" href="mailto:bennybob156@gmail.com"><IoIosMail color="mediumorchid" size={49} /></a>
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
import { useState,useEffect } from "react"
import SERVER_URL from "../lib/SERVER_URL"
import Media from "./components/Media"

export default function ManageMedia({show}) {
    const [files,setFiles] = useState([])

    const getFiles = async () => {
        const response = await fetch(SERVER_URL+'/files',{method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({
                'password':sessionStorage.getItem('password')
            })
        })
        const data = await response.json()
        setFiles(data)
    }

    useEffect(() => {
        getFiles()
    },[])


    return (
        <div className="ManageMedia">
            {
                show ? 
                (<>
                {files.map((file) => (
                <Media key={file} fileName={file}/>
                ))}
                </>)
                :
                ''
            }
        </div>
    )
}
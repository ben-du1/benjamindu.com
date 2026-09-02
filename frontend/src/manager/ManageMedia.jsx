import { useState,useEffect } from "react"
import SERVER_URL from "../lib/SERVER_URL"
import Media from "./components/Media"

export default function ManageMedia({show, refreshKey}) {
    const [files,setFiles] = useState([])
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(true)

    const getFiles = async () => {
        setLoading(true)
        try {
            const response = await fetch(SERVER_URL+'/files',{method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({
                    'password':sessionStorage.getItem('password')
                })
            })
            if (!response.ok) throw new Error('Failed to load media')
            const data = await response.json()
            setFiles(data)
            setFeedback('')
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFiles()
    },[refreshKey])


    return (
        <div className="ManageMedia">
            {show ?
                loading ? <p className="console-feedback">Loading media...</p> :
                (<>
                {feedback && <p className="console-feedback">{feedback}</p>}
                {files.map((file) => (
                <Media key={file} fileName={file} onDeleted={(deletedFile) => setFiles((current) => current.filter((file) => file !== deletedFile))}/>
                ))}
                </>)
                :
                ''
            }
        </div>
    )
}
import { useEffect,useState } from "react";
import SERVER_URL from "../../lib/SERVER_URL";

export default function Media({fileName, onDeleted}) {

    const [isImage,setIsImage] = useState(false)
    const [deleting,setDeleting] = useState(false)
    const [feedback,setFeedback] = useState('')

    useEffect(() => {
        const fileType = fileName.split('.').at(-1).toLowerCase()
        setIsImage(['jpeg','png','jpg','svg','gif','webp'].includes(fileType))
    },[])

    const deleteMedia = async () => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
            return
        }

        setDeleting(true)
        setFeedback('')
        try {
            const response = await fetch(SERVER_URL+"/deletefile",{
                method:"POST",
                headers:{'content-type':'application/json'},
                body: JSON.stringify({
                    "fileName":fileName,
                    'password':sessionStorage.getItem('password')
                })
            })
            if (!response.ok) throw new Error('Failed to delete media')
            if (onDeleted) onDeleted(fileName)
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="Media" id={fileName}>
            {isImage ? 
                <img src={`${SERVER_URL}/file/${fileName}`}/>
            :
                <h3 className={isImage ? '' :'default'}>{fileName}</h3>
            }
            <footer>
                <button onClick={() => navigator.clipboard.writeText(`${SERVER_URL}/file/${fileName}`)}>Copy</button>
                <button><a href={`${SERVER_URL}/file/${fileName}`} target="_blank">View</a></button>
                <button disabled={deleting} onClick={deleteMedia}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </footer>
            {feedback && <p className="media-feedback">{feedback}</p>}
        </div>
    )
}
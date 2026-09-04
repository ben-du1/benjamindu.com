import {useRef,useState} from 'react'
import SERVER_URL from '../lib/SERVER_URL'

export default function UploadMedia({show, onUploaded}) {

    const [file,setFile] = useState()
    const [feedback, setFeedback] = useState('')
    const [uploading,setUploading] = useState(false)
    const fileInput = useRef(null)

    const uploadFile = async () => {
        if (file == null || file == undefined) {
            setFeedback('Please select a file')
            return
        }
        
        setUploading(true)
        setFeedback('Uploading...')
        
        const formData = new FormData()
        formData.append('file',file)
        formData.append('password',sessionStorage.getItem('password'))

        try {
            const result = await fetch(SERVER_URL+'/upload',{
                method:'POST',
                body:formData
            })

            const status = result.status

            if (status == 200) {
                setFeedback('Upload successful!')
                setFile(null)
                if (fileInput.current) fileInput.current.value = ''
                if (onUploaded) onUploaded()
            } else {
                setFeedback('Upload failed')
            }
        } catch (err) {
            setFeedback('Error: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="UploadMedia">
            {
                show ?
                <>
                    <input ref={fileInput} type="file" onChange={(e) => {setFile(e.target.files[0])}} />
                    <button disabled={uploading} onClick={uploadFile}>{uploading ? 'Uploading...' : 'Upload'}</button>
                    {feedback && <p>{feedback}</p>}
                </>
                :
                ''
            }
            
        </div>
    )
}
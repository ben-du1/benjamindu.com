import {useState} from 'react'
import SERVER_URL from '../lib/SERVER_URL'

export default function UploadMedia({show}) {

    const [file,setFile] = useState()
    const [feedback, setFeedback] = useState('')

    const uploadFile = async () => {
        if (file == null || file == undefined) {
            setFeedback('Please select a file')
            return
        }
        
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
            } else {
                setFeedback('Upload failed')
            }
        } catch (err) {
            setFeedback('Error: ' + err.message)
        }
    }

    return (
        <div className="UploadMedia">
            {
                show ?
                <>
                    <input type="file" onChange={(e) => {setFile(e.target.files[0])}} />
                    <button onClick={uploadFile}>Upload</button>
                    {feedback && <p>{feedback}</p>}
                </>
                :
                ''
            }
            
        </div>
    )
}
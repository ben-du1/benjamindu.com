import {useState} from 'react'
import SERVER_URL from '../lib/SERVER_URL'

export default function UploadMedia({show}) {

    const [file,setFile] = useState()

    const uploadFile = async () => {
        if (file == null || file == undefined) {
            console.log('failure')
            return
        }
        const formData = new FormData()
        formData.append('file',file)
        formData.append('password',sessionStorage.getItem('password'))

        const result = await fetch(SERVER_URL+'/upload',{
            method:'POST',
            body:formData
        })

        const status = result.status

        if (status == 200) {
            console.log('success')
        } else {
            console.log('failure')
        }
    }

    return (
        <div className="UploadMedia">
            {
                show ?
                <>
                    <input type="file" onChange={(e) => {setFile(e.target.files[0])}} />
                    <button onClick={uploadFile}>Upload</button>
                </>
                :
                ''
            }
            
        </div>
    )
}
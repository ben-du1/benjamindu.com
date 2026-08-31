import { useEffect,useState } from "react";
import SERVER_URL from "../../lib/SERVER_URL";

export default function Media({fileName}) {

    const [isImage,setIsImage] = useState(false)

    useEffect(() => {
        const fileType = fileName.split('.').at(-1).toLowerCase()
        setIsImage(['jpeg','png','jpg','svg','gif','webp'].includes(fileType))
    },[])

    const deleteMedia = async () => {
        const response = await fetch(SERVER_URL+"/deletefile",{
            method:"POST",
            headers:{'content-type':'application/json'},
            body: JSON.stringify({
                "fileName":fileName,
                'password':sessionStorage.getItem('password')
            })
        })
        response.status == 200 ? console.log('success') : console.log('failure')
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
                <button onClick={deleteMedia}>Delete</button>
            </footer>
        </div>
    )
}
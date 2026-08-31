import {useState} from 'react'
import SERVER_URL from '../lib/SERVER_URL'

export default function NewPost({show}) {

    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [date,setDate] = useState('')
    const [content,setContent] = useState('')
    const [image,setImage] = useState('')

    const createPost = async () => {
        const response = await fetch(SERVER_URL+'/createpost',{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({
                "password":sessionStorage.getItem('password'),
                "title":title,
                "description":description,
                "date":date,
                "content":content,
                "image":image
            })
        })
        const status = response.status 

        if (status === 200) {
            console.log("success")
        } else {
            console.log("failure")
        }
    }

    return (
        <div className="NewPost">
            {
                show === true ? (
                    <>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Date (M.D.Y)" value={date} onChange={(e) => setDate(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Image Link" value={image} onChange={(e) => setImage(e.target.value)}></input> <br/>
                    <textarea type="text" placeholder="Content (Markdown)" value={content} onChange={(e) => setContent(e.target.value)}></textarea> <br/>
                    <button onClick={createPost}>Create</button>
                    </>
                ): ''
            }
            
        </div>
    )
}
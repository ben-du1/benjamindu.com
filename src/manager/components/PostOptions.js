import {useState} from 'react'
import SERVER_URL from '../../lib/SERVER_URL'

export default function PostOptions({reloadPosts,post}) {
    const [title,setTitle] = useState(post.title)
    const [description,setDescription] = useState(post.description)
    const [date,setDate] = useState(post.date)
    const [content,setContent] = useState(post.content)
    const [image,setImage] = useState(post.image)
    const [showMore,setShowMore] = useState(false)

    const updatePost = async () => {
        const response = await fetch(SERVER_URL+"/updatepost",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                'password':sessionStorage.getItem('password'),
                'id':post.id,
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

    const deletePost = async () => {
        const response = await fetch(SERVER_URL+"/delete",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                'id':post.id,
                'password':sessionStorage.getItem('password')
            })
        })

        const status = response.status
        if (status === 200) {
            console.log("success")
            reloadPosts()
        } else {
            console.log("failure")
        }
    }

    return (
        <div>
            <h3>{post.title} <button onClick={(e) => {setShowMore(!showMore)}}>Manage</button><button onClick={deletePost}>Delete</button></h3>

            {
                showMore ? 
                <>
                <input type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input> <br/>
                <input type="text" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input> <br/>
                <input type="text" value={date} placeholder="Date (M.D.Y)" onChange={(e) => setDate(e.target.value)}></input> <br/>
                <input type="text" value={image} placehodler="Image Link" onChange={(e) => setImage(e.target.value)}></input> <br />
                <textarea type="text" value={content} placeholder="Content (Markdown)" onChange={(e) => setContent(e.target.value)}></textarea> <br/>
                <button onClick={updatePost}>Save</button>
                </>
                : ''
            }
        </div> 
    )
}
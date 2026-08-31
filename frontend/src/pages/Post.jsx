import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router";
import { useEffect,useState } from "react";
import SERVER_URL from "../lib/SERVER_URL";

export default function Post () {
    const {postId} = useParams()

    const [title,setTitle] = useState()
    const [description,setDescription] = useState()
    const [date,setDate] = useState()
    const [image,setImage] = useState()
    const [content,setContent] = useState('')

    
    const getPost = async () => {
        const response = await fetch(SERVER_URL+'/post?id='+postId)
        const data = await response.json()
        setTitle(data.title)
        setDescription(data.description)
        setDate(data.date)
        setContent(data.content)
        setImage(data.image)
    }

    useEffect(() => {
        getPost()
    },[postId])

    return (
        <div className="Post">
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
            <img src={image} />
            <div className='markdown'>

            <Markdown remarkPlugins={[remarkGfm]}>
                {content}
            </Markdown> 
            </div>
        </div>
    )
}
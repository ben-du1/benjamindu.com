import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { useParams } from "react-router";
import { useEffect,useState } from "react";
import SERVER_URL from "../lib/SERVER_URL";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

export default function Post () {
    const {postSlug} = useParams()

    const [title,setTitle] = useState()
    const [description,setDescription] = useState()
    const [date,setDate] = useState()
    const [image,setImage] = useState()
    const [content,setContent] = useState('')
    const [error, setError] = useState(null)

    
    const getPost = async () => {
        try {
            const response = await fetch(SERVER_URL+'/post/' + encodeURIComponent(postSlug))
            if (!response.ok) {
                throw new Error('Failed to fetch post')
            }
            const data = await response.json()
            setTitle(data.title)
            setDescription(data.description)
            setDate(data.date)
            setContent(data.content)
            setImage(data.image)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error(err)
        }
    }

    useEffect(() => {
        if (postSlug) {
            getPost()
        }
    },[postSlug])

    if (error) {
        return <div className="Post"><h1>Error: {error}</h1></div>
    }

    return (
        <div className="Post">
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
            <img src={image} alt={title} />
            <div className='markdown'>

            <Markdown
                remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeSanitize,
                    rehypeKatex,
                    rehypeHighlight
                ]}
            >
                {content}
            </Markdown> 
            </div>
        </div>
    )
}
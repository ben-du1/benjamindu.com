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
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        let current = true

        if (!postSlug) {
            setLoading(false)
            setError('Post not found')
            return () => controller.abort()
        }

        setLoading(true)
        setError(null)
        setTitle(undefined)
        setDescription(undefined)
        setDate(undefined)
        setContent('')
        setImage(undefined)

        fetch(SERVER_URL+'/post/' + encodeURIComponent(postSlug), {signal:controller.signal})
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch post')
                return response.json()
            })
            .then((data) => {
                if (!current) return
                setTitle(data.title)
                setDescription(data.description)
                setDate(data.date)
                setContent(data.content)
                setImage(data.image)
                setError(null)
            })
            .catch((err) => {
                if (err.name === 'AbortError' || !current) return
                setError(err.message)
                console.error(err)
            })
            .finally(() => {
                if (current) setLoading(false)
            })

        return () => {
            current = false
            controller.abort()
        }
    },[postSlug])

    if (error) {
        return <div className="Post"><h1>Error: {error}</h1></div>
    }
    if (loading) {
        return <div className="Post"><h1>Loading...</h1></div>
    }

    return (
        <div className="Post">
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
            <img src={image} alt={title || 'Post image'} />
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
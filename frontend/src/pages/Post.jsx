import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { useParams } from "react-router";
import { useEffect,useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import SERVER_URL from "../lib/SERVER_URL";
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
    const [shareFeedback,setShareFeedback] = useState('')

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

    const sharePost = async () => {
        setShareFeedback('')
        const shareData = {
            title: title || 'Ben Du',
            text: description || title || '',
            url: window.location.href
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                setShareFeedback('Shared')
            } else {
                await navigator.clipboard.writeText(shareData.url)
                setShareFeedback('Link copied!')
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setShareFeedback('Unable to share')
            }
        }
    }

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
        setShareFeedback('')

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
                <br/>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
            <div className="Post-meta">
                <span>{readingMinutes} min read</span>
                <button type="button" onClick={sharePost} aria-label="Share this post">
                    <FaShareAlt aria-hidden="true" />
                    <span>Share</span>
                </button>
                {shareFeedback && <span className="Post-share-feedback" role="status">{shareFeedback}</span>}
            </div>
            <img src={image} alt={title || 'Post image'} />
            <div className='markdown'>

            <Markdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeSanitize,
                    rehypeHighlight
                ]}
            >
                {content}
            </Markdown> 
            </div>
        </div>
    )
}
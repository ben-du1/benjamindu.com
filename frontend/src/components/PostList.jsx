import Container from "./Container";
import {useState, useEffect} from 'react'
import SERVER_URL from "../lib/SERVER_URL";

export default function PostList() {

    const [posts, setPosts] = useState([])
    const [error, setError] = useState(null)
    const [showFun, setShowFun] = useState(false)

    const getPosts = async () => {
        try {
            const response = await fetch(SERVER_URL+'/posts')
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const data = await response.json()
            const normalizedPosts = Array.isArray(data)
                ? data.filter((post) => post && typeof post === 'object').map((post) => ({
                    ...post,
                    category: post.category === 'fun' ? 'fun' : 'serious'
                }))
                : []
            setPosts(normalizedPosts)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error(err)
        }
    }


    useEffect(() => {
        getPosts()
    },[])
   

    if (error) {
        return <div className="PostList"><h2>Error: {error}</h2></div>
    }

    return (
        <div className="PostList">
            <div className="project-list-header">
                <h1>My Projects</h1>
                <div className="project-filter">
                    <span>Just For Fun <span className="project-filter-help" aria-hidden="true">(?)<span className="project-filter-tooltip" role="tooltip">Toggle for fun projects</span></span></span>
                    <label className="project-switch">
                        <input type="checkbox" checked={showFun} onChange={(e) => setShowFun(e.target.checked)} />
                        <span className="project-slider" aria-hidden="true"></span>
                    </label>
                </div>
            </div>
           {posts.filter((post) => (post.category || 'serious') === (showFun ? 'fun' : 'serious')).map((post) => (
            <Container key={post.id} title={post.title} description={post.description} date={post.date} postId={post.id} slug={post.slug} image={post.image} keywords={Array.isArray(post.keywords) ? post.keywords : []}/>
           ))}
        </div>
    )
}
import Container from "./Container";
import {useState, useEffect} from 'react'
import SERVER_URL from "../lib/SERVER_URL";

export default function PostList() {

    const [posts, setPosts] = useState([])
    const [error, setError] = useState(null)

    const getPosts = async () => {
        try {
            const response = await fetch(SERVER_URL+'/posts')
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const data = await response.json()
            if(data && data.length > 0) {
                setPosts(data)
                setError(null)
            }
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
            <h1>My Projects</h1>
           {posts.map((post) => (
            <Container key={post.id} title={post.title} description={post.description} date={post.date} postId={post.id} slug={post.slug} image={post.image}/>
           ))}
        </div>
    )
}
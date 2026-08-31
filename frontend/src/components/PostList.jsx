import Container from "./Container";
import {useState, useEffect} from 'react'
import SERVER_URL from "../lib/SERVER_URL";

export default function PostList() {

    const [posts, setPosts] = useState([])

    const getPosts = async () => {
        const response = await fetch(SERVER_URL+'/posts')
        const data = await response.json()
        if(data.length > 0) {
            setPosts(data.reverse())
        }
    }


    useEffect(() => {
        getPosts()
    },[])
   

    return (
        <div className="PostList">
           {posts.map((post) => (
            <Container title={post.title} description={post.description} date={post.date} postId={post.id} image={post.image}/>
           ))}
        </div>
    )
}
import {useState,useEffect} from 'react'
import SERVER_URL from '../lib/SERVER_URL'
import PostOptions from './components/PostOptions'

export default function ManagePosts({show}) {

    const [posts, setPosts] = useState([])

    const getPosts = async () => {
        const response = await fetch(SERVER_URL+'/posts')
        const data = await response.json()
        if (data.length > 0) {
            setPosts(data.reverse())
        }
    }



    useEffect(() => {
        getPosts()
    },[])

   
    return (
        <div className="ManagePosts">
            {show === true ? 
                posts.map((post) => (
                <PostOptions reloadPosts={getPosts} post={post} />
                       ))
            : ''}
            
        </div>
    )
}
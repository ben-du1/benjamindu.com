import {useState} from 'react'
import SERVER_URL from '../../lib/SERVER_URL'

export default function PostOptions({reloadPosts,post,canMoveUp,canMoveDown,canReorder,moveUp,moveDown}) {
    const [title,setTitle] = useState(post.title)
    const [slug,setSlug] = useState(post.slug)
    const [description,setDescription] = useState(post.description)
    const [date,setDate] = useState(post.date)
    const [content,setContent] = useState(post.content)
    const [image,setImage] = useState(post.image)
    const [category,setCategory] = useState(post.category || 'serious')
    const [keywords,setKeywords] = useState((post.keywords || []).join(', '))
    const [showMore,setShowMore] = useState(false)
    const [saving,setSaving] = useState(false)
    const [feedback,setFeedback] = useState('')
    const [deleting,setDeleting] = useState(false)

    const updatePost = async () => {
        setSaving(true)
        setFeedback('Saving...')
        try {
            const response = await fetch(SERVER_URL+"/updatepost",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({
                    'password':sessionStorage.getItem('password'),
                    'id':post.id,
                    "title":title,
                    "slug":slug,
                    "description":description,
                    "date":date,
                    "content":content,
                    "image":image
                    ,"category":category
                    ,"keywords":keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
                })
            })

            if (!response.ok) throw new Error('Failed to save post')
            setFeedback('Saved successfully')
            reloadPosts()
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setSaving(false)
        }
    }

    const deletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return
        }
        
        setDeleting(true)
        setFeedback('Deleting...')
        try {
            const response = await fetch(SERVER_URL+"/delete",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({
                    'id':post.id,
                    'password':sessionStorage.getItem('password')
                })
            })

            if (!response.ok) throw new Error('Failed to delete post')
            reloadPosts()
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            <h3>
                <span>{post.title}</span>
                <span className="post-order-controls">
                    <button disabled={!canMoveUp || !canReorder} onClick={moveUp}>Up</button>
                    <button disabled={!canMoveDown || !canReorder} onClick={moveDown}>Down</button>
                </span>
                <button onClick={(e) => {setShowMore(!showMore)}}>Manage</button>
                <button disabled={deleting} onClick={deletePost}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </h3>

            {
                showMore ? 
                <>
                <input type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input> <br/>
                <input type="text" value={slug} placeholder="Slug" onChange={(e) => setSlug(e.target.value)}></input> <br/>
                <input type="text" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input> <br/>
                <input type="text" value={date} placeholder="Date (M.D.Y)" onChange={(e) => setDate(e.target.value)}></input> <br/>
                <input type="text" value={image} placeholder="Image Link" onChange={(e) => setImage(e.target.value)}></input> <br />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="serious">Serious</option>
                    <option value="fun">Fun</option>
                </select> <br/>
                <input type="text" value={keywords} placeholder="Keywords (comma-separated)" onChange={(e) => setKeywords(e.target.value)}></input> <br/>
                <textarea type="text" value={content} placeholder="Content (Markdown)" onChange={(e) => setContent(e.target.value)}></textarea> <br/>
                <button disabled={saving} onClick={updatePost}>{saving ? 'Saving...' : 'Save'}</button>
                {feedback && <p className="console-feedback">{feedback}</p>}
                </>
                : ''
            }
        </div> 
    )
}
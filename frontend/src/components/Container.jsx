import { Link } from "react-router"

export default function Container({title,description,date,postId,slug,image,keywords = []}) {
    const postSlug = slug || postId

    return (
        <Link to={"/p/" + encodeURIComponent(postSlug)}>
        <div className="Container" id={postId}>
            <div className="img-container">
                <img src={image} alt={title} />
            </div>
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
                {keywords.length > 0 && (
                    <div className="post-keywords" aria-label="Keywords">
                        {keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                    </div>
                )}
            </header>
        </div>
        </Link>
    )
}
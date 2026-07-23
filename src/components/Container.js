import { Link } from "react-router"

export default function Container({title,description,date,postId,image}) {
    return (
        <Link to={"/post/"+postId}>
        <div className="Container" id={postId}>
            <img src={image} />
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
        </div>
        </Link>
    )
}
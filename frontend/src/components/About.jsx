export default function About() {
    return (
        <div className="About">
            <div className="img-container">
                <img src="assets/websiteshot.webp"/>
            </div>
            <div className="about-content">
                <h1>Hi, I'm Ben.</h1>
                <br />
                <h3>In 3 Seconds:</h3>
                <span className="keyword">Electrical Engineering</span> at UCLA. No black boxes, EVER!!
                <br />
                <br />
                <h3>In 10 Seconds:</h3>
                I'm interested in embedded systems, machine learning, computer architecture, communication protocols, and full-stack web development. <span className="keyword">This site is self hosted!</span>
                <br />
                <br />
                <h3>In 30 Seconds:</h3>
                My broad focus is designing fault-resistant, <span className="keyword">high-precision systems</span>. I enjoy building modularly from the ground up, with an emphasis on systems that can be expanded over time. As a non-profit and student government leader, I love meeting new people and learning about their unique stories. In my free time, I like to run in loops, <span className="keyword">review dorm food</span>, and solo backpack.
            </div>
        </div>
    )
}
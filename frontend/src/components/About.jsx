export default function About() {
    return (
        <div className="About">
            <div className="img-container">
                <img src="assets/websiteshot.webp" alt="Screenshot of Ben's website"/>
            </div>
            <div className="about-content">
                <h1>Hi, I'm Ben.</h1>
                <br />
                <h3>In 3 Seconds:</h3>
                <a className="keyword" href="https://www.ee.ucla.edu/" target="_blank" rel="noreferrer">Electrical Engineering</a> at UCLA. No black boxes, EVER!!
                <br />
                <br />
                <h3>In 10 Seconds:</h3>
                I'm interested in embedded systems, machine learning, computer architecture, communication protocols, and full-stack web development. <a className="keyword" href="https://github.com/ben-du1/benjamindu.com" target="_blank" rel="noreferrer">This site is open source!</a>
                <br />
                <br />
                <h3>In 30 Seconds:</h3>
                My broad focus is designing fault-resistant, high-precision systems. I enjoy building modularly from the ground up, with an emphasis on systems that can be expanded over time. As a <a className="keyword" href="https://novaspero.org" target="_blank" rel="noreferrer">non-profit</a> and student government leader, I love meeting new people and learning about their unique stories. In my free time, I like to run in loops, <a className="keyword" href="https://www.instagram.com/uclalunchreview" target="_blank" rel="noreferrer">review dorm food</a>, and solo backpack.
            </div>
        </div>
    )
}
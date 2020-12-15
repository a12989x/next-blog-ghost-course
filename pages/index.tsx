import Head from 'next/head';
import Link from 'next/link';

const { BASE_URL, CONTENT_API_KEY } = process.env;

type Post = {
    title: string;
    slug: string;
};

async function getPosts() {
    const res = await fetch(
        `${BASE_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`
    );
    const data = await res.json();
    const posts = data.posts;
    return posts;
}

export const getStaticProps = async ({ params }) => {
    const posts = await getPosts();

    return { props: { posts } };
};

const Home: React.FC<{ posts: Post[] }> = (props) => {
    const { posts } = props;

    return (
        <div className='home'>
            <Head>
                <title>My Blog</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>
            <div className='home__container'>
                <h1 className='home__title'>Welcome to my blog</h1>
                <ul className='home__blogList'>
                    {posts.map((post) => (
                        <li className='home__blogItem' key={post.slug}>
                            <Link href='/post/[slug]' as={`/post/${post.slug}`}>
                                <a>{post.title}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;

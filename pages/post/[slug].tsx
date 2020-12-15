import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const { BASE_URL, CONTENT_API_KEY } = process.env;

type Post = {
    title: string;
    html: string;
    slug: string;
};

async function getPost(slug: string) {
    const res = await fetch(
        `${BASE_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`
    );
    const data = await res.json();
    const posts = data.posts;

    return posts[0];
}

export const getStaticProps = async ({ params }) => {
    const post = await getPost(params.slug);

    return { revalidate: 10, props: { post } };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: true };
};

const Post: React.FC<{ post: Post }> = (props) => {
    const router = useRouter();

    const { post } = props;
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true);

    const loadComments = () => {
        setEnableLoadComments(false);

        (window as any).disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = post.slug;
        };

        const script = document.createElement('script');
        script.src = 'https://next-blog-ghost-course.disqus.com/embed.js';
        script.setAttribute('data-timestamp', Date.now().toString());

        document.body.appendChild(script);
    };

    if (router.isFallback) return <h1>Loading...</h1>;

    return (
        <div className='post'>
            <Link href='/'>
                <a className='post__back'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='#2b2b2b'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='feather feather-arrow-left'
                    >
                        <line x1='19' y1='12' x2='5' y2='12'></line>
                        <polyline points='12 19 5 12 12 5'></polyline>
                    </svg>
                    Go Back
                </a>
            </Link>
            <div className='post__container'>
                <h1 className='post__title'>{post.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
                {enableLoadComments && (
                    <button
                        className='post__loadComments'
                        onClick={loadComments}
                    >
                        Load Comments
                    </button>
                )}
                <div id='disqus_thread'></div>
            </div>
        </div>
    );
};

export default Post;

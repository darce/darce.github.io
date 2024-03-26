import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

interface ProjectProps {
    frontMatter: {
        index: number
        year: number
        title: string
        subtitle: string
        description: string
        details: string
        links: string[]
        images: string[]
        tags: string[]
    }
    content: string
}

const ProjectPage: NextPage<ProjectProps> = ({ frontMatter, content }) => {
    return (
        <>
            <h1>{frontMatter.title}</h1>
            <p>{frontMatter.subtitle}</p>
            <p>{frontMatter.description}</p>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const files = fs.readdirSync(path.join('content'))

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.md', ''),
        },
    }))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<ProjectProps> = async ({ params }) => {
    const slug = params?.slug as string;
    const markdownWithMeta = fs.readFileSync(path.join('content', slug + '.md'), 'utf-8');
    const { data, content } = matter(markdownWithMeta);

    const frontMatter: ProjectProps['frontMatter'] = {
        index: data.index,
        year: data.year,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        details: data.details,
        links: data.links,
        images: data.images,
        tags: data.tags,
    }

    return {
        props: {
            frontMatter,
            content,
        },
    };
};

export default ProjectPage;
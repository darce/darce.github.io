import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { parseMarkdownFile } from '../lib/parseMarkdown'
import { FrontMatter } from '../types'
import { MDXRemote } from 'next-mdx-remote';

import fs from 'fs'
import path from 'path'

interface ProjectProps {
    frontMatter: FrontMatter
    mdxSource: any
}

const ProjectPage: NextPage<ProjectProps> = ({ frontMatter, mdxSource }) => {
    return (
        <>
            <h1>{frontMatter.title}</h1>
            <p>{frontMatter.subtitle}</p>
            <p>{frontMatter.description}</p>
            <MDXRemote {...mdxSource} />
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const files = fs.readdirSync(path.join('content'))

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.mdx', ''),
        },
    }))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<ProjectProps> = async ({ params }) => {
    const slug = params?.slug as string;
    const filePath = path.join('content', slug + '.mdx')
    const { frontMatter, mdxSource } = await parseMarkdownFile(filePath)

    return {
        props: {
            frontMatter,
            mdxSource,
        },
    };
};

export default ProjectPage;
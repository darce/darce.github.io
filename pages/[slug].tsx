import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { parseMarkdownFile } from '../lib/markdownUtils'
import { MetaData } from '../types'
import { MDXRemote } from 'next-mdx-remote';

import fs from 'fs'
import path from 'path'

interface ProjectProps {
    metaData: MetaData
    mdxSource: any
}

const ProjectPage: NextPage<ProjectProps> = ({ metaData, mdxSource }) => {
    return (
        <>
            <h1>{metaData.title}</h1>
            <p>{metaData.subtitle}</p>
            <p>{metaData.description}</p>
            <MDXRemote {...mdxSource} />
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    /** Content is only in the 'projects' subdirectory */
    const files = fs.readdirSync(path.join('content', 'projects'))
    const paths = files.filter(file => file.endsWith('.mdx'))
        .map((filename) => ({
            params: {
                slug: filename.replace('.mdx', ''),
            }
        }))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<ProjectProps> = async ({ params }) => {
    const slug = params?.slug as string;
    const filePath = path.join('content', 'projects', `${slug}.mdx`)
    const { metaData, mdxSource } = await parseMarkdownFile(filePath)

    return {
        props: {
            metaData,
            mdxSource,
        },
    };
};

export default ProjectPage;
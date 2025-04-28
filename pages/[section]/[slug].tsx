import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { MetaData } from '../../types'
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
    const sections = ['projects'];

    /** return flat array of paths to use in getStaticProps. slug is inferred from filename. */
    const paths = sections.flatMap(section => {
        const dirPath = path.join('content', section);
        if (!fs.existsSync(dirPath)) return [];

        return fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.mdx'))
            .map((filename) => ({
                params: {
                    section,
                    slug: filename.replace('.mdx', ''),
                }
            }));
    });

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<ProjectProps> = async ({ params }) => {
    const section = params?.section as string;
    const slug = params?.slug as string;
    const filePath = path.join('content', section, `${slug}.mdx`)
    const { metaData, mdxSource } = await parseMarkdownFile(filePath)

    return {
        props: {
            metaData,
            mdxSource,
        },
    };
};

export default ProjectPage;
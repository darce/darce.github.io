import { ReactElement } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import type { NextPageWithLayout } from '../_app'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { getMdxContent } from '../../lib/getMdxContent'
import { MarkdownData } from '../../types'
import Layout from '../../components/layout/Layout'
import Menu from '../../components/composite/Menu/Menu'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import fs from 'fs'
import path from 'path'

interface ProjectPageProps {
    projectData: MarkdownData
    projectsData: MarkdownData[]
}

const ProjectPage: NextPageWithLayout<ProjectPageProps> = ({ projectData, projectsData }) => {
    const router = useRouter()

    const handleSelectProject = (project: MarkdownData) => {
        router.push(`/projects/${project.slug}`)
    }

    return (
        <main className="content">
            <Menu
                className="menu"
                projects={projectsData}
                selectedProject={projectData}
                onSelectProject={handleSelectProject}
            />
            <ProjectDetails className="projectDetails" project={projectData} />
        </main>
    )
}

ProjectPage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
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

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({ params }) => {
    const section = params?.section as string;
    const slug = params?.slug as string;
    const filePath = path.join('content', section, `${slug}.mdx`)
    const { metaData, mdxSource } = await parseMarkdownFile(filePath)

    // Get header data for Layout
    const headerProps = await getMdxContent({ subDir: 'header' })
    // Get all projects for Menu navigation
    const projectsProps = await getMdxContent({ subDir: 'projects' })

    return {
        props: {
            projectData: {
                slug,
                metaData,
                mdxSource,
            },
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        },
    };
};

export default ProjectPage;
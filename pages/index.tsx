import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'
import { GetStaticProps } from 'next'
import { parseMarkdownFile, FrontMatter } from '../utils/parseMarkdown'
import fs from 'fs'
import path from 'path'
import { useState } from 'react'

interface ProjectData {
    slug: string
    frontMatter: FrontMatter
    content: string
}

interface HomeProps {
    projects: ProjectData[]
}

const Home: NextPageWithLayout<HomeProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

    return (
        <>
            <h1>Daniel Arc&eacute;</h1>
            <h2>Front End Development & Interface Implementation</h2>

            <ul>
                {projects.map((project) => (
                    <li key={project.slug}>
                        <h2>{project.frontMatter.title}</h2>
                        <p>{project.frontMatter.subtitle}</p>
                        <p>{project.frontMatter.description}</p>
                        <button onClick={() => setSelectedProject(project)}>View Details</button>
                    </li>
                ))}
            </ul>
            {selectedProject && (
                <div>
                    <h3>{selectedProject.frontMatter.title}</h3>
                    <p>{selectedProject.frontMatter.details}</p>
                    <div dangerouslySetInnerHTML={{ __html: selectedProject.content }}></div>
                    <button onClick={() => setSelectedProject(null)}>Close</button>
                </div>
            )}
        </>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const files = fs.readdirSync(path.join('content'))

    const projects = files.map((filename) => {
        const slug = filename.replace('.md', '')
        const filePath = path.join('content', filename)
        const { frontMatter, content } = parseMarkdownFile(filePath)

        return {
            slug,
            frontMatter,
            content
        }
    })

    return {
        props: {
            projects,
        }
    }
}
export default Home
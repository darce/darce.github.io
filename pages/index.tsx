import type { ReactElement } from 'react'
import fs from 'fs'
import path from 'path'
import { useState } from 'react'

import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'
import { GetStaticProps } from 'next'
import { parseMarkdownFile } from '../utils/parseMarkdown'
import { ProjectData } from '../types'

import Menu from '../components/menu'
import ProjectDetails from '../components/projectDetails'

interface HomeProps {
    projects: ProjectData[]
}

const Home: NextPageWithLayout<HomeProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

    const handleSelectedProject = (project: ProjectData) => {
        setSelectedProject(project)
    }

    const handleCloseProject = () => {
        setSelectedProject(null)
    }
    return (
        <>
            <h1>Daniel Arc&eacute;</h1>
            <h2>Front End Development & Interface Implementation</h2>
            <Menu projects={projects} onSelectProject={handleSelectedProject} />
            {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProject} />}
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
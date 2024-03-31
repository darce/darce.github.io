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

import Header from '../components/header'
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

    const masthead = {
        title: 'Daniel Arcé',
        subtitle: 'Front End Development & Interface Implementation'
    }

    return (
        <div className="flex flex-col h-screen">
            <Header className="h-1/3" masthead={masthead} />
            <div className="flex flex-grow">
                <Menu projects={projects} onSelectProject={handleSelectedProject} className="w-1/3 h-2/3" />
                {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProject} className="w-2/3 h-2/3" />}
            </div>

        </div>
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
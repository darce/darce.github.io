import type { ReactElement } from 'react'

import Layout from '../components/Layout'
import type { NextPageWithLayout } from './_app'
import { getStaticProps } from '../utils/getMdxContent'
import { ProjectData } from '../types'
import { useSelectedProject } from '../hooks/useSelectedProject'

import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'
import ProjectDetails from '../components/ProjectDetails/ProjectDetails'

interface HomeProps {
    projects: ProjectData[]
}

const Home: NextPageWithLayout<HomeProps> = ({ projects }) => {
    const { selectedProject, handleSelectedProject, handleCloseProject } = useSelectedProject()

    const masthead = {
        title: 'Daniel Arcé',
        subtitle: 'Front End Development & Interface Implementation'
    }

    return (
        <>
            <Header className="header" masthead={masthead} />
            <Menu className="menu" projects={projects} onSelectProject={handleSelectedProject} />
            {selectedProject &&
                <ProjectDetails className="projectDetails" key={selectedProject.frontMatter.index} project={selectedProject} onClose={handleCloseProject} />}
        </>
    )
}

Home.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build */
export { getStaticProps }

export default Home
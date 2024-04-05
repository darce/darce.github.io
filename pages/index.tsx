import type { ReactElement } from 'react'

import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'
import { getStaticProps } from '../utils/getMdxContent'
import { ProjectData } from '../types'
import { useSelectedProject } from '../hooks/useSelectedProject'

import Header from '../components/header'
import Menu from '../components/menu'
import ProjectDetails from '../components/projectDetails'

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
                <ProjectDetails className="w-2/3 h-2/3" project={selectedProject} onClose={handleCloseProject} />}
        </>
    )
}

Home.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}

/** Call getStaticProps on build */
export { getStaticProps }

export default Home
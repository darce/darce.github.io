import { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { MarkdownData } from '../types'
import Layout from '../components/Layout'
import Work from '../components/Work/Work'
import { ProjectDataProvider } from '../contexts/ProjectsContext'

interface HomePageProps {
    projectsData: MarkdownData[]
}

const HomePage: NextPageWithLayout<HomePageProps> = ({ projectsData }) => {
    console.log('projectsData, index', projectsData)
    return (
        <ProjectDataProvider projectsData={projectsData}>
            <Work projectsData={projectsData} />
        </ProjectDataProvider>
    )
}

HomePage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default HomePage
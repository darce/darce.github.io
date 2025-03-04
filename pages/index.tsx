import { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { MarkdownData } from '../types'
import Layout from '../components/Layout'
import Work from '../components/Work/Work'
import { ProjectDataProvider } from '../contexts/ProjectsContext'
import { getMdxContent } from '../lib/getMdxContent'
interface HomePageProps {
    projectsData: MarkdownData[]
}

interface HomePageProps {
    projectsData: MarkdownData[]
    headerData: MarkdownData[]
}

const HomePage: NextPageWithLayout<HomePageProps> = ({ projectsData, headerData }) => {
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

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const projectsProps = await getMdxContent({ subDir: 'projects' })
    const headerProps = await getMdxContent({ subDir: 'header' })
    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default HomePage